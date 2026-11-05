import Event from '../models/Event.js';
import Booking from '../models/Booking.js';

export async function listEvents(req, res) {
  const { search, category, location } = req.query;
  const filter = {};
  if (search) filter.title = { $regex: search, $options: 'i' };
  if (category && category !== 'All') filter.category = category;
  if (location) filter.location = { $regex: location, $options: 'i' };
  const events = await Event.find(filter).sort({ date: 1 });
  res.json({ success: true, count: events.length, data: events });
}
export async function getEvent(req, res) {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });
  res.json({ success: true, data: event });
}
export async function createEvent(req, res) {
  const event = await Event.create({ ...req.body, availableTickets: req.body.totalTickets });
  res.status(201).json({ success: true, message: 'Event created.', data: event });
}
export async function updateEvent(req, res) {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });
  const sold = event.totalTickets - event.availableTickets;
  Object.assign(event, req.body);
  if (req.body.totalTickets !== undefined) event.availableTickets = Math.max(0, Number(req.body.totalTickets) - sold);
  if (event.availableTickets < 0) return res.status(400).json({ success: false, message: 'Total tickets cannot be less than tickets already booked.' });
  await event.save();
  res.json({ success: true, message: 'Event updated.', data: event });
}
export async function deleteEvent(req, res) {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });
  const active = await Booking.exists({ eventId: event._id, bookingStatus: 'confirmed' });
  if (active) return res.status(409).json({ success: false, message: 'Cancel confirmed bookings before deleting this event.' });
  await event.deleteOne();
  res.json({ success: true, message: 'Event deleted.' });
}
