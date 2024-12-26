const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const packageRoutes = require('./routes/packages');
const BookingRoutes = require('./routes/BookingRoutes');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const router = express.Router();
const path = require('path');
require('dotenv').config();
const Booking = require('./models/Bookings'); 
const invoicesDir = path.join(__dirname, 'invoices');



const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  travelers: Number,
  specialRequests: String,
  packageId: mongoose.Schema.Types.ObjectId,
  totalPrice: Number,
});


 
const app = express();

app.use(cors({
  origin: 'https://effervescent-salamander-a23cca.netlify.app', 
  methods: ['GET', 'POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));
app.use(bodyParser.json());
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', BookingRoutes);
Headers: ['Content-Type'],
// }));
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

//app.get('/', (req, res) => res.send('API is working!'));
console.log("MONGO_URI: ", process.env.MONGO_URI);

app.get('/api/packages', async (req, res) => {
  try {
    const packages = await Package.find();  // Fetch all packages
    res.json(packages);  // Return the packages as a JSON response
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack
  res.status(500).send('Something went wrong!');
});

app.post('/api/generate-invoice', async (req, res) => {
  console.log(req.body);
  const { name, email, phone, travelers, packageName, price, bookingDate } = req.body;

  const newBooking = new Booking({
    name,
    email,
    phone,
    travelers,
    specialRequests: '', // Handle this in the form if needed
    packageId: null, // Add package ID if available
    totalPrice: price,
  });

  try {
    // Save the booking in the database
    await newBooking.save();

    // Create PDF document
    const doc = new PDFDocument();
    const invoicePath = path.join(invoicesDir, `${name}_invoices.pdf`);

    const writeStream = fs.createWriteStream(invoicePath);
    doc.pipe(writeStream);

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

    // When the file is written successfully, send it as a response
    writeStream.on('finish', () => {
      res.download(invoicePath, `${name}_invoice.pdf`, (err) => {
        if (err) {
          console.error("Error downloading the file", err);
          res.status(500).send("Error generating invoice");
        }
      });
    });

  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).send("Error generating invoice");
  }
});

  


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

