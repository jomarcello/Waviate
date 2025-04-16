/**
 * Message model for Supabase
 * Represents a message in a conversation
 */
class Message {
  /**
   * Creates a new message
   * @param {object} supabase - Supabase client
   * @param {object} messageData - Message data
   * @returns {Promise<object>} The created message
   */
  static async create(supabase, messageData) {
    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select();

    if (error) throw error;
    return data[0];
  }

  /**
   * Retrieves messages for a conversation
   * @param {object} supabase - Supabase client
   * @param {string} conversationId - The conversation ID
   * @param {number} limit - Max number of messages to retrieve
   * @returns {Promise<Array>} Array of messages
   */
  static async getByConversation(supabase, conversationId, limit = 50) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  /**
   * Marks a message as read
   * @param {object} supabase - Supabase client
   * @param {string} id - Message ID
   * @returns {Promise<object>} The updated message
   */
  static async markAsRead(supabase, id) {
    const { data, error } = await supabase
      .from('messages')
      .update({ is_read: true, read_at: new Date() })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  }

  /**
   * Gets unread messages count for a conversation
   * @param {object} supabase - Supabase client
   * @param {string} conversationId - The conversation ID
   * @returns {Promise<number>} Count of unread messages
   */
  static async getUnreadCount(supabase, conversationId) {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('conversation_id', conversationId)
      .eq('is_read', false);

    if (error) throw error;
    return count;
  }
}

module.exports = Message; 