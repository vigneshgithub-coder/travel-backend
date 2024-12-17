const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const packageRoutes = require('./routes/packages');
const BookingRoute = require('./routes/BookingRoute');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const router = express.Router();
const path = require('path');
require('dotenv').config();
const Booking = require('./models/Bookings'); 



const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  travelers: Number,
  specialRequests: String,
  packageId: mongoose.Schema.Types.ObjectId,
  totalPrice: Number,
});

//const Booking = mongoose.model('Booking', bookingSchema);

// Endpoint to handle booking

//::contentReference[oaicite:0]{index=0}

app.use(cors({
  origin: 'https://effervescent-salamander-a23cca.netlify.app/', // Your Netlify frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

 
const app = express();

//app.use(cors());
app.use(bodyParser.json());
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', BookingRoute);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// app.get('/', (req, res) => res.send('API is working!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.post('/api/generate-invoice', async (req, res) => {
  const { name, email, phone, travelers, packageName, price, bookingDate } = req.body;

  // Create a new booking in the database
  const newBooking = new Booking({
    name,
    email,
    phone,
    travelers,
    specialRequests: '', // You can handle this in the form if needed
    packageId: null, // Add the package ID if available
    totalPrice: price,
  });

  try {
    // Save the booking in the database
    await newBooking.save();

    // Create PDF document
    const doc = new PDFDocument();
    
    // Set file path for the PDF invoice
    const invoicePath = path.join(__dirname, 'invoices', `${name}_invoices.pdf`);
    
    doc.pipe(fs.createWriteStream(invoicePath));

    // Add invoice content
    doc.fontSize(20).text('Invoice', { align: 'center' });
    doc.fontSize(12).moveDown();
    
    doc.text(`Booking Details:`);
    doc.text(`Name: ${name}`);
    doc.text(`Email: ${email}`);
    doc.text(`Phone: ${phone}`);
    doc.text(`Travelers: ${travelers}`);
    doc.text(`Package: ${packageName}`);
    doc.text(`Price: $${price}`);
    doc.text(`Booking Date: ${bookingDate}`);
    
    // Finalize PDF
    doc.end();
    
    // Send the file as a response
    res.download(invoicePath, (err) => {
      if (err) {
        console.error("Error downloading the file", err);
        res.status(500).send("Error generating invoice");
      }
    });

  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).send("Error generating invoice");
  }
});

