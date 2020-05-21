import express from 'express';
import httpError from 'http-errors';
import {app as routes} from './routes/index.js';

const app = express();

app.use('/', routes);

// 404
app.use((request, response, next) => {
  return next(httpError.NotFound('The requested resource was not found')); // eslint-disable-line new-cap
});

// Handle errors
app.use((error, request, response, next) => { // eslint-disable-line no-unused-vars
  response.status(error.status);

  return response.type('txt').send(`${error.name}: ${error.message}`);
});

export default app;