// const express = require('express');
// const { createProxyMiddleware } = require('http-proxy-middleware');

// const PORT = 5555;
// const app = express();

// app.use('/flask-predict-rating', createProxyMiddleware({
//   target: 'http://127.0.0.1:5000',
//   changeOrigin: true,
//   logLevel: 'debug',
//   pathRewrite: {
//     '^/flask-predict-rating': '/api/predict-rating'
//   },
//   onProxyReq(proxyReq, req, res) {
//     console.log('[DEBUG] Forwarding from /flask-predict-rating to /api/predict-rating');
//   }
// }));

// app.listen(PORT, () => {
//   console.log(`Simple proxy server on port ${PORT}`);
// });

const express = require('express');
const proxy = require('express-http-proxy');

const PORT = 5555;
const app = express();

// Configure the proxy to forward requests from /flask-predict-rating
// to your Flask endpoint /api/predict-rating.
app.use('/flask-predict-rating', proxy('http://127.0.0.1:5000', {
  proxyReqPathResolver: function (req) {
    // Rewrite the URL: when a request comes to /flask-predict-rating,
    // forward it to /api/predict-rating on the Flask server.
    return '/api/predict-rating';
  },
  userResHeaderDecorator(headers, userReq, userRes, proxyReq, proxyRes) {
    // Optionally modify response headers if needed.
    return headers;
  },
  // Enable debug logging if needed
  proxyErrorHandler: function(err, res, next) {
    console.error('Proxy error:', err);
    next(err);
  }
}));

app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
