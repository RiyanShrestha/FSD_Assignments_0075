import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingReference: { type: String, required: true, unique: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  customerName: { type: String, required: true, trim: true },
  customerEmail: { type: String, required: true, trim: true, lowercase: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  ticketQuantity: { type: Number, required: true, min: 1, validate: Number.isInteger },
  totalAmount: { type: Number, required: true, min: 0 },
  bookingStatus: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
  bookingDate: { type: Date, default: Date.now }
}, { timestamps: false });
bookingSchema.index({ bookingReference: 1 }, { unique: true });
export default mongoose.model('Booking', bookingSchema);
