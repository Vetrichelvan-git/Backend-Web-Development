/**
 * timing middleware  [mount GLOBALLY in app.js]
 *
 * Records a start timestamp when the request arrives and logs elapsed
 * milliseconds on the response 'finish' event.
 * Includes the first 8 characters of req.id if set.
 *
 * Example line:  [a3f9c1e2] POST /posts took 14ms
 */

module.exports = function timing(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    const shortId = req.id ? `[${req.id.substring(0, 8)}] ` : '';
    console.log(`${shortId}${req.method} ${req.path} took ${ms}ms`);
  });
  next();
};
