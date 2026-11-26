const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('./config/env');
const routes = require('./routes');
const { apiLimiter } = require('./middleware/rateLimit');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();

app.set('trust proxy', 1);
app.use(helmet());

app.use(
  cors({
    origin(origin, cb) {
      if (!origin || env.clientOrigins.includes(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key'],
  })
);

app.use(express.json({ limit: '10kb' }));

app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use('/api', apiLimiter, routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;