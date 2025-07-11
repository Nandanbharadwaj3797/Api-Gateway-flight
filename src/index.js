const express = require('express');
const rateLimit = require('express-rate-limit');

const { createProxyMiddleware } = require('http-proxy-middleware');

const {serverConfig, Logger }= require('./config');
const apiRoutes = require('./routes');
const app = express();


const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs
});


app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


app.use(limiter); // Apply rate limiting to all requests

app.use('/flightsService',createProxyMiddleware({
  target: serverConfig.FLIGHT_SERVICE,
  changeOrigin: true,
  pathRewrite:{'^/flightsService':'/'}
  })
);

app.use('/bookingService',createProxyMiddleware({
  target: serverConfig.BOOKING_SERVICE,
  changeOrigin: true,
  pathRewrite:{'^/bookingService':'/'}
  })
);

app.use('/api',apiRoutes);



app.listen(serverConfig.PORT, () => {
  console.log(`Server is running on port ${serverConfig.PORT}`);
});