// getting-started.js

const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// EJS setup
app.set('view engine', 'ejs');

// MongoDB connection
mongoose.connect('mongodb+srv://admin:admin123@cluster0.pyxotom.mongodb.net/?appName=Cluster0')
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((err) => {
        console.log('MongoDB connection error:', err);
    });

// Route
app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});