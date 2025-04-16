// Server code
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Voor het verwerken van JSON body in POST requests
app.use(express.json());

// Het WhatsApp Webhook verificatie token
const VERIFY_TOKEN = 'waviate_webhook_verify_2024';

app.get('/', (req, res) => {
  res.send('Waviate API is running');
});

app.get('/health', (req, res) => {
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
}); 