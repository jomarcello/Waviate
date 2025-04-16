const express = require('express');
const app = express();

// Trust Railway's proxy
app.set('trust proxy', true);

// Basic middleware
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Waviate Standalone API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000
  });
});

// WhatsApp webhook verification endpoint
app.get('/api/whatsapp/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('WhatsApp webhook verification:', { mode, token, challenge });

  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    console.log('Webhook verified successfully');
    return res.status(200).send(challenge);
  }
  
  console.log('Webhook verification failed');
  return res.sendStatus(403);
});

// WhatsApp webhook for receiving messages
app.post('/api/whatsapp/webhook', (req, res) => {
  console.log('Received webhook POST');
  console.log('Body:', req.body);
  
  // Just acknowledge receipt
  return res.status(200).json({ 
    status: 'received',
    timestamp: new Date().toISOString()
  });
});

// Show environment variables
app.get('/environment', (req, res) => {
  const safeEnv = {};
  Object.keys(process.env).forEach(key => {
    if (!key.includes('TOKEN') && !key.includes('SECRET') && !key.includes('KEY')) {
      safeEnv[key] = process.env[key];
    } else {
      safeEnv[key] = '[REDACTED]';
    }
  });
  
  res.status(200).json({
    environment: safeEnv
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Server Error',
    message: err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Standalone server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Print environment variables
  console.log('\nEnvironment variables:');
  Object.keys(process.env).forEach(key => {
    if (!key.includes('TOKEN') && !key.includes('SECRET') && !key.includes('KEY')) {
      console.log(`${key}: ${process.env[key]}`);
    }
  });
}); 