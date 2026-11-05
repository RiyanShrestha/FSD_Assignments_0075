import { randomBytes } from 'node:crypto';
import Booking from '../models/Booking.js';
import Event from '../models/Event.js';

export async function listBookings(req, res) {
  const filter = req.query.email ? { customerEmail: req.query.email.toLowerCase() } : {};
  const bookings = await Booking.find(filter).populate('eventId').sort({ bookingDate: -1 });
  res.json({ success: true, count: bookings.length, data: bookings });
}
export async function getBooking(req, res) {
  const booking = await Booking.findById(req.params.id).populate('eventId');
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
  res.json({ success: true, data: booking });
}
export async function createBooking(req, res) {
  const quantity = Number(req.body.ticketQuantity);
  const event = await Event.findOneAndUpdate({ _id: req.body.eventId, availableTickets: { $gte: quantity } }, { $inc: { availableTickets: -quantity } }, { new: true });
  if (!event) {
    const exists = await Event.exists({ _id: req.body.eventId });
    return res.status(exists ? 400 : 404).json({ success: false, message: exists ? 'Not enough tickets are available.' : 'Event not found.' });
  }
  try {
    const booking = await Booking.create({ ...req.body, ticketQuantity: quantity, totalAmount: event.price * quantity, bookingReference: `EVT-${randomBytes(4).toString('hex').toUpperCase()}` });
    res.status(201).json({ success: true, message: 'Booking confirmed.', data: await booking.populate('eventId') });
  } catch (error) {
    await Event.updateOne({ _id: event._id }, { $inc: { availableTickets: quantity } });
    throw error;
  }
}
export async function updateBooking(req, res) {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
  if (booking.bookingStatus === 'cancelled') return res.status(400).json({ success: false, message: 'Cancelled bookings cannot be changed.' });
  if (req.body.customerName) booking.customerName = req.body.customerName.trim();
  if (req.body.customerEmail) booking.customerEmail = req.body.customerEmail.toLowerCase();
  await booking.save();
  res.json({ success: true, message: 'Booking updated.', data: booking });
}
export async function cancelBooking(req, res) {
  const booking = await Booking.findOneAndUpdate({ _id: req.params.id, bookingStatus: 'confirmed' }, { $set: { bookingStatus: 'cancelled' } }, { new: true });
  if (!booking) {
    const exists = await Booking.exists({ _id: req.params.id });
    return res.status(exists ? 400 : 404).json({ success: false, message: exists ? 'Booking is already cancelled.' : 'Booking not found.' });
  }
  // Only the request that changes confirmed -> cancelled restores inventory.
  await Event.updateOne({ _id: booking.eventId }, { $inc: { availableTickets: booking.ticketQuantity } });
  res.json({ success: true, message: 'Booking cancelled and tickets returned.', data: booking });
}
