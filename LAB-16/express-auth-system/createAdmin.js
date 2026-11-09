require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require('./config/db');
const User = require('./models/User');

const BCRYPT_ROUNDS = 12;

async function createAdmin() {
  try {
    await connectDB();

    const name = process.env.ADMIN_NAME || 'System Admin';
    const email = (process.env.ADMIN_EMAIL || 'admin@example.com').trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD || 'admin123';

    if (password.length < 8 || password.length > 128) {
      throw new Error('ADMIN_PASSWORD must be between 8 and 128 characters.');
    }

    const existingUser = await User.findOne({ email }).select('_id');
    if (existingUser) {
      throw new Error(`A user with email ${email} already exists; no changes were made.`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
    await User.create({ name, email, password: hashedPassword, role: 'admin' });

    console.log(`Admin account created successfully for ${email}.`);
  } catch (error) {
    console.error('Admin account creation failed:', error.message);
    process.exitCode = 1;
  } finally {
    try {
      await mongoose.disconnect();
    } catch (error) {
      console.error('Failed to disconnect from MongoDB:', error.message);
      process.exitCode = 1;
    }

    process.exit(process.exitCode || 0);
  }
}

createAdmin();
