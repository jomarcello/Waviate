const whatsappService = require('../services/whatsappService');

class WhatsAppController {
  async sendMessage(req, res) {
    try {
      const { phoneNumber, message } = req.body;
      
      if (!phoneNumber || !message) {
        return res.status(400).json({ error: 'Phone number and message are required' });
      }

      const result = await whatsappService.sendMessage(phoneNumber, message);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to send message' });
    }
  }

  async handleWebhook(req, res) {
    try {
      const payload = req.body;
      const result = await whatsappService.handleWebhook(payload);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to process webhook' });
    }
  }
}

module.exports = new WhatsAppController(); 