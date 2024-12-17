const express = require('express');
const Package = require('../models/package');
const router = express.Router();

// Fetch all packages
router.get('/', async (req, res) => {
  const packages = await Package.find();
  res.json(packages);
});

// Add a new package (Admin)
router.post('/', async (req, res) => {
  const newPackage = new Package(req.body);
  await newPackage.save();
  res.json({ success: true });
});

module.exports = router;
