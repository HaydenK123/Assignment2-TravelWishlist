import express from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';  // Use named import
const router = express.Router();

// Login page (GET)
router.get('/login', (req, res) => {
  res.render('login', {
    error_msg: req.flash('error'), // Show flash messages from failed login
    success_msg: req.flash('success_msg')
  });
});


// Login handling (POST)
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',  // Redirect to dashboard after successful login
    failureRedirect: '/users/login',  // Stay on login page if failed
    failureFlash: true  // Show error messages
  })(req, res, next);
});

// Register page (GET)
router.get('/register', (req, res) => {
  res.render('register');
});

// Register handling (POST)
router.post('/register', async (req, res) => {
  const { username, password, password2 } = req.body;
  let errors = [];

  // Validation
  if (!username) {
    errors.push({ msg: 'Please fill in the username' });
  }

  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password && password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    return res.render('register', { errors, username });
  }

  try {
    const user = await User.findOne({ username });
    if (user) {
      errors.push({ msg: 'Username already exists' });
      return res.render('register', { errors, username });
    }

    // Create the new user with or without a password
    const newUser = new User({
      username,
      password: password || null  // If no password, set it to null
    });

    await newUser.save();

    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/users/login');
  } catch (err) {
    console.error('Registration Error:', err);
    req.flash('error_msg', 'Something went wrong during registration.');
    res.redirect('/users/register');
  }
});

// Logout (GET)
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      req.flash('error_msg', 'Logout failed');
      return res.redirect('/');
    }

    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });
});

export default router;

// GitHub Login Route
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub Callback Route
router.get('/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/users/login',
    failureFlash: true
  }),
  (req, res) => {
    req.flash('success_msg', 'Logged in with GitHub');
    res.redirect('/dashboard');
  }
);
