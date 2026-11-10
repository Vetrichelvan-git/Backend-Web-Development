/**
 * Express Middleware Architecture — Build the Pipeline
 *
 * This Express app has THREE custom middleware functions mounted globally
 * in the correct order, before the routers:
 *
 *   1) requestId — attaches a UUID to req (and the X-Request-Id header)   [GLOBAL]
 *   2) logger    — logs method, path, and status                          [GLOBAL]
 *   3) timing    — logs how many milliseconds the request took            [GLOBAL]
 *
 * auditWrite is mounted PER-ROUTE on POST /posts only (see routes/posts.js).
 *
 * Run it with:  npm start
 * Then hit the API, e.g.:
 *   curl http://localhost:3000/posts
 *   curl -X POST http://localhost:3000/posts -H "Content-Type: application/json" -d '{"title":"Hi"}'
 *   curl http://localhost:3000/users
 */

const express = require('express');

// The two routers are already written and mounted for you.
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');

// Custom middleware — implemented and mounted in correct pipeline order.
const requestId = require('./middleware/requestId');
const logger = require('./middleware/logger');
const timing = require('./middleware/timing');

const app = express();

// 1. requestId must run first so logger and timing can read req.id.
app.use(requestId);

// 2. logger reads req.id (set above) and logs on response finish.
app.use(logger);

// 3. timing reads req.id (set above) and logs elapsed ms on response finish.
app.use(timing);

// Built-in body parser so POST /posts can read req.body.
app.use(express.json());

// Two mounted routers (do not remove these).
app.use('/posts', postsRouter);
app.use('/users', usersRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

module.exports = app;
