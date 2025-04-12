import express from 'express';
import Destination from '../models/Destination.js';
import methodOverride from 'method-override';

const router = express.Router();

// Enable method override for PUT/DELETE
router.use(methodOverride('_method'));

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

// Show form to add new destination
router.get('/new', (req, res) => {
  res.render('destinations/add');
});

// Handle form submission to add a new destination
router.post('/', async (req, res) => {
  try {
    const { name, location, description } = req.body;
    const newDestination = new Destination({ name, location, description });
    await newDestination.save();
    res.redirect('/destinations');
  } catch (err) {
    console.error('Error saving destination:', err);
    res.status(500).send('Server Error');
  }
});

// Show form to edit destination
router.get('/:id/edit', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).send('Destination not found');
    res.render('destinations/edit', { destination });
  } catch (err) {
    console.error('Error loading destination:', err);
    res.status(500).send('Server Error');
  }
});

// Update destination
router.put('/:id', async (req, res) => {
  try {
    const { name, location, description } = req.body;
    await Destination.findByIdAndUpdate(req.params.id, { name, location, description });
    res.redirect('/destinations');
  } catch (err) {
    console.error('Error updating destination:', err);
    res.status(500).send('Server Error');
  }
});

// Delete destination
router.delete('/:id', async (req, res) => {
  try {
    await Destination.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Destination deleted successfully.');
    res.redirect('/destinations');
  } catch (err) {
    console.error('Error deleting destination:', err);
    res.status(500).send('Server Error');
  }
});

// Show one destination
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
