import express from 'express';
import { Router } from 'express';
const router = Router();

// Home route (authenticated users only)
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/dashboard');  // Redirect to dashboard if logged in
  } else {
    res.render('index', {
      title: 'Home',
      user: req.user
    });
  }
});

export default router;
