const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  availableDates: [String],
  image: String,
});

module.exports = mongoose.model('Package', PackageSchema);
