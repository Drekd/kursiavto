const BASE = '/api';
const headers = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const api = {
  getCars: (params = {}) => {
    const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
    return fetch(`${BASE}/cars/?${q}`).then(r => r.json());
  },
  getFilters: () => fetch(`${BASE}/cars/filters/`).then(r => r.json()),
  getCar: (id) => fetch(`${BASE}/cars/${id}/`).then(r => r.json()),
  createCar: (data, token) => fetch(`${BASE}/cars/`, { method: 'POST', headers: headers(token), body: JSON.stringify(data) }).then(r => r.json()),
  updateCar: (id, data, token) => fetch(`${BASE}/cars/${id}/`, { method: 'PUT', headers: headers(token), body: JSON.stringify(data) }).then(r => r.json()),
  deleteCar: (id, token) => fetch(`${BASE}/cars/${id}/`, { method: 'DELETE', headers: headers(token) }).then(() => ({ ok: true })),
  createOrder: (data) => fetch(`${BASE}/orders/`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),
  getOrders: (token) => fetch(`${BASE}/orders/`, { headers: headers(token) }).then(r => r.json()),
  updateOrder: (id, status, token) => fetch(`${BASE}/orders/${id}/`, { method: 'PATCH', headers: headers(token), body: JSON.stringify({ status }) }).then(r => r.json()),
  login: (username, password) => fetch(`${BASE}/auth/login/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) }).then(r => r.json()),
};