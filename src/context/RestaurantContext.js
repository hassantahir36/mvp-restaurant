import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { initialMenuItems } from '../data/menu';
import { tables } from '../data/tables';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const RestaurantContext = createContext(undefined);

const excludedMenuNames = new Set(['test pizza', 'zinger burger']);

function normalizeMenuItem(item) {
  const name = String(item.name || '').trim().toLowerCase();

  const localItem = initialMenuItems.find(
    (sample) => sample.name.trim().toLowerCase() === name,
  );

  return {
    ...(localItem || {}),
    ...item,
    id: String(item._id || item.id),
    price: Number(item.price ?? localItem?.price ?? 0),
    image: localItem?.image || item.image || null,
    icon: localItem?.icon || item.icon || 'restaurant-outline',
    isAvailable:
      item.isAvailable ?? item.available ?? localItem?.isAvailable ?? true,
  };
}

function mergeMenuItems(databaseItems) {
  const normalizedDatabaseItems = databaseItems
    .filter(
      (item) =>
        !excludedMenuNames.has(
          String(item.name || '').trim().toLowerCase(),
        ),
    )
    .map(normalizeMenuItem);

  const databaseNames = new Set(
    normalizedDatabaseItems.map((item) =>
      item.name.trim().toLowerCase(),
    ),
  );

  const remainingSamples = initialMenuItems.filter(
    (sample) =>
      !databaseNames.has(sample.name.trim().toLowerCase()) &&
      !excludedMenuNames.has(sample.name.trim().toLowerCase()),
  );

  return [...normalizedDatabaseItems, ...remainingSamples];
}

function normalizeReservation(r) {
  return {
    id: String(r._id || r.id),
    customerName: r.customerName || r.customer?.name || 'Guest',
    phone: r.customerPhone || r.phone || '',
    date: r.date ? new Date(r.date).toLocaleDateString() : '',
    time: r.time || '',
    partySize: r.partySize || 1,
    tableId: r.tableId || '—',
    notes: r.notes || '',
    status: r.status
      ? r.status.charAt(0).toUpperCase() + r.status.slice(1)
      : 'Pending',
    customer: r.customer || null,
  };
}

