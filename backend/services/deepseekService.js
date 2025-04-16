const axios = require('axios');
const { AIConfig } = require('../../cursor_ai_workspaces/ai_agent/config');

/**
 * DeepSeek AI Service
 * Manages interactions with the DeepSeek AI API
 */
class DeepSeekService {
  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY;
    this.baseUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com';
    this.model = process.env.DEEPSEEK_MODEL || AIConfig.MODEL_NAME;
    
    if (!this.apiKey) {
      console.error('DeepSeek API key missing. Please set DEEPSEEK_API_KEY env variable.');
    }
  }

  /**
   * Generates a response using DeepSeek AI
   * @param {string} message - User's message
   * @param {Array} history - Conversation history
   * @returns {Promise<string>} AI-generated response
   */
  async generateResponse(message, history = []) {
    try {
      // Prepare conversation history in the format expected by DeepSeek
      const messages = this._prepareMessages(message, history);
      
      // Make API request
      const response = await axios.post(
        `${this.baseUrl}/v1/chat/completions`,
        {
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: AIConfig.MAX_TOKENS,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      // Extract and return the response text
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating DeepSeek response:', error.response?.data || error.message);
      throw new Error(`AI response generation failed: ${error.message}`);
    }
  }

  /**
   * Detects the intent of a user message
   * @param {string} message - User's message
   * @returns {Promise<object>} Detected intent
   */
  async detectIntent(message) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'Classify the following message into one of these intents: greeting, question, complaint, feedback, purchase_intent, human_agent_request, other. Return only the intent name without any explanation.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.3,
          max_tokens: 50,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      const intent = response.data.choices[0].message.content.trim().toLowerCase();
      return { intent };
    } catch (error) {
      console.error('Error detecting intent:', error.response?.data || error.message);
      return { intent: 'other' };
    }
  }

  /**
   * Transforms conversation history into the format needed for the DeepSeek API
   * @param {string} currentMessage - Current user message
   * @param {Array} history - Previous messages
   * @returns {Array} Formatted messages for the API
   * @private
   */
  _prepareMessages(currentMessage, history) {
    // Start with system prompt
    const messages = [
      {
        role: 'system',
        content: AIConfig.SYSTEM_PROMPT
      }
    ];
    
    // Add history (limited to prevent token overflows)
    const limitedHistory = history.slice(-AIConfig.MAX_HISTORY_LENGTH);
    limitedHistory.forEach(item => {
      messages.push({
        role: item.role,
        content: item.content
      });
    });
    
    // Add current message
    messages.push({
      role: 'user',
      content: currentMessage
    });
    
    return messages;
  }
}

module.exports = new DeepSeekService(); 