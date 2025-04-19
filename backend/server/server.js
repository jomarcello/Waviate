const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Import services
const supabaseService = require('../services/supabaseService');
const whatsappRoutes = require('../routes/whatsapp');
const twilioRoutes = require('../routes/twilio');

const app = express();

// Trust Railway's proxy
app.set('trust proxy', true);

// Middleware
app.use(morgan('dev')); // Request logging
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
  });
  next();
});

// Routes
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/twilio', twilioRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Waviate API is running',
    timestamp: new Date().toISOString(),
    headers: req.headers
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT
    },
    headers: req.headers
  });
});

// Supabase test endpoint
app.get('/api/supabase-test', async (req, res) => {
  try {
    // Get Supabase client
    const supabase = supabaseService.getClient();
    
    // Test connection to each table
    const results = {};
    
    // Test leads table
    try {
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select('count')
        .limit(1);
      
      results.leads = {
        success: !leadsError,
        error: leadsError ? leadsError.message : null,
        data: leads
      };
    } catch (e) {
      results.leads = { success: false, error: e.message };
    }
    
    // Test conversations table
    try {
      const { data: conversations, error: convsError } = await supabase
        .from('conversations')
        .select('count')
        .limit(1);
      
      results.conversations = {
        success: !convsError,
        error: convsError ? convsError.message : null,
        data: conversations
      };
    } catch (e) {
      results.conversations = { success: false, error: e.message };
    }
    
    // Test messages table
    try {
      const { data: messages, error: msgsError } = await supabase
        .from('messages')
        .select('count')
        .limit(1);
      
      results.messages = {
        success: !msgsError,
        error: msgsError ? msgsError.message : null,
        data: messages
      };
    } catch (e) {
      results.messages = { success: false, error: e.message };
    }
    
    // Return results
    res.status(200).json({
      timestamp: new Date().toISOString(),
      supabase_url: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.substring(0, 15) + '...' : 'not set',
      supabase_key: process.env.SUPABASE_KEY ? 'set (hidden)' : 'not set',
      test_results: results
    });
  } catch (error) {
    console.error('Error in supabase-test:', error);
    res.status(500).json({ error: 'Failed to test Supabase connection', details: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    path: req.path,
    method: req.method
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;

// Initialize services before starting the server
const initApp = async () => {
  try {
    // Initialize Supabase and check tables
    await supabaseService.setupTables();
    console.log('Database setup completed');
    
    // Start the server after initialization
    startServer();
  } catch (error) {
    console.error('Error during initialization:', error);
    // Start the server anyway to allow WhatsApp webhook verification
    startServer();
  }
};

// Function to start the server
const startServer = () => {
  // Listen on all network interfaces
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Base URL: ${process.env.BASE_URL || `http://localhost:${PORT}`}`);
    console.log(`WhatsApp webhook URL: ${process.env.BASE_URL || `http://localhost:${PORT}`}/api/whatsapp/webhook`);
    
    // Log all environment variables for debugging
    console.log('\nEnvironment variables:');
    Object.keys(process.env).forEach(key => {
      if (!key.includes('TOKEN') && !key.includes('SECRET') && !key.includes('KEY')) {
        console.log(`${key}: ${process.env[key]}`);
      }
    });
  });

  // Handle server shutdown gracefully
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
};

// Start the application
initApp(); 