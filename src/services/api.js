const API_BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const { token, ...fetchOptions } = options;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...fetchOptions.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
}

export const api = {
  health: () => request('/health'),

  register: (details) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(details),
    }),

  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // ── Menu ──────────────────────────────────────────────────────────────────
  getMenu: () => request('/menu'),

  createMenuItem: (token, item) =>
    request('/menu', {
      method: 'POST',
      token,
      body: JSON.stringify(item),
    }),

  updateMenuItem: (token, id, fields) =>
    request(`/menu/${id}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(fields),
    }),

  deleteMenuItem: (token, id) =>
    request(`/menu/${id}`, {
      method: 'DELETE',
      token,
    }),

  // ── Reservations ──────────────────────────────────────────────────────────
  getMyReservations: (token) =>
    request('/reservations/my', { token }),

  createReservation: (token, reservation) =>
    request('/reservations', {
      method: 'POST',
      token,
      body: JSON.stringify(reservation),
    }),

  // Manager: get all reservations
  getAllReservations: (token) =>
    request('/reservations', { token }),

  // Manager: update a reservation status
  updateReservationStatus: (token, id, status) =>
    request(`/reservations/${id}/status`, {
      method: 'PATCH',
      token,
      body: JSON.stringify({ status }),
    }),

  // ── Orders ────────────────────────────────────────────────────────────────
  getMyOrders: (token) =>
    request('/orders/my', { token }),

  createOrder: (token, order) =>
    request('/orders', {
      method: 'POST',
      token,
      body: JSON.stringify(order),
    }),

  // Manager: get all orders
  getAllOrders: (token) =>
    request('/orders', { token }),

  // Manager: update an order status
  updateOrderStatus: (token, id, status) =>
    request(`/orders/${id}/status`, {
      method: 'PATCH',
      token,
      body: JSON.stringify({ status }),
    }),
};