/**
 * Lead model for Supabase
 * Represents a WhatsApp lead in the system
 */
class Lead {
  /**
   * Creates a new lead record in Supabase
   * @param {object} supabase - Supabase client
   * @param {object} leadData - Lead data
   * @returns {Promise<object>} The created lead
   */
  static async create(supabase, leadData) {
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select();

    if (error) throw error;
    return data[0];
  }

  /**
   * Finds a lead by phone number
   * @param {object} supabase - Supabase client
   * @param {string} phoneNumber - The lead's phone number
   * @returns {Promise<object|null>} The lead if found, null otherwise
   */
  static async findByPhone(supabase, phoneNumber) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('phone_number', phoneNumber)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Updates a lead's status
   * @param {object} supabase - Supabase client
   * @param {string} id - Lead ID
   * @param {string} status - New status
   * @returns {Promise<object>} The updated lead
   */
  static async updateStatus(supabase, id, status) {
    const { data, error } = await supabase
      .from('leads')
      .update({ status, updated_at: new Date() })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  }

  /**
   * Lists all leads with pagination
   * @param {object} supabase - Supabase client
   * @param {number} page - Page number (1-based)
   * @param {number} pageSize - Page size
   * @returns {Promise<Array>} Array of leads
   */
  static async list(supabase, page = 1, pageSize = 20) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return data;
  }
}

module.exports = Lead; 