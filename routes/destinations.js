import express from 'express';
import Destination from '../models/Destination.js';

const router = express.Router();

// View all destinations
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.render('destinations/index', { destinations });
  } catch (err) {
    console.error('Error fetching destinations:', err);
    res.status(500).send('Server Error');
  }
});

// Show form to add a new destination
router.get('/new', (req, res) => {
  res.render('destinations/add'); // Make sure this file exists: views/destinations/add.hbs
});

// View single destination by ID
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).send('Destination not found');

    res.render('destinations/show', { destination });
  } catch (err) {
    console.error('Error loading destination:', err);
    res.status(500).send('Server Error');
  }
});

export default router;
