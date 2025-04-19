/**
 * Twilio Service
 * Manages interactions with the Twilio API for SMS
 */
class TwilioService {
  constructor() {
    // Check if Twilio credentials are available
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !phoneNumber) {
      console.warn('Twilio credentials not fully configured. SMS functionality may not work.');
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
  async sendMessage(to, message) {
    try {
      if (!this.client) {
        throw new Error('Twilio client not initialized. Check your credentials.');
      }

      // Format phone number (ensure it starts with +)
      const formattedTo = to.startsWith('+') ? to : `+${to}`;
      
      // Send message via Twilio
      const response = await this.client.messages.create({
        body: message,
        from: this.phoneNumber,
        to: formattedTo,
        statusCallback: `${process.env.BASE_URL}/api/twilio/status`
      });

      console.log('SMS sent successfully:', response.sid);
      return {
        success: true,
        sid: response.sid,
        status: response.status
      };
    } catch (error) {
      console.error('Error sending SMS via Twilio:', error);
      throw error;
    }
  }
}

module.exports = new TwilioService(); 