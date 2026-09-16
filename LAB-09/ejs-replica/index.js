const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

// ---------- Middleware ----------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ---------- View Engine ----------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ---------- Sample Profile Data (no database) ----------
const profiles = {
  riyan: {
    username: "riyan",
    name: "Riyan Shrestha",
    title: "BCA Student | Full-Stack Developer",
    email: "riyan.shrestha@example.com",
    bio: "Passionate BCA student with a strong interest in full-stack web development. Skilled in HTML, CSS, JavaScript, React, and Node.js. Always eager to learn and build innovative projects.",
    image: "https://media.licdn.com/dms/image/v2/D4E03AQEe89CfFqQAQA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1719543851498?e=1791417600&v=beta&t=vdvQtOKGhQ1Raz0Skg42mXEUGkDEiTi_hTyUNaVeUSo",
    cover: "#0a66c2",
  },
  ram: {
    username: "ram",
    name: "Ram Prasad",
    title: "Software Engineer at TechCorp",
    email: "ram.prasad@example.com",
    bio: "Experienced software engineer specializing in backend systems and cloud infrastructure. Proficient in Java, Python, and AWS. Enjoys mentoring junior developers and contributing to open source.",
    image: "https://images.unsplash.com/photo-1695927621677-ec96e048dce2?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cover: "#057642",
  },
  sita: {
    username: "sita",
    name: "Sita Sharma",
    title: "UI/UX Designer | Creative Thinker",
    email: "sita.sharma@example.com",
    bio: "Creative UI/UX designer with 3+ years of experience crafting intuitive digital experiences. Loves turning complex problems into simple, beautiful designs using Figma and Adobe XD.",
    image: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cover: "#7c3aed",
  },
};

// ---------- Routes ----------

// Home page — shows cards for every profile
app.get("/", (req, res) => {
  res.render("home", {
    title: "LinkedIn Replica | Home",
    profiles: profiles,
  });
});

// Dynamic profile route
app.get("/profile/:username", (req, res) => {
  const username = req.params.username.toLowerCase();
  const profile = profiles[username];

  if (!profile) {
    return res.status(404).send("<h1>404 — Profile Not Found</h1>");
  }

  res.render("profile", {
    title: `${profile.name} | LinkedIn Profile`,
    profile: profile,
  });
});

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
