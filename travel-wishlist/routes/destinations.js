import express from 'express';
import axios from 'axios';
import Destination from '../models/Destination.js';

const router = express.Router();

// OpenWeather API Key (replace with your actual key)
const weatherApiKey = 'YOUR_OPENWEATHER_API_KEY';

// Get all destinations (public)
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.render('destinations/index', { destinations });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get a single destination by ID
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).send('Not found');

    // Fetch weather data for the destination (city name)
    const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${destination.name}&appid=${weatherApiKey}&units=metric`);
    const weather = weatherResponse.data.weather[0].description;
    const temperature = weatherResponse.data.main.temp;

    res.render('destinations/show', {
      destination,
      weather,
      temperature,
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

export default router;
