const express = require('express');
const Package = require('../models/package');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Fetch all packages
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add a new package (Admin)
router.post(
  '/',
  // Validation rules
  [
    body('name').notEmpty().withMessage('Package name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('description').notEmpty().withMessage('Description is required'),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newPackage = new Package(req.body);
      await newPackage.save();
      res.json({ success: true, message: 'Package added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

module.exports = router;
