const mongoose = require("mongoose");

// ---- User Schema ----
// Defines the structure for a user (parent) document in MongoDB
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
  },
});

// Create and export the User model
const User = mongoose.model("User", userSchema);
module.exports = User;
