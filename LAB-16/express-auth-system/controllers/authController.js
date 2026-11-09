const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const BCRYPT_ROUNDS = 12;

function signToken(user) {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters.');
  }

  return jwt.sign(
    { sub: user._id.toString() },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || cleanName.length > 100) {
      return res.status(400).json({ message: 'Name must be between 1 and 100 characters.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ message: 'A valid email address is required.' });
    }
    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({ message: 'Password must be between 8 and 128 characters.' });
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      role: 'student',
    });

    const token = signToken(user);
    return res.status(201).json({ message: 'Registration successful.', token, user });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'An account with that email already exists.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Registration details are invalid.' });
    }

    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Unable to register at this time.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(user);
    return res.status(200).json({ message: 'Login successful.', token, user });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Unable to log in at this time.' });
  }
};
