const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE}${path}`, { ...options, headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers } });
  } catch {
    throw new Error(`Can't reach the Eventify API at ${BASE}. Start the backend and check your connection.`);
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || `Request failed (${response.status}).`);
  return body;
}
const json = (method, data) => ({ method, body: JSON.stringify(data) });
export const api = {
  events: (filters = {}) => { const q = new URLSearchParams(Object.entries(filters).filter(([,v]) => v)); return request(`/events${q.size ? `?${q}` : ''}`); },
  event: id => request(`/events/${id}`),
  createEvent: data => request('/events', json('POST', data)),
  updateEvent: (id, data) => request(`/events/${id}`, json('PUT', data)),
  deleteEvent: id => request(`/events/${id}`, { method: 'DELETE' }),
  bookings: email => request(`/bookings${email ? `?email=${encodeURIComponent(email)}` : ''}`),
  createBooking: data => request('/bookings', json('POST', data)),
  cancelBooking: id => request(`/bookings/${id}`, { method: 'DELETE' })
};
