/**
 * Twilio Service
 * Manages interactions with the Twilio API for SMS and WhatsApp
 */
class TwilioService {
  constructor() {
    // Check if Twilio credentials are available
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !phoneNumber) {
      console.warn('Twilio credentials not fully configured. SMS/WhatsApp functionality may not work.');
    } else {
      // Initialize Twilio client
      this.client = require('twilio')(accountSid, authToken);
      this.phoneNumber = phoneNumber;
      console.log('Twilio service initialized successfully');
    }
  }

  /**
   * Sends an SMS message using Twilio
   * @param {string} to - Recipient's phone number
   * @param {string} message - Message content
   * @returns {Promise<object>} Twilio response
   */
  async sendMessage(to, message, channel = 'sms') {
    try {
      if (!this.client) {
        throw new Error('Twilio client not initialized. Check your credentials.');
      }

      // Format phone number (ensure it starts with +)
      let formattedTo = to.startsWith('+') ? to : `+${to}`;
      let formattedFrom = this.phoneNumber;
      
      // Add WhatsApp prefix if needed
      if (channel === 'whatsapp') {
        formattedTo = `whatsapp:${formattedTo}`;
        formattedFrom = `whatsapp:${formattedFrom}`;
      }
      
      // Send message via Twilio
      const response = await this.client.messages.create({
        body: message,
        from: formattedFrom,
        to: formattedTo,
        statusCallback: `${process.env.BASE_URL}/api/twilio/status`
      });

      console.log(`${channel.toUpperCase()} sent successfully:`, response.sid);
      return {
        success: true,
        sid: response.sid,
        status: response.status,
        channel
      };
    } catch (error) {
      console.error(`Error sending ${channel} via Twilio:`, error);
      throw error;
    }
  }

  /**
   * Sends a WhatsApp message using Twilio
   * @param {string} to - Recipient's phone number
   * @param {string} message - Message content
   * @returns {Promise<object>} Twilio response
   */
  async sendWhatsAppMessage(to, message) {
    return this.sendMessage(to, message, 'whatsapp');
  }

  /**
   * Sends a templated WhatsApp message using Twilio
   * @param {string} to - Recipient's phone number
   * @param {string} templateName - Name of the WhatsApp template
   * @param {object} templateParams - Parameters for the template
   * @returns {Promise<object>} Twilio response
   */
  async sendWhatsAppTemplate(to, templateName, templateParams = {}) {
    try {
      if (!this.client) {
        throw new Error('Twilio client not initialized. Check your credentials.');
      }

      // Format phone number (ensure it starts with +)
      const formattedTo = to.startsWith('+') ? to : `+${to}`;
      
      // Create the content string based on the template
      // This is a simplified approach - template handling depends on your template structure
      let content = `Your template: ${templateName} with params: ${JSON.stringify(templateParams)}`;
      
      // Send using the WhatsApp channel
      return this.sendWhatsAppMessage(formattedTo, content);
    } catch (error) {
      console.error('Error sending WhatsApp template via Twilio:', error);
      throw error;
    }
  }
}

module.exports = new TwilioService(); 