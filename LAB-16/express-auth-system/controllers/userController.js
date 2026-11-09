exports.getProfile = (req, res) => {
  return res.status(200).json({ user: req.user });
};

exports.getAdminDashboard = (req, res) => {
  return res.status(200).json({
    message: `Welcome to the admin dashboard, ${req.user.name}.`,
  });
};
