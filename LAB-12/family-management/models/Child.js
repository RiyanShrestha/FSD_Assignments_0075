const mongoose = require("mongoose");

// ---- Child Schema ----
// Defines the structure for a child document in MongoDB
// Each child belongs to exactly ONE parent user via parentId
const childSchema = new mongoose.Schema({
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
  age: {
    type: Number,
    required: [true, "Age is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
  },
  // parentId links this child to a specific User (parent)
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // references the User model
    required: [true, "Parent ID is required"],
  },
});

// Create and export the Child model
const Child = mongoose.model("Child", childSchema);
module.exports = Child;
