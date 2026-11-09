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

  getFilters: () => {
    return fetch(`${BASE}/cars/filters/`).then(r => r.json());
  },

  getCar: (id) => {
    return fetch(`${BASE}/cars/${id}/`).then(r => r.json());
  },

  createCar: (data, token) => {
    return fetch(`${BASE}/cars/`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify(data)
    }).then(r => r.json());
  },

  updateCar: (id, data, token) => {
    return fetch(`${BASE}/cars/${id}/`, {
      method: 'PUT',
      headers: headers(token),
      body: JSON.stringify(data)
    }).then(r => r.json());
  },

  deleteCar: (id, token) => {
    return fetch(`${BASE}/cars/${id}/`, {
      method: 'DELETE',
      headers: headers(token)
    }).then(() => ({ ok: true }));
  },

  createOrder: (data) => {
    return fetch(`${BASE}/orders/`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    }).then(r => r.json());
  },

  getOrders: (token) => {
    return fetch(`${BASE}/orders/`, { headers: headers(token) }).then(r => r.json());
  },

  updateOrder: (id, status, token) => {
    return fetch(`${BASE}/orders/${id}/`, {
      method: 'PATCH',
      headers: headers(token),
      body: JSON.stringify({ status })
    }).then(r => r.json());
  },

  login: (username, password) => {
    return fetch(`${BASE}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    }).then(r => r.json());
  },

  getSellers: () => {
    return fetch(`${BASE}/sellers/`).then(r => r.json());
  },

  getReviews: (carId) => {
    return fetch(`${BASE}/reviews/?car=${carId}`).then(r => r.json());
  },
  
  createTestDrive: (data) => {
    return fetch(`${BASE}/testdrive/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json());
  },

    getTestDrives: (token) => {
    return fetch(`${BASE}/testdrives/`, { headers: headers(token) }).then(r => r.json());
  },
};