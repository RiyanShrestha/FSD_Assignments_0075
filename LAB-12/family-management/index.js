// ============================================================
// Mini User & Family Management System
// Technologies: Node.js, Express, EJS, MongoDB, Mongoose, dotenv
// ============================================================

// --- 1) Load environment variables from .env ---
require("dotenv").config();

// --- 2) Import required packages ---
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

// --- 3) Import Mongoose models ---
const User = require("./models/User");
const Child = require("./models/Child");

// --- 4) Create Express app ---
const app = express();

// --- 5) Set EJS as the view engine ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// --- 6) Middleware ---
// body-parser to read form data from req.body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (CSS) from the public folder
app.use(express.static(path.join(__dirname, "public")));

// --- 7) Helper: Check if a string is a valid MongoDB ObjectId ---
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// ============================================================
// ROUTES
// ============================================================

// ------ HOME: Redirect to /users ------
app.get("/", function (req, res) {
  res.redirect("/users");
});

// ============================================================
// BONUS: GET /users - Display all users
// ============================================================
app.get("/users", async function (req, res) {
  try {
    // Fetch all users from MongoDB
    const users = await User.find();
    res.render("users", { users: users });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Server error while fetching users" });
  }
});

// ============================================================
// BONUS: GET /users/search/:name - Search users by first name
// ============================================================
app.get("/users/search/:name", async function (req, res) {
  try {
    const searchName = req.params.name;
    // Case-insensitive search using regex
    const users = await User.find({
      firstName: { $regex: searchName, $options: "i" },
    });

    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found with name: " + searchName });
    }

    res.status(200).json({ count: users.length, users: users });
  } catch (error) {
    console.error("Error searching users:", error.message);
    res.status(500).json({ error: "Server error while searching users" });
  }
});

// ============================================================
// 1) POST /users - Create a new user
// ============================================================
app.post("/users", async function (req, res) {
  try {
    // Read data from req.body
    const { firstName, lastName, email, phone } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({
        error: "All fields are required: firstName, lastName, email, phone",
      });
    }

    // Create the user in MongoDB
    const newUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ error: "Server error while creating user" });
  }
});

// ============================================================
// 2) GET /users/:id - View user profile with children
// ============================================================
app.get("/users/:id", async function (req, res) {
  try {
    const userId = req.params.id;

    // Check if the ID format is valid
    if (!isValidObjectId(userId)) {
      return res.status(400).sendFile(path.join(__dirname, "views", "404.html"));
    }

    // Find the user by MongoDB ID
    const user = await User.findById(userId);

    // If user does not exist, show custom 404 page
    if (!user) {
      return res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
    }

    // Dynamically load all children belonging to this user
    const children = await Child.find({ parentId: userId });

    // Render profile.ejs with user and children data
    res.render("profile", { user: user, children: children });
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({ error: "Server error while fetching user profile" });
  }
});

