// Server code
const express = require('express');

console.log('=== Starting Waviate API server ===');
console.log('Node version:', process.version);
console.log('Environment variables:', {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  WHATSAPP_VERIFY_TOKEN: process.env.WHATSAPP_VERIFY_TOKEN ? 'Set (value hidden)' : 'Not set'
});

const app = express();
const PORT = process.env.PORT || 3000;

console.log('Configured server port:', PORT);

// Voor het verwerken van JSON body in POST requests
app.use(express.json());
console.log('Configured middleware: express.json()');

// Het WhatsApp Webhook verificatie token uit omgevingsvariabele of fallback naar de hardcoded waarde
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'waviate_webhook_verify_2024';
console.log('Using verify token:', VERIFY_TOKEN.substring(0, 3) + '***' + VERIFY_TOKEN.substring(VERIFY_TOKEN.length - 3));

app.get('/', (req, res) => {
  console.log('Received request to root path');
  res.send('Waviate API is running');
});

app.get('/health', (req, res) => {
  console.log('Received health check request');
  res.json({ status: 'ok' });
});

// WhatsApp Webhook - GET voor verificatie
app.get('/api/whatsapp/webhook', (req, res) => {
  console.log('Webhook GET request received');
  
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
});

// WhatsApp Webhook - POST voor berichten en updates
app.post('/api/whatsapp/webhook', (req, res) => {
  console.log('Webhook POST request received');
  console.log(JSON.stringify(req.body, null, 2));
  
  // Bevestig ontvangst aan WhatsApp
  res.status(200).send('EVENT_RECEIVED');
});

try {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=== Server successfully started ===`);
    console.log(`Server running on port ${PORT}`);
    console.log(`Using webhook verify token: ${VERIFY_TOKEN.substring(0, 3)}***`);
    console.log(`=== Ready to receive requests ===`);
  });
} catch (error) {
  console.error('Failed to start server:', error);
} 