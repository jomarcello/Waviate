const supabaseService = require('./supabaseService');
const deepseekService = require('./deepseekService');
const { Lead, Conversation, Message } = require('../models');

/**
 * Conversation Service
 * Manages the flow of messages and integration with AI
 */
class ConversationService {
  constructor() {
    this.supabase = supabaseService.getClient();
  }

  /**
   * Processes an incoming message from WhatsApp
   * @param {object} message - WhatsApp message object
   * @param {string} phoneNumber - Sender's phone number
   * @returns {Promise<object>} Response details
   */
  async processIncomingMessage(message, phoneNumber) {
    try {
      // 1. Find or create lead in the database
      const lead = await this._findOrCreateLead(phoneNumber);
      
      // 2. Find or create conversation for this lead
      const conversation = await this._findOrCreateConversation(lead.id);
      
      // 3. Save the incoming message
      const messageContent = this._extractMessageContent(message);
      const savedMessage = await this._saveMessage({
        conversation_id: conversation.id,
        content: messageContent,
        direction: 'inbound',
        message_type: message.type || 'text',
        metadata: message
      });
      
      // 4. Detect message intent
      const { intent } = await deepseekService.detectIntent(messageContent);
      
      // 5. Get conversation history
      const history = await this._getConversationHistory(conversation.id);
      
      // 6. Generate AI response
      let aiResponse;
      
      // Check if human handoff is requested
      if (intent === 'human_agent_request') {
        // Update conversation status to require human attention
        await Conversation.updateStatus(this.supabase, conversation.id, 'needs_human_attention');
        aiResponse = "Ik zal ervoor zorgen dat een medewerker contact met u opneemt. Bedankt voor uw geduld.";
      } else {
        // Get AI-generated response
        aiResponse = await deepseekService.generateResponse(messageContent, history);
      }
      
      // 7. Save the AI response as an outbound message
      await this._saveMessage({
        conversation_id: conversation.id,
        content: aiResponse,
        direction: 'outbound',
        message_type: 'text',
        metadata: { intent, ai_generated: true }
      });
      
      // 8. Return response for sending back to WhatsApp
      return {
        phoneNumber,
        message: aiResponse,
        leadId: lead.id,
        conversationId: conversation.id,
        intent
      };
    } catch (error) {
      console.error('Error processing incoming message:', error);
      throw error;
    }
  }

  /**
   * Gets a lead's conversation history for the dashboard
   * @param {string} leadId - Lead ID
   * @returns {Promise<object>} Lead conversation history
   */
  async getLeadConversationHistory(leadId) {
    try {
      // Get lead information
      const { data: lead, error: leadError } = await this.supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();
      
      if (leadError) throw leadError;
      
      // Get the lead's conversation
      const conversation = await Conversation.findByLeadId(this.supabase, leadId);
      
      if (!conversation) {
        return {
          lead,
          conversation: null,
          messages: []
        };
      }
      
      // Get all messages for this conversation
      const messages = await Message.getByConversation(this.supabase, conversation.id);
      
      return {
        lead,
        conversation,
        messages
      };
    } catch (error) {
      console.error('Error getting lead conversation history:', error);
      throw error;
    }
  }

  /**
   * Finds or creates a lead in the database
   * @param {string} phoneNumber - Lead's phone number
   * @returns {Promise<object>} Lead object
   * @private
   */
  async _findOrCreateLead(phoneNumber) {
    // Try to find existing lead
    const existingLead = await Lead.findByPhone(this.supabase, phoneNumber);
    
    if (existingLead) {
      return existingLead;
    }
    
    // Create new lead if not found
    return await Lead.create(this.supabase, {
      phone_number: phoneNumber,
      status: 'new',
      created_at: new Date(),
      updated_at: new Date()
    });
  }

  /**
   * Finds or creates a conversation for a lead
   * @param {string} leadId - Lead ID
   * @returns {Promise<object>} Conversation object
   * @private
   */
  async _findOrCreateConversation(leadId) {
    // Try to find existing active conversation
    const existingConversation = await Conversation.findByLeadId(this.supabase, leadId);
    
    if (existingConversation) {
      return existingConversation;
    }
    
    // Create new conversation if not found
    return await Conversation.create(this.supabase, {
      lead_id: leadId,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    });
  }

  /**
   * Saves a message to the database
   * @param {object} messageData - Message data
   * @returns {Promise<object>} Saved message
   * @private
   */
  async _saveMessage(messageData) {
    return await Message.create(this.supabase, {
      ...messageData,
      is_read: messageData.direction === 'outbound',
      created_at: new Date(),
      read_at: messageData.direction === 'outbound' ? new Date() : null
    });
  }

  /**
   * Gets conversation history in a format suitable for AI
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<Array>} Conversation history
   * @private
   */
  async _getConversationHistory(conversationId) {
    const messages = await Message.getByConversation(this.supabase, conversationId);
    
    // Format messages for the AI service
    return messages.map(msg => ({
      role: msg.direction === 'inbound' ? 'user' : 'assistant',
      content: msg.content
    }));
  }

  /**
   * Extracts the message content from a WhatsApp message object
   * @param {object} message - WhatsApp message object
   * @returns {string} Extracted message content
   * @private
   */
  _extractMessageContent(message) {
    if (message.type === 'text' && message.text) {
      return message.text.body;
    } else if (message.type === 'interactive' && message.interactive) {
      const { type } = message.interactive;
      if (type === 'button_reply') {
        return message.interactive.button_reply.title;
      } else if (type === 'list_reply') {
        return message.interactive.list_reply.title;
      }
    }
    return 'Bericht ontvangen (niet-tekst bericht)';
  }
}

module.exports = new ConversationService(); 