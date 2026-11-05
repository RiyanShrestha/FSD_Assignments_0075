export function validateEvent(req, res, next) {
  const { title, description, category, location, date, time, price, totalTickets } = req.body;
  const errors = [];
  for (const [key, value] of Object.entries({ title, description, category, location, date, time })) if (!String(value ?? '').trim()) errors.push(`${key} is required.`);
  if (date && Number.isNaN(Date.parse(date))) errors.push('date must be valid.');
  else if (date && new Date(date) <= new Date()) errors.push('date must be in the future.');
  if (price === undefined || !Number.isFinite(Number(price)) || Number(price) < 0) errors.push('price must be zero or greater.');
  if (totalTickets === undefined || !Number.isInteger(Number(totalTickets)) || Number(totalTickets) < 1) errors.push('totalTickets must be a positive integer.');
  if (errors.length) return res.status(400).json({ success: false, message: errors.join(' ') });
  next();
}
export function validateBooking(req, res, next) {
  const { eventId, customerName, customerEmail, ticketQuantity } = req.body;
  if (!eventId || !String(customerName || '').trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail || '') || !Number.isInteger(Number(ticketQuantity)) || Number(ticketQuantity) < 1)
    return res.status(400).json({ success: false, message: 'Provide an event, customer name, valid email, and positive whole-number ticket quantity.' });
  next();
}
