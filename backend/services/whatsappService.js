const axios = require('axios');

class WhatsAppService {
  constructor() {
    this.baseUrl = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}`;
    this.headers = {
      'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    };
  }

  async sendMessage(phoneNumber, message) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/messages`,
        {
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'text',
          text: { body: message }
        },
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error.response?.data || error.message);
      throw error;
    }
  }

  async handleWebhook(payload) {
    // Process incoming webhook payload
    // This will be implemented based on WhatsApp's webhook format
    return payload;
  }
}

module.exports = new WhatsAppService(); 