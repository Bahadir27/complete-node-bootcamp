const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();
// app.engine('pug', require('pug').__express);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const myLogger = function (req, res, next) {
  console.log('---------- - ----------');
  next();
};

// 1) GLBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// SET security HTTP headers
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again in an hour!', // message
});

// apply the limiter to requests that begin with /api/
app.use('/api/', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization agains NoSQL query injection
app.use(mongoSanitize());
// Data sanitization agains XSS
app.use(xss());

// Prevent parameter polution
app.use(
  hpp({
    whitelist: ['duration'],
  })
);

app.use(myLogger);

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Con't find ${req.originalUrl} on the server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
