export function notFound(req, res) {
  res.status(404).json({ message: 'The requested API route was not found.' });
}

export function errorHandler(err, req, res, next) {
  console.error(err.message);
  if (err.code === 11000) return res.status(409).json({ message: 'That email address is already registered.' });
  if (err.name === 'ValidationError' || err.name === 'CastError') return res.status(400).json({ message: 'Please check the submitted information.' });
  const status = res.statusCode >= 400 ? res.statusCode : 500;
  res.status(status).json({ message: status === 500 ? 'Something went wrong on the server. Please try again.' : err.message });
}
