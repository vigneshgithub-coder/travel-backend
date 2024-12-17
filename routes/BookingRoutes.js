// routes/bookingRoutes.js
const express = require('express');
const Booking = require('./models/booking');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, travelers, specialRequests, packageId, totalPrice } = req.body;
    const newBooking = new Booking({
      name,
      email,
      phone,
      travelers,
      specialRequests,
      packageId,
      totalPrice,
    });
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
});

module.exports = router;
