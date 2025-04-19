const express = require('express');
const router = express.Router();
const conversationService = require('../services/conversationService');

// Webhook voor het ontvangen van SMS-berichten van Twilio
router.post('/webhook', async (req, res) => {
  try {
    console.log('Received Twilio webhook:', req.body);
    
    // Extract parameters from Twilio SMS webhook
    const { From, Body, MessageSid } = req.body;
    
    if (!From || !Body) {
      return res.status(400).send('Missing parameters: From or Body');
    }

    // Format phone number (remove + if present)
    const phoneNumber = From.replace(/^\+/, '');
    
    // Process the message via our conversation service
    const response = await conversationService.processIncomingMessage(
      {
        from: phoneNumber,
        id: MessageSid,
        timestamp: Math.floor(Date.now() / 1000),
        type: 'text',
        text: {
          body: Body
        }
      },
      phoneNumber
    );
    
    // Send a response in TwiML format
    res.set('Content-Type', 'text/xml');
    res.send(`
      <Response>
        <Message>${response.message}</Message>
      </Response>
    `);
  } catch (error) {
    console.error('Error in Twilio webhook:', error);
    res.status(500).send(`
      <Response>
        <Message>Sorry, we encountered an error processing your message.</Message>
      </Response>
    `);
  }
});

// Status update webhook
router.post('/status', (req, res) => {
  console.log('Received Twilio status update:', req.body);
  res.sendStatus(200);
});

module.exports = router; 