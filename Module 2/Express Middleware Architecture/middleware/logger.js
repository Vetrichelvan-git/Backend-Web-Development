/**
 * logger middleware  [mount GLOBALLY in app.js]
 *
 * Logs the request METHOD, PATH, and STATUS code on the response 'finish' event.
 * Includes the first 8 characters of req.id if set.
 *
 * Example line:  [a3f9c1e2] POST /posts 201
 */

module.exports = function logger(req, res, next) {
  res.on('finish', () => {
    const shortId = req.id ? `[${req.id.substring(0, 8)}] ` : '';
    console.log(`${shortId}${req.method} ${req.path} ${res.statusCode}`);
  });
  next();
};
