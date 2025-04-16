const axios = require('axios');
require('dotenv').config();

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

async function testWebhook() {
  try {
    console.log('Testing WhatsApp Webhook Integration\n');

    // 1. Test base endpoint
    console.log('1. Testing base endpoint...');
    const baseResponse = await axios.get(baseUrl);
    console.log('Base endpoint response:', baseResponse.data);
    console.log('✅ Base endpoint test successful\n');

    // 2. Test health endpoint
    console.log('2. Testing health endpoint...');
    const healthResponse = await axios.get(`${baseUrl}/health`);
    console.log('Health check response:', healthResponse.data);
    console.log('✅ Health check successful\n');

    // 3. Test webhook verification
    console.log('3. Testing webhook verification...');
    const verifyResponse = await axios.get(`${baseUrl}/api/whatsapp/webhook`, {
      params: {
        'hub.mode': 'subscribe',
        'hub.verify_token': verifyToken,
        'hub.challenge': 'test_challenge_123'
      }
    });
    console.log('Webhook verification response:', verifyResponse.data);
    console.log('✅ Webhook verification successful\n');

    // 4. Test webhook with invalid token
    console.log('4. Testing webhook with invalid token...');
    try {
      await axios.get(`${baseUrl}/api/whatsapp/webhook`, {
        params: {
          'hub.mode': 'subscribe',
          'hub.verify_token': 'invalid_token',
          'hub.challenge': 'test_challenge_123'
        }
      });
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Invalid token correctly rejected\n');
      } else {
        throw error;
      }
    }

    // 5. Test webhook POST endpoint
    console.log('5. Testing webhook POST endpoint...');
    const webhookResponse = await axios.post(`${baseUrl}/api/whatsapp/webhook`, {
      object: 'whatsapp_business_account',
      entry: [{
        changes: [{
          value: {
            messages: [{
              from: '31612345678',
              text: { body: 'Test message' }
            }]
          }
        }]
      }]
    });
    console.log('Webhook POST response:', webhookResponse.data);
    console.log('✅ Webhook POST test successful\n');

  } catch (error) {
    console.error('❌ Error during testing:', error.response?.data || error.message);
    console.error('Full error:', error);
  }
}

// Run the tests
console.log('Starting webhook tests...\n');
testWebhook(); 