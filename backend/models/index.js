/**
 * Export all models from a single file
 */
const Lead = require('./Lead');
const Conversation = require('./Conversation');
const Message = require('./Message');

module.exports = {
  Lead,
  Conversation,
  Message
}; 