// ============================================================
// ROUTE: GET /users/:id/children/add - Show add-child form
// (This serves the add-child.ejs page)
// ============================================================
app.get("/users/:id/children/add", async function (req, res) {
  try {
    const userId = req.params.id;

    if (!isValidObjectId(userId)) {
      return res.status(400).sendFile(path.join(__dirname, "views", "404.html"));
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
    }

    res.render("add-child", { user: user });
  } catch (error) {
    console.error("Error loading add-child page:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ============================================================
// BONUS: GET /users/:id/children/count - Count children
// ============================================================
app.get("/users/:id/children/count", async function (req, res) {
  try {
    const userId = req.params.id;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Count children that belong to this user
    const count = await Child.countDocuments({ parentId: userId });

    res.status(200).json({
      user: user.firstName + " " + user.lastName,
      childrenCount: count,
    });
  } catch (error) {
    console.error("Error counting children:", error.message);
    res.status(500).json({ error: "Server error while counting children" });
  }
});

// ============================================================
// 3) POST /users/:id/children - Add a child to a user
// ============================================================
app.post("/users/:id/children", async function (req, res) {
  try {
    const userId = req.params.id;

    // Validate parent ID format
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Verify that the parent user exists
    const parentUser = await User.findById(userId);
    if (!parentUser) {
      return res.status(404).json({ error: "Parent user not found" });
    }

    // Read child data from req.body
    const { firstName, lastName, age, email } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !age || !email) {
      return res.status(400).json({
        error: "All fields are required: firstName, lastName, age, email",
      });
    }

    // Create the child with parentId set to the parent's _id
    const newChild = await Child.create({
      firstName: firstName,
      lastName: lastName,
      age: age,
      email: email,
      parentId: parentUser._id,
    });

    res.status(201).json({
      message: "Child added successfully",
      child: newChild,
    });
  } catch (error) {
    console.error("Error adding child:", error.message);
    res.status(500).json({ error: "Server error while adding child" });
  }
});

// ============================================================
// 4) GET /users/:id/children - List all children of a user
// ============================================================
app.get("/users/:id/children", async function (req, res) {
  try {
    const userId = req.params.id;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Verify the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find only children whose parentId matches this user
    const children = await Child.find({ parentId: userId });

    if (children.length === 0) {
      return res.status(200).json({
        message: "No children found for this user.",
        children: [],
      });
    }

    res.status(200).json({ children: children });
  } catch (error) {
    console.error("Error fetching children:", error.message);
    res.status(500).json({ error: "Server error while fetching children" });
  }
});

// ============================================================
// 5) GET /users/:id/children/:childId - Get specific child
//    IMPORTANT: Checks that the child belongs to THIS user
// ============================================================
app.get("/users/:id/children/:childId", async function (req, res) {
  try {
    const userId = req.params.id;
    const childId = req.params.childId;

    // Validate both IDs
    if (!isValidObjectId(userId) || !isValidObjectId(childId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Verify the parent user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
    }

    // Find the child ONLY if child._id matches AND child.parentId matches userId
    // This ensures a child belonging to another user is NOT displayed
    const child = await Child.findOne({
      _id: childId,
      parentId: userId,
    });

    if (!child) {
      return res.status(404).json({
        error: "Child Not Found. This child does not belong to this user.",
      });
    }

    // Render child.ejs with the child data
    res.render("child", { child: child });
  } catch (error) {
    console.error("Error fetching child:", error.message);
    res.status(500).json({ error: "Server error while fetching child" });
  }
});

// ============================================================
// 6) PATCH /children/:id - Update a child
// ============================================================
app.patch("/children/:id", async function (req, res) {
  try {
    const childId = req.params.id;

    if (!isValidObjectId(childId)) {
      return res.status(400).json({ error: "Invalid child ID format" });
    }

    // Update fields: firstName, lastName, age, email
    const updatedChild = await Child.findByIdAndUpdate(
      childId,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        email: req.body.email,
      },
      { new: true, runValidators: true } // return updated doc, run schema validations
    );

    if (!updatedChild) {
      return res.status(404).json({ error: "Child Not Found" });
    }

    res.status(200).json({
      message: "Child updated successfully",
      child: updatedChild,
    });
  } catch (error) {
    console.error("Error updating child:", error.message);
    res.status(500).json({ error: "Server error while updating child" });
  }
});

// ============================================================
// 7) DELETE /children/:id - Delete a child
// ============================================================
app.delete("/children/:id", async function (req, res) {
  try {
    const childId = req.params.id;

    if (!isValidObjectId(childId)) {
      return res.status(400).json({ error: "Invalid child ID format" });
    }

    const deletedChild = await Child.findByIdAndDelete(childId);

    if (!deletedChild) {
      return res.status(404).json({ error: "Child Not Found" });
    }

    res.status(200).json({ message: "Child deleted successfully" });
  } catch (error) {
    console.error("Error deleting child:", error.message);
    res.status(500).json({ error: "Server error while deleting child" });
  }
});

// ============================================================
// CONNECT TO MONGODB AND START SERVER
// ============================================================
const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;

// Check that the MongoDB connection string is set
if (!MONGODB_URL || MONGODB_URL === "YOUR_MONGODB_CONNECTION_STRING") {
  console.error("ERROR: Please set your MONGODB_URL in the .env file");
  console.error("Example: MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/familyDB");
  process.exit(1);
}

// Connect to MongoDB Atlas using Mongoose
mongoose
  .connect(MONGODB_URL)
  .then(function () {
    console.log("Connected to MongoDB successfully! Database: " + mongoose.connection.name);

    // Start the Express server only after DB is connected
    app.listen(PORT, function () {
      console.log("Server is running on http://localhost:" + PORT);
    });
  })
  .catch(function (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  });
