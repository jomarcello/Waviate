const axios = require('axios');
require('dotenv').config();

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

async function testWhatsAppAPI() {
  try {
    console.log('Testing WhatsApp API Integration...\n');

    // 1. Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${baseUrl}/health`);
    console.log('Health check response:', healthResponse.data);
    console.log('✅ Health check successful\n');

    // 2. Test sending a message
    console.log('2. Testing send message endpoint...');
    const messageData = {
      phoneNumber: '31612345678', // Replace with your test phone number
      message: 'Dit is een test bericht van Waviate!'
    };

    const sendResponse = await axios.post(
      `${baseUrl}/api/whatsapp/send`,
      messageData
    );
    console.log('Send message response:', sendResponse.data);
    console.log('✅ Message sent successfully\n');

    // 3. Display webhook URL for verification
    console.log('3. WhatsApp Webhook Configuration:');
    console.log(`Webhook URL: ${baseUrl}/api/whatsapp/webhook`);
    console.log(`Verify Token: ${process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN}`);
    console.log('\nInstructions:');
    console.log('1. Go to your WhatsApp Business Platform');
    console.log('2. Set up Webhooks with the above URL and verify token');
    console.log('3. Subscribe to the "messages" webhook field\n');

  } catch (error) {
    console.error('❌ Error during testing:', error.response?.data || error.message);
  }
}

// Run the tests
testWhatsAppAPI(); 