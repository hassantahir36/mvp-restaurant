import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { initialOrdersState, ordersReducer } from '../reducers/ordersReducer';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const ORDERS_KEY = '@restaurant/orders';
const OrdersContext = createContext(undefined);
const TRACKING_STAGES = [
  { status: 'Preparing', afterMs: 10000 },
  { status: 'Ready', afterMs: 20000 },
  { status: 'Served', afterMs: 30000 },
];
const STATUS_RANK = { Pending: 0, Preparing: 1, Ready: 2, Served: 3 };

function normalizeApiOrder(o) {
  return {
    id: String(o._id || o.id),
    customerName: o.customer?.name || o.customerName || 'Customer',
    customerEmail: o.customer?.email || '',
    items: (o.items || []).map((item) => ({
      id: String(item._id || item.menuItem || item.id || Math.random()),
      name: item.name || 'Item',
      quantity: item.quantity || 1,
      price: item.price || 0,
      note: item.note || '',
    })),
    totals: {
      grandTotal: o.totalAmount || o.totals?.grandTotal || 0,
    },
    status: o.status
      ? o.status.charAt(0).toUpperCase() + o.status.slice(1)
      : 'Pending',
    notes: o.notes || '',
    timestamp: o.createdAt || o.timestamp || new Date().toISOString(),
  };
}

export function OrdersProvider({ children }) {
  const { token, user } = useAuth();
  const [state, dispatch] = useReducer(ordersReducer, initialOrdersState);
  const [isInitialized, setIsInitialized] = useState(false);
  // Manager-only: all orders fetched from API
  const [allOrders, setAllOrders] = useState([]);

  // Customer: restore local orders from AsyncStorage
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(ORDERS_KEY)
      .then((saved) => {
        if (active && saved) dispatch({ type: 'LOAD_ORDERS', payload: JSON.parse(saved) });
      })
      .catch((error) => console.warn('Could not load orders:', error))
      .finally(() => { if (active) setIsInitialized(true); });
    return () => { active = false; };
  }, []);

  // Persist customer orders to AsyncStorage
  useEffect(() => {
    if (isInitialized) AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(state.orders)).catch(console.warn);
  }, [isInitialized, state.orders]);

  // Customer order auto-tracking timers
  useEffect(() => {
    if (!isInitialized) return undefined;
    const timerIds = [];
    state.orders.forEach((order) => {
      const elapsed = Date.now() - new Date(order.timestamp).getTime();
      TRACKING_STAGES.forEach((stage) => {
        if (STATUS_RANK[order.status] < STATUS_RANK[stage.status]) {
          const timerId = setTimeout(() => {
            dispatch({ type: 'UPDATE_STATUS', payload: { id: order.id, status: stage.status } });
          }, Math.max(0, stage.afterMs - elapsed));
          timerIds.push(timerId);
        }
      });
    });
    return () => timerIds.forEach((timerId) => clearTimeout(timerId));
  }, [isInitialized, state.orders]);

  // Manager: fetch all orders from API
  const refreshAllOrders = useCallback(async () => {
    if (!token || user?.role !== 'manager') return;
    try {
      const result = await api.getAllOrders(token);
      const raw = Array.isArray(result) ? result : result.orders || [];
      setAllOrders(raw.map(normalizeApiOrder));
    } catch (error) {
      console.error('Fetch all orders error:', error.message);
    }
  }, [token, user]);

  useEffect(() => {
    if (user?.role === 'manager') {
      refreshAllOrders();
    }
  }, [user, refreshAllOrders]);

  const placeOrder = useCallback((details) => {
    const order = {
      ...details,
      id: `ORD-${Date.now().toString().slice(-7)}`,
      status: 'Pending',
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'PLACE_ORDER', payload: order });
    return order;
  }, []);

  const updateOrderStatus = useCallback(
    async (id, status) => {
      if (user?.role === 'manager') {
        // Optimistic update for manager's allOrders list
        setAllOrders((current) =>
          current.map((o) =>
            String(o.id) === String(id) ? { ...o, status } : o,
          ),
        );
        if (token) {
          try {
            await api.updateOrderStatus(token, id, status.toLowerCase());
          } catch (error) {
            console.error('Update order status error:', error.message);
          }
        }
      } else {
        // Customer local state update
        dispatch({ type: 'UPDATE_STATUS', payload: { id, status } });
      }
    },
    [token, user],
  );

  // The "orders" exposed: manager gets allOrders from API, customer gets local state
  const orders = user?.role === 'manager' ? allOrders : state.orders;

  const value = useMemo(() => ({
    orders,
    isInitialized,
    placeOrder,
    updateOrderStatus,
    refreshAllOrders,
  }), [orders, isInitialized, placeOrder, updateOrderStatus, refreshAllOrders]);

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) throw new Error('useOrders must be used inside an OrdersProvider.');
  return context;
}
