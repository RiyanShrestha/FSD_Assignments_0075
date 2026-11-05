import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 3000 },
  category: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  time: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  totalTickets: { type: Number, required: true, min: 1, validate: Number.isInteger },
  availableTickets: { type: Number, required: true, min: 0, validate: Number.isInteger },
  image: { type: String, default: '' }
}, { timestamps: { createdAt: true, updatedAt: false } });

eventSchema.pre('validate', function () {
  if (this.availableTickets > this.totalTickets) this.invalidate('availableTickets', 'Available tickets cannot exceed total tickets.');
});
export default mongoose.model('Event', eventSchema);
