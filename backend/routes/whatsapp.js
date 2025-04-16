const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsappController');

// Webhook verification endpoint
router.get('/webhook', (req, res) => {
  try {
    console.log('Received webhook verification request');
    console.log('Query parameters:', req.query);

    // Check if all required parameters are present
    if (!req.query['hub.mode'] || !req.query['hub.verify_token'] || !req.query['hub.challenge']) {
      console.log('Missing required parameters');
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Log verification attempt
    console.log('Verification attempt:');
    console.log('Mode:', mode);
    console.log('Token:', token);
    console.log('Expected token:', process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN);

    // Verify token
    if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
      console.log('Webhook verified successfully');
      return res.status(200).send(challenge);
    }

    // If token doesn't match
    console.log('Webhook verification failed: token mismatch');
    return res.status(403).json({ error: 'Token mismatch' });
  } catch (error) {
    console.error('Error in webhook verification:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Webhook for receiving messages
router.post('/webhook', whatsappController.handleWebhook);

// Send message endpoint
router.post('/send', whatsappController.sendMessage);

module.exports = router; 