import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import flash from 'connect-flash';
import path from 'path';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import destinationRoutes from './routes/destinations.js';

const app = express();

// Load environment variables from .env file
dotenv.config();

// Database connection
const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/travel-wishlist';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Passport configuration
import './config/passport.js';  // Import the passport configuration

// Set view engine
app.set('view engine', 'hbs');
app.set('views', path.join(path.dirname(''), 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(path.dirname(''), 'public'))); // Serve static files
app.use(session({
  secret: 'yourSecretKeyHere',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global variables for flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/destinations', destinationRoutes);  // Destination Routes

// Dashboard route (after successful login)
app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('dashboard', {
      user: req.user,  // This is set by Passport
      title: 'Dashboard'
    });
  } else {
    req.flash('error_msg', 'You must be logged in to view the dashboard');
    res.redirect('/users/login');
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

export default app;
