// app.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import flash from 'connect-flash';
import passport from './config/passport.js';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import destinationRoutes from './routes/destinations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const startApp = async () => {
  await connectDB(); // 🔧 Wait for DB connection before continuing

  // View engine setup
  const viewsPath = path.join(__dirname, 'views');
  console.log("Views path:", viewsPath);
  app.set('views', viewsPath);
  app.set('view engine', 'hbs');

  // Middleware
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));

  // Sessions & Flash
  app.use(session({
    secret: 'yourSecretKeyHere',
    resave: false,
    saveUninitialized: false,
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  // Global flash vars
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
  app.use('/destinations', destinationRoutes);

  // Dashboard
  app.get('/dashboard', (req, res) => {
    if (req.isAuthenticated()) {
      res.render('dashboard', {
        user: req.user,
        title: 'Dashboard'
      });
    } else {
      req.flash('error_msg', 'You must be logged in to view the dashboard');
      res.redirect('/users/login');
    }
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
};

startApp(); // 🚀 Start the app after DB connection

export default app;
