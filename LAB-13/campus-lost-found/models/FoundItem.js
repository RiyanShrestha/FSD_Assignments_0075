const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  foundLocation: {
    type: String,
    required: [true, 'Found location is required'],
    trim: true
  },
  dateFound: {
    type: Date,
    required: [true, 'Date found is required']
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Reporter (student) is required']
  },
  status: {
    type: String,
    default: 'Unclaimed',
    enum: ['Unclaimed', 'Claimed', 'Returned']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FoundItem', foundItemSchema);
