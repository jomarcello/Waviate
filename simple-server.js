// Server code
const express = require('express');

console.log('=== Starting Waviate API server ===');
console.log('Node version:', process.version);
console.log('All environment variables:', Object.keys(process.env));
console.log('Environment variables:', {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  WHATSAPP_WEBHOOK_VERIFY_TOKEN: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN ? 'Set (value hidden)' : 'Not set'
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
});

const app = express();
// Hardcoded op 3000 om zeker te zijn dat we op dezelfde poort luisteren als in de Dockerfile EXPOSE
// Ongeacht wat de Railway omgevingsvariabelen doen
const PORT = 3000;

console.log('Configured server port:', PORT);

// Voor het verwerken van JSON body in POST requests
app.use(express.json());

// Logger middleware voor alle requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Het WhatsApp Webhook verificatie token uit omgevingsvariabele of fallback naar de hardcoded waarde
const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'waviate_webhook_verify_2024';
console.log('Using webhook verify token:', VERIFY_TOKEN.substring(0, 3) + '***' + VERIFY_TOKEN.substring(VERIFY_TOKEN.length - 3));

// Root endpoint
app.get('/', (req, res) => {
  console.log('Received request to root path');
  res.send('Waviate API is running');
});

// Health check endpoint - KRITISCH voor Railway
app.get('/health', (req, res) => {
  console.log('Received health check request');
  res.json({ status: 'ok' });
});

// Functie om webhook verificatie af te handelen
const handleWebhookVerification = (req, res) => {
  console.log('Webhook GET request received');
  console.log('Query parameters:', req.query);
  
  // WhatsApp stuurt deze parameters voor webhook verificatie
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log(`Mode: ${mode}, Token: ${token}, Challenge: ${challenge}`);
  console.log(`Expected token: ${VERIFY_TOKEN}`);

  // Check of de mode en token kloppen
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    // Webhook verificatie gelukt
    console.log('WEBHOOK_VERIFIED');
    res.status(200).send(challenge);
  } else {
    // Verificatie mislukt
    console.error('Verification failed. Token mismatch.');
    res.sendStatus(403);
  }
};

// Functie om webhook berichten af te handelen
const handleWebhookMessages = (req, res) => {
  console.log('Webhook POST request received');
  console.log('Headers:', req.headers);
  console.log('Body:', JSON.stringify(req.body, null, 2));
  
  // Bevestig ontvangst aan WhatsApp
  res.status(200).send('EVENT_RECEIVED');
};

// WhatsApp Webhook routes
app.get('/api/whatsapp/webhook', handleWebhookVerification);
app.post('/api/whatsapp/webhook', handleWebhookMessages);
app.get('/webhook', handleWebhookVerification);
app.post('/webhook', handleWebhookMessages);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error in request:', err);
  res.status(500).send('Internal Server Error');
});

// Start de server
try {
  app.listen(PORT, () => {
    console.log(`=== Server successfully started on port ${PORT} ===`);
    console.log(`=== Ready to receive requests ===`);
  });
} catch (error) {
  console.error('Failed to start server:', error);
} 