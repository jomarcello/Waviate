const express = require('express');
const cors = require('cors');
require('dotenv').config();

const whatsappRoutes = require('../routes/whatsapp');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/whatsapp', whatsappRoutes);

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    details: err.message
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`WhatsApp webhook URL: ${process.env.BASE_URL || `http://localhost:${PORT}`}/api/whatsapp/webhook`);
}); 