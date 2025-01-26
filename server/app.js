const express = require('express');
const path = require('path');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSantize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');


const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});



app.set('views', path.join(__dirname, 'views'));
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(helmet());

// Configure CORS
const corsOptions = {
  origin: 'http://localhost:7090', // Replace with your frontend domain
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
// Limit requests from same IP
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 10000, // Limit each IP to 100 requests per window
  standardHeaders: 'draft-7', // Combined RateLimit headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  message: {
    error: 'Too many requests',
    message: 'You have exceeded the request limit. Please try again later.',
  },
});
app.use('/api', limiter);

// Body parser, reading data from req.body
app.use(express.json({ limit: '10kb' }));

// Parse cookies
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSantize());

// Data sanitization against XSS attacks
app.use(xss());
console.log(process.env.NODE_ENV)

if(process.env.NODE_ENV==='development'){
app.use(morgan('dev'))
}

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'maxGroupSize',
      'difficulty',
      'ratingsAverage',
      'ratingsQuantity',
      'price',
    ], // Allow specific query parameters to have multiple values
  })
);

// Test middleware

// app.use((req, res, next) => {
//   console.log('Hello from the middleware');
//   next();
// });

// Add request time to req
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointment', appointmentRoutes);

// Handle unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
