export function notFound(req, res, next) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}
export function errorHandler(err, req, res, next) {
  console.error(`[${req.method} ${req.originalUrl}]`, err.message);
  if (err.name === 'ValidationError') return res.status(400).json({ success: false, message: Object.values(err.errors).map(e => e.message).join(' ') });
  if (err.name === 'CastError') return res.status(400).json({ success: false, message: 'Invalid resource ID.' });
  if (err.code === 11000) return res.status(409).json({ success: false, message: 'A record with that value already exists.' });
  res.status(err.status || 500).json({ success: false, message: err.status ? err.message : 'An unexpected server error occurred.' });
}
