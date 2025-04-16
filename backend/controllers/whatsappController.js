const whatsappService = require('../services/whatsappService');

class WhatsAppController {
  async sendMessage(req, res) {
    try {
      const { phoneNumber, message } = req.body;
      
      if (!phoneNumber || !message) {
        return res.status(400).json({ 
          error: 'Phone number and message are required',
          required_format: {
            phoneNumber: "31612345678", // Example format
            message: "Your message here"
          }
        });
      }

      // Format phone number if needed (remove + and spaces)
      const formattedPhone = phoneNumber.replace(/[\s+]/g, '');
      
      const result = await whatsappService.sendMessage(formattedPhone, message);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error in sendMessage:', error);
      res.status(500).json({ 
        error: 'Failed to send message',
        details: error.response?.data || error.message 
      });
    }
  }

  async handleWebhook(req, res) {
    try {
      const { body } = req;
      
      // Log incoming webhook data
      console.log('Received webhook:', JSON.stringify(body, null, 2));

      // Check if this is a valid WhatsApp message webhook
      if (body.object === 'whatsapp_business_account') {
        const entries = body.entry || [];
        
        for (const entry of entries) {
          const changes = entry.changes || [];
          
          for (const change of changes) {
            if (change.field === 'messages') {
              const messages = change.value.messages || [];
              
              for (const message of messages) {
                // Process each message
                await whatsappService.handleIncomingMessage(message);
              }
            }
          }
        }
      }

      res.status(200).json({ status: 'ok' });
    } catch (error) {
      console.error('Error in handleWebhook:', error);
      res.status(500).json({ 
        error: 'Failed to process webhook',
        details: error.message 
      });
    }
  }
}

module.exports = new WhatsAppController(); 