const login = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Name is required' });
  }

  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Valid email is required' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  const user = {
    id: 'USR-' + Date.now(),
    name: name.trim(),
    email: email.trim().toLowerCase()
  };

  // Generate basic base64 encoded token containing user payload and timestamp
  const tokenPayload = {
    ...user,
    createdAt: Date.now()
  };
  const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user
  });
};

module.exports = { login };
