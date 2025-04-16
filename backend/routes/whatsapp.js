const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsappController');

// Webhook verification endpoint
router.get('/webhook', (req, res) => {
  try {
    console.log('Received webhook verification request');
    console.log('Query parameters:', req.query);

    // WhatsApp sends these query parameters for verification
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('Verification attempt with:', {
      mode,
      token,
      challenge,
      expectedToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN
    });

    // Checks if a token and mode were sent
    if (!mode || !token) {
      console.log('Missing mode or token');
      return res.status(400).send('Missing parameters');
    }

    // Checks the mode and token sent are correct
    if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log('Webhook verified successfully');
      return res.status(200).send(challenge);
    }

    // Responds with '403 Forbidden' if verify tokens do not match
    console.log('Verification failed: token mismatch');
    return res.sendStatus(403);
  } catch (error) {
    console.error('Error in webhook verification:', error);
    return res.status(500).send('Server error');
  }
});

// Webhook for receiving messages
router.post('/webhook', (req, res) => {
  try {
    console.log('Received webhook POST');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);

    const body = req.body;

    // Check if this is a WhatsApp message webhook
    if (body.object === 'whatsapp_business_account') {
      return whatsappController.handleWebhook(req, res);
    }

    console.log('Invalid webhook body');
    return res.sendStatus(404);
  } catch (error) {
    console.error('Error in webhook handler:', error);
    return res.sendStatus(500);
  }
});

// Send message endpoint
router.post('/send', whatsappController.sendMessage);

module.exports = router; 