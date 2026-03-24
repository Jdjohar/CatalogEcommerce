const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { job } = require('./cron');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Start the cron job
job.start();
// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/subcategories', require('./routes/subcategories'));
app.use('/api/products', require('./routes/products'));
app.use('/api/sliders', require('./routes/sliders'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/settings', require('./routes/settings'));
app.get('/', (req, res) => {
  res.send('Catalog API is running');
});

// Default error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
