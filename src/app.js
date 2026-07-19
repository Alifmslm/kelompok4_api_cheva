require('dotenv/config');
const express = require('express');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler.middleware');
const setupSwagger = require('./config/swagger');

const app = express();

// Parsing JSON body
app.use(express.json());

// Mount semua route
app.use('/api/v1', routes);

// Mount Swagger
setupSwagger(app);

// Global error handler
app.use(errorHandler);

module.exports = app;