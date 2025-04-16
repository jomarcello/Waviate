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
          recipient_type: 'individual',
          to: phoneNumber,
          type: 'text',
          text: { 
            preview_url: false,
            body: message 
          }
        },
        { headers: this.headers }
      );

      console.log('Message sent successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error.response?.data || error.message);
      throw error;
    }
  }

  async handleIncomingMessage(message) {
    try {
      const { from, type, timestamp } = message;
      
      console.log(`Received message from ${from} at ${new Date(timestamp * 1000).toISOString()}`);

      let messageContent = '';
      
      // Extract message content based on type
      if (type === 'text' && message.text) {
        messageContent = message.text.body;
      } else if (type === 'interactive' && message.interactive) {
        // Handle button responses or list responses
        const { type: interactiveType } = message.interactive;
        if (interactiveType === 'button_reply') {
          messageContent = message.interactive.button_reply.title;
        } else if (interactiveType === 'list_reply') {
          messageContent = message.interactive.list_reply.title;
        }
      }

      console.log('Message content:', messageContent);

      // Send acknowledgment message
      await this.sendMessage(from, 'Bedankt voor uw bericht! We nemen zo snel mogelijk contact met u op.');

      return {
        from,
        timestamp,
        type,
        content: messageContent
      };
    } catch (error) {
      console.error('Error handling incoming message:', error);
      throw error;
    }
  }

  // Helper method to send template messages
  async sendTemplate(phoneNumber, templateName, languageCode = 'nl', components = []) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: phoneNumber,
          type: 'template',
          template: {
            name: templateName,
            language: {
              code: languageCode
            },
            components
          }
        },
        { headers: this.headers }
      );

      console.log('Template message sent successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending template message:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new WhatsAppService(); 