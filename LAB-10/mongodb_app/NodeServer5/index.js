const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
require('dotenv').config()

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

mongoose.
    connect(process.env.MONGODB_URL).
    then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

const User = mongoose.model('User', {
    firstName: String,
    lastName: String,
    email: String,
    Phone: Number,
});

const Child = mongoose.model('Child', {
    firstName: String,
    lastName: String,
    email: String,
    Phone: Number,
});

app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} at http://localhost:${PORT}`);
});