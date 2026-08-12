require('dotenv/config');
const express = require('express');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler.middleware');
const setupSwagger = require('./config/swagger');
const globalLimiter = require('./middlewares/rateLimiter/index.limiter');

const app = express();

// Parsing JSON body
app.use(express.json());

app.use(globalLimiter);

// Mount semua route
app.use('/', routes);

// Mount Swagger
setupSwagger(app);

// Global error handler
app.use(errorHandler);

module.exports = app;
