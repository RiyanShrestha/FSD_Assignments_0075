const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getHeaders = () => {
  const token = localStorage.getItem('shopnest_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const loginUser = async (credentials) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
};

export const getProducts = async () => {
  const res = await fetch(`${API_URL}/api/products`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch products');
  }
  return data;
};

export const getProductById = async (id) => {
  const res = await fetch(`${API_URL}/api/products/${id}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Product not found');
  }
  return data;
};

export const createOrder = async (orderData) => {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(orderData)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to place order');
  }
  return data;
};

export const getOrders = async () => {
  const res = await fetch(`${API_URL}/api/orders`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch orders');
  }
  return data;
};
