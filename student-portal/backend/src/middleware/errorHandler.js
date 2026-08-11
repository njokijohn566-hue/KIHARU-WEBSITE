const errorHandler = (err, req, res, next) => {
  // Log stack in server logs for debugging, but avoid returning stack or internals to clients in production
  if (err && err.stack) {
    console.error(err.stack);
  } else {
    console.error('Error:', err);
  }

  const status = err.status || err.statusCode || 500;
  const isDev = process.env.NODE_ENV === 'development';
  const clientMessage = isDev ? (err.message || 'Internal Server Error') : 'Internal Server Error';

  const payload = { success: false, message: clientMessage };
  if (isDev) {
    payload.error = { message: err.message, stack: err.stack };
  }

  res.status(status).json(payload);
};

module.exports = {
  errorHandler
};
