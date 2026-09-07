const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// User Data
const USERS = [
  {
    id: 1,
    email: "george@example.com",
    first_name: "George",
    last_name: "Bluth",
    avatar: "https://reqres.in/img/faces/1-image.jpg",
  },
  {
    id: 2,
    email: "janet@example.com",
    first_name: "Janet",
    last_name: "Weaver",
    avatar: "https://reqres.in/img/faces/2-image.jpg",
  },
  {
    id: 3,
    email: "emma@example.com",
    first_name: "Emma",
    last_name: "Wong",
    avatar: "https://reqres.in/img/faces/3-image.jpg",
  },
  {
    id: 4,
    email: "eve@example.com",
    first_name: "Eve",
    last_name: "Holt",
    avatar: "https://reqres.in/img/faces/4-image.jpg",
  },
  {
    id: 5,
    email: "charles@example.com",
    first_name: "Charles",
    last_name: "Morris",
    avatar: "https://reqres.in/img/faces/5-image.jpg",
  },
  {
    id: 6,
    email: "tracey@example.com",
    first_name: "Tracey",
    last_name: "Ramos",
    avatar: "https://reqres.in/img/faces/6-image.jpg",
  },
];

// ---- ROUTES ----

// Home
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});

// All Users
app.get("/users", (req, res) => {
  res.json(USERS);
});

// Odd ID Users
app.get("/users/odd", (req, res) => {
  const oddUsers = USERS.filter((user) => user.id % 2 !== 0);
  res.json(oddUsers);
});

// Even ID Users
app.get("/users/even", (req, res) => {
  const evenUsers = USERS.filter((user) => user.id % 2 === 0);
  res.json(evenUsers);
});

// About Page
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "about.html"));
});

// Register Page
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "register.html"));
});

// Register POST
app.post("/api/register", (req, res) => {
  const { firstName, lastName } = req.body;
  res.send(`${firstName} ${lastName}`);
});

// Download Logo
app.get("/download-logo", (req, res) => {
  res.download(path.join(__dirname, "public", "logo192.png"), "logo.png");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
