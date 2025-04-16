const { createClient } = require('@supabase/supabase-js');

/**
 * Supabase Service for database operations
 * Manages all Supabase interactions
 */
class SupabaseService {
  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase configuration missing. Please set SUPABASE_URL and SUPABASE_KEY env variables.');
    }
    
    this.client = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Gets the Supabase client instance
   * @returns {object} Supabase client
   */
  getClient() {
    return this.client;
  }

  /**
   * Creates SQL tables in Supabase if they don't exist
   * Can be used for initial setup
   * @returns {Promise<void>}
   */
  async setupTables() {
    // The actual table creation should be done through Supabase UI or migrations
    // This is a placeholder for checking if tables exist
    try {
      console.log('Checking Supabase tables...');
      
      // Check if leads table exists
      const { data: leadsTable, error: leadsError } = await this.client
        .from('leads')
        .select('id')
        .limit(1);
      
      if (leadsError && leadsError.code === '42P01') {
        console.error('Leads table does not exist. Please create it in the Supabase dashboard.');
      } else {
        console.log('Leads table exists.');
      }

      // Check if conversations table exists
      const { data: convsTable, error: convsError } = await this.client
        .from('conversations')
        .select('id')
        .limit(1);
      
      if (convsError && convsError.code === '42P01') {
        console.error('Conversations table does not exist. Please create it in the Supabase dashboard.');
      } else {
        console.log('Conversations table exists.');
      }

      // Check if messages table exists
      const { data: msgsTable, error: msgsError } = await this.client
        .from('messages')
        .select('id')
        .limit(1);
      
      if (msgsError && msgsError.code === '42P01') {
        console.error('Messages table does not exist. Please create it in the Supabase dashboard.');
      } else {
        console.log('Messages table exists.');
      }
    } catch (error) {
      console.error('Error checking Supabase tables:', error);
    }
  }
}

module.exports = new SupabaseService(); 