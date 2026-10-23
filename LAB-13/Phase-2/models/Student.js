const mongoose = require('mongoose');
const crypto = require('crypto');

// ---------------------------------------------------------------------------
// Password hashing helpers (using Node.js built-in crypto / scrypt).
// No external bcrypt dependency required.
// ---------------------------------------------------------------------------
const SCRYPT_N = 16384; // CPU/memory cost factor
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LEN  = 64;

function hashPassword(plaintext) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(plaintext, salt, KEY_LEN, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P });
  // Store as "salt:hash" so both are available for verification
  return `${salt}:${hash.toString('hex')}`;
}

function verifyPassword(plaintext, stored) {
  try {
    const [salt, hashHex] = stored.split(':');
    if (!salt || !hashHex) return false;
    const hash = crypto.scryptSync(plaintext, salt, KEY_LEN, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P });
    return crypto.timingSafeEqual(hash, Buffer.from(hashHex, 'hex'));
  } catch (_) {
    return false;
  }
}

const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required']
    // Never returned in API responses; use .select('-passwordHash') where needed
  }
}, {
  timestamps: true
});

// Expose the helpers on the model so routes can use them without re-importing crypto
studentSchema.statics.hashPassword   = hashPassword;
studentSchema.statics.verifyPassword = verifyPassword;

module.exports = mongoose.model('Student', studentSchema);
