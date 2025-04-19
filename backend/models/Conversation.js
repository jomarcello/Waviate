/**
 * Conversation model for Supabase
 * Represents a conversation with a lead
 */
class Conversation {
  /**
   * Creates a new conversation
   * @param {object} supabase - Supabase client
   * @param {object} conversationData - Conversation data
   * @returns {Promise<object>} The created conversation
   */
  static async create(supabase, conversationData) {
    const { data, error } = await supabase
      .from('conversations')
      .insert([conversationData])
      .select();

    if (error) throw error;
    return data[0];
  }

  /**
   * Finds a conversation by lead ID
   * @param {object} supabase - Supabase client
   * @param {string} leadId - The lead's ID
   * @returns {Promise<object|null>} The conversation if found, null otherwise
   */
  static async findByLeadId(supabase, leadId) {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('lead_id', leadId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Updates a conversation's status
   * @param {object} supabase - Supabase client
   * @param {string} id - Conversation ID
   * @param {string} status - New status
   * @returns {Promise<object>} The updated conversation
   */
  static async updateStatus(supabase, id, status) {
    const { data, error } = await supabase
      .from('conversations')
      .update({ status, updated_at: new Date() })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  }

  /**
   * Updates a conversation with provided data
   * @param {object} supabase - Supabase client
   * @param {string} id - Conversation ID
   * @param {object} updateData - Data to update
   * @returns {Promise<object>} The updated conversation
   */
  static async update(supabase, id, updateData) {
    const { data, error } = await supabase
      .from('conversations')
      .update({ ...updateData, updated_at: new Date() })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  }

  /**
   * List all conversations with pagination
   * @param {object} supabase - Supabase client
   * @param {number} page - Page number (1-based)
   * @param {number} pageSize - Page size
   * @returns {Promise<Array>} Array of conversations
   */
  static async list(supabase, page = 1, pageSize = 20) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        lead:lead_id(id, name, phone_number)
      `)
      .order('updated_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return data;
  }
}

module.exports = Conversation; 