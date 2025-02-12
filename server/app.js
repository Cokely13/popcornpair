require('dotenv').config();
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const proxy = require('express-http-proxy'); // using express-http-proxy instead of createProxyMiddleware
const app = express();
module.exports = app;


// Logging middleware
app.use(morgan('dev'));

// Body parsing middleware
app.use(express.json());

const proxyTarget = process.env.API_PROXY_TARGET || 'http://127.0.0.1:5000';

// Use express-http-proxy to forward requests from /flask-predict-rating
// to the Flask endpoint at /api/predict-rating.
app.use('/flask-predict-rating', proxy(proxyTarget, {
  proxyReqPathResolver: function (req) {
    console.log('[PROXY] Forwarding request for:', req.url);
    // Always rewrite the incoming URL to /api/predict-rating.
    // To include any query string, you can append it like so:
    const url = require('url');
    const queryString = url.parse(req.url).search || '';
    return '/api/predict-rating' + queryString;
  },
  // Optional: If you need to adjust response headers, you can do so here.
  userResHeaderDecorator: function (headers, userReq, userRes, proxyReq, proxyRes) {
    return headers;
  },
  proxyErrorHandler: function (err, res, next) {
    console.error('[PROXY ERROR]', err);
    next(err);
  }
}));

// Auth and API routes (these handle other endpoints)
app.use('/auth', require('./auth'));
app.use('/api', require('./api'));

// Route for serving the index.html
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'public/index.html')));

// Static file-serving middleware
app.use(express.static(path.join(__dirname, '..', 'public')));

// Any remaining requests with an extension (.js, .css, etc.) send 404
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
  } else {
    next();
  }
});

// Sends index.html for any other request
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});
