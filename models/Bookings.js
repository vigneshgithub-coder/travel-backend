const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  travelers: Number,
  specialRequests: String,
  packageId: mongoose.Schema.Types.ObjectId,
  totalPrice: Number,
});

module.exports = mongoose.model('Booking', BookingSchema);
