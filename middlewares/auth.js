const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

module.exports = (req, _, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthError('необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    next(new AuthError('необходима авторизация'));
  }

  req.user = payload;

  next();
  return true;
};
