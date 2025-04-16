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
// Gebruik de PORT omgevingsvariabele als deze bestaat, anders fallback naar 3000
// Dit maakt de app flexibeler met verschillende Railway configuraties
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

console.log('Configured server port:', PORT);
console.log('Configured server host:', HOST);

// Voor het verwerken van JSON body in POST requests
app.use(express.json());
console.log('Configured middleware: express.json()');

// Logger middleware voor alle requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Het WhatsApp Webhook verificatie token uit omgevingsvariabele of fallback naar de hardcoded waarde
const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'waviate_webhook_verify_2024';
console.log('Using verify token:', VERIFY_TOKEN.substring(0, 3) + '***' + VERIFY_TOKEN.substring(VERIFY_TOKEN.length - 3));

app.get('/', (req, res) => {
  console.log('Received request to root path');
  res.send('Waviate API is running');
});

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

// WhatsApp Webhook op nested route - GET voor verificatie
app.get('/api/whatsapp/webhook', handleWebhookVerification);

// WhatsApp Webhook op nested route - POST voor berichten en updates
app.post('/api/whatsapp/webhook', handleWebhookMessages);

// Alternatieve route op root niveau
app.get('/webhook', handleWebhookVerification);
app.post('/webhook', handleWebhookMessages);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error in request:', err);
  res.status(500).send('Internal Server Error');
});

try {
  // Railway vereist soms dat je gewoon op PORT luistert zonder HOST specificatie
  console.log('Attempting to listen on port', PORT);
  
  const server = app.listen(PORT, () => {
    console.log(`=== Server successfully started ===`);
    console.log(`Server running on port ${PORT}`);
    console.log(`Using webhook verify token: ${VERIFY_TOKEN.substring(0, 3)}***`);
    console.log(`=== Ready to receive requests ===`);
  });
  
  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
    });
  });
} catch (error) {
  console.error('Failed to start server:', error);
} 