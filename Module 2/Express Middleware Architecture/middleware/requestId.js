/**
 * requestId middleware  [mount GLOBALLY in app.js]
 *
 * Generates a UUID with crypto.randomUUID(), attaches it to req.id,
 * sets the X-Request-Id response header, and calls next().
 */

const { randomUUID } = require('crypto');

module.exports = function requestId(req, res, next) {
  req.id = randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
};