export function RestaurantProvider({ children }) {
  const { token, user } = useAuth();

  const [menuItems, setMenuItems] = useState(
    initialMenuItems.filter(
      (item) =>
        !excludedMenuNames.has(item.name.trim().toLowerCase()),
    ),
  );

  const [reservations, setReservations] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [menuError, setMenuError] = useState('');

  // ── Fetch menu from API ──────────────────────────────────────────────────
  const refreshMenu = useCallback(async () => {
    try {
      setMenuError('');

      const result = await api.getMenu();
      const databaseItems = Array.isArray(result)
        ? result
        : result.menuItems || result.menu || result.data;

      if (!Array.isArray(databaseItems)) {
        throw new Error('Menu API response not in expected format.');
      }

      setMenuItems(mergeMenuItems(databaseItems));
    } catch (error) {
      setMenuError(error.message || 'Could not load menu.');
      console.error('Menu API error:', error);

      setMenuItems((current) =>
        current.length > 0
          ? current.filter(
              (item) =>
                !excludedMenuNames.has(
                  item.name.trim().toLowerCase(),
                ),
            )
          : initialMenuItems.filter(
              (item) =>
                !excludedMenuNames.has(
                  item.name.trim().toLowerCase(),
                ),
            ),
      );
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    refreshMenu();
  }, [refreshMenu]);

  // ── Fetch reservations (manager sees all, customer sees their own) ────────
  const refreshReservations = useCallback(async () => {
    if (!token) return;
    try {
      const isManager = user?.role === 'manager';
      const result = isManager
        ? await api.getAllReservations(token)
        : await api.getMyReservations(token);

      const raw = Array.isArray(result)
        ? result
        : result.reservations || [];

      setReservations(raw.map(normalizeReservation));
    } catch (error) {
      console.error('Reservations fetch error:', error.message);
    }
  }, [token, user]);

  useEffect(() => {
    refreshReservations();
  }, [refreshReservations]);

  // ── Menu management (Manager) ─────────────────────────────────────────────
  const addMenuItem = useCallback(
    async (item) => {
      if (
        excludedMenuNames.has(
          String(item.name || '').trim().toLowerCase(),
        )
      ) {
        return;
      }

      // Optimistic local add
      const tempId = `local-${Date.now()}`;
      setMenuItems((current) => [
        { ...item, id: tempId },
        ...current,
      ]);

      if (token) {
        try {
          const created = await api.createMenuItem(token, {
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            available: true,
          });
          // Replace temp entry with real DB id
          setMenuItems((current) =>
            current.map((m) =>
              m.id === tempId ? normalizeMenuItem(created) : m,
            ),
          );
        } catch (error) {
          console.error('Create menu item error:', error.message);
          // Revert on failure
          setMenuItems((current) => current.filter((m) => m.id !== tempId));
        }
      }
    },
    [token],
  );

  const updateMenuPrice = useCallback(
    async (id, price) => {
      // Optimistic update
      setMenuItems((current) =>
        current.map((item) =>
          String(item.id) === String(id)
            ? { ...item, price: Number(price) }
            : item,
        ),
      );

      if (token && !String(id).startsWith('local-')) {
        try {
          await api.updateMenuItem(token, id, { price: Number(price) });
        } catch (error) {
          console.error('Update price error:', error.message);
        }
      }
    },
    [token],
  );

  const toggleMenuAvailability = useCallback(
    async (id) => {
      let nextAvailable = true;
      // Optimistic toggle
      setMenuItems((current) =>
        current.map((item) => {
          if (String(item.id) === String(id)) {
            nextAvailable = !item.isAvailable;
            return { ...item, isAvailable: nextAvailable };
          }
          return item;
        }),
      );

      if (token && !String(id).startsWith('local-')) {
        try {
          await api.updateMenuItem(token, id, { available: nextAvailable });
        } catch (error) {
          console.error('Toggle availability error:', error.message);
        }
      }
    },
    [token],
  );

  // ── Reservation management ─────────────────────────────────────────────────
  const addReservation = useCallback((reservation) => {
    setReservations((current) => [reservation, ...current]);
  }, []);

  const cancelReservation = useCallback((id) => {
    setReservations((current) =>
      current.map((reservation) =>
        String(reservation.id || reservation._id) === String(id)
          ? { ...reservation, status: 'Cancelled' }
          : reservation,
      ),
    );
  }, []);

  const updateReservationStatus = useCallback(
    async (id, status) => {
      // Optimistic update
      setReservations((current) =>
        current.map((reservation) =>
          String(reservation.id || reservation._id) === String(id)
            ? { ...reservation, status }
            : reservation,
        ),
      );

      if (token) {
        try {
          // Map frontend status labels to backend lowercase values
          const backendStatus = status.toLowerCase();
          await api.updateReservationStatus(token, id, backendStatus);
        } catch (error) {
          console.error('Update reservation status error:', error.message);
        }
      }
    },
    [token],
  );

  const value = useMemo(
    () => ({
      menuItems,
      reservations,
      tables,
      isInitialized,
      menuError,
      refreshMenu,
      refreshReservations,
      addMenuItem,
      updateMenuPrice,
      toggleMenuAvailability,
      addReservation,
      cancelReservation,
      updateReservationStatus,
    }),
    [
      menuItems,
      reservations,
      isInitialized,
      menuError,
      refreshMenu,
      refreshReservations,
      addMenuItem,
      updateMenuPrice,
      toggleMenuAvailability,
      addReservation,
      cancelReservation,
      updateReservationStatus,
    ],
  );

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);

  if (!context) {
    throw new Error('useRestaurant must be used inside a RestaurantProvider.');
  }

  return context;
}