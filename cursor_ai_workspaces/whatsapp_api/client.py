"""
WhatsApp API Client for interacting with the Meta Cloud API
Provides methods for sending and receiving messages.
"""

import os
import json
import requests
from datetime import datetime
from config import WhatsAppConfig

class WhatsAppClient:
    """
    WhatsApp API Client for sending messages and handling webhooks
    """
    
    def __init__(self):
        """Initialize the client with configuration"""
        self.phone_number_id = os.getenv('WHATSAPP_PHONE_NUMBER_ID')
        self.access_token = os.getenv('WHATSAPP_ACCESS_TOKEN')
        self.api_version = os.getenv('WHATSAPP_API_VERSION', WhatsAppConfig.API_VERSION)
        self.base_url = WhatsAppConfig.BASE_URL.format(version=self.api_version)
        
        # Validate required environment variables
        if not self.phone_number_id or not self.access_token:
            raise ValueError("WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN environment variables are required")
        
        # Set headers used for all requests
        self.headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
    
    def send_text_message(self, phone_number, message):
        """
        Send a text message to a recipient
        
        Args:
            phone_number (str): Recipient's phone number in international format (e.g., 31612345678)
            message (str): Message content
            
        Returns:
            dict: Response from the WhatsApp API
        """
        # Format phone number (remove + and spaces if present)
        formatted_number = phone_number.replace('+', '').replace(' ', '')
        
        # Prepare request data
        payload = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": formatted_number,
            "type": "text",
            "text": {
                "preview_url": False,
                "body": message
            }
        }
        
        # Send request
        try:
            response = requests.post(
                f"{self.base_url}/{self.phone_number_id}/messages",
                headers=self.headers,
                json=payload
            )
            
            # Handle response
            response.raise_for_status()
            result = response.json()
            
            # Log success
            self._log_message("SENT", formatted_number, message, result)
            
            return result
            
        except requests.exceptions.RequestException as e:
            # Log error
            self._log_error("Failed to send message", e)
            raise
    
    def send_template_message(self, phone_number, template_name, language="nl", components=None):
        """
        Send a template message to a recipient
        
        Args:
            phone_number (str): Recipient's phone number in international format
            template_name (str): Name of the template to use
            language (str): Language code for the template
            components (list): Template components (header, body, buttons)
            
        Returns:
            dict: Response from the WhatsApp API
        """
        # Format phone number
        formatted_number = phone_number.replace('+', '').replace(' ', '')
        
        # Prepare request data
        payload = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": formatted_number,
            "type": "template",
            "template": {
                "name": template_name,
                "language": {
                    "code": language
                }
            }
        }
        
        # Add components if provided
        if components:
            payload["template"]["components"] = components
        
        # Send request
        try:
            response = requests.post(
                f"{self.base_url}/{self.phone_number_id}/messages",
                headers=self.headers,
                json=payload
            )
            
            # Handle response
            response.raise_for_status()
            result = response.json()
            
            # Log success
            self._log_message("SENT_TEMPLATE", formatted_number, template_name, result)
            
            return result
            
        except requests.exceptions.RequestException as e:
            # Log error
            self._log_error(f"Failed to send template {template_name}", e)
            raise
    
    def process_webhook(self, webhook_data):
        """
        Process incoming webhook data from WhatsApp
        
        Args:
            webhook_data (dict): Webhook data from WhatsApp
            
        Returns:
            list: Extracted messages
        """
        extracted_messages = []
        
        try:
            # Check if this is a WhatsApp webhook
            if webhook_data.get("object") != "whatsapp_business_account":
                return []
            
            # Process each entry
            for entry in webhook_data.get("entry", []):
                # Process changes in this entry
                for change in entry.get("changes", []):
                    if change.get("field") != "messages":
                        continue
                    
                    # Get messages from this change
                    value = change.get("value", {})
                    messages = value.get("messages", [])
                    
                    # Process each message
                    for message in messages:
                        # Extract message data
                        message_data = self._extract_message_data(message)
                        if message_data:
                            extracted_messages.append(message_data)
                            self._log_message("RECEIVED", message_data["from"], message_data["content"], message)
            
            return extracted_messages
            
        except Exception as e:
            self._log_error("Error processing webhook", e)
            return []
    
    def _extract_message_data(self, message):
        """
        Extract useful data from a message object
        
        Args:
            message (dict): Message object from webhook
            
        Returns:
            dict: Extracted message data
        """
        if not message or "from" not in message or "type" not in message:
            return None
        
        message_type = message["type"]
        content = "Unknown message type"
        
        # Extract content based on message type
        if message_type == "text" and "text" in message:
            content = message["text"]["body"]
        elif message_type == "image" and "image" in message:
            content = f"[Image: {message['image'].get('caption', 'No caption')}]"
        elif message_type == "audio" and "audio" in message:
            content = "[Audio message]"
        elif message_type == "document" and "document" in message:
            content = f"[Document: {message['document'].get('filename', 'Unknown file')}]"
        elif message_type == "location" and "location" in message:
            lat = message["location"].get("latitude")
            lng = message["location"].get("longitude")
            content = f"[Location: {lat},{lng}]"
        elif message_type == "interactive" and "interactive" in message:
            interactive_type = message["interactive"]["type"]
            if interactive_type == "button_reply":
                content = f"[Button: {message['interactive']['button_reply']['title']}]"
            elif interactive_type == "list_reply":
                content = f"[List: {message['interactive']['list_reply']['title']}]"
        
        return {
            "id": message.get("id", "unknown-id"),
            "from": message["from"],
            "timestamp": message.get("timestamp", ""),
            "type": message_type,
            "content": content,
            "raw_data": message
        }
    
    def _log_message(self, action, phone_number, content, data=None):
        """
        Log message activity
        
        Args:
            action (str): Type of action (SENT, RECEIVED, etc.)
            phone_number (str): Phone number involved
            content (str): Message content
            data (dict): Additional data to log
        """
        timestamp = datetime.now().isoformat()
        log_entry = {
            "timestamp": timestamp,
            "action": action,
            "phone": phone_number,
            "content": content
        }
        
        if data:
            log_entry["data"] = data
        
        # Log to console (in production this should go to a proper logger)
        print(f"[{timestamp}] WHATSAPP {action}: {phone_number} - {content}")
    
    def _log_error(self, message, error):
        """
        Log error information
        
        Args:
            message (str): Error description
            error (Exception): Exception object
        """
        timestamp = datetime.now().isoformat()
        
        # Extract error details
        if hasattr(error, 'response') and error.response:
            error_details = {
                "status_code": error.response.status_code,
                "reason": error.response.reason,
                "body": error.response.text
            }
        else:
            error_details = str(error)
        
        # Log to console
        print(f"[{timestamp}] WHATSAPP ERROR: {message} - {error_details}")


if __name__ == "__main__":
    # Example usage
    try:
        client = WhatsAppClient()
        
        # Example: Send a message
        response = client.send_text_message("31612345678", "Hello from the WhatsApp API client!")
        print(f"Message sent: {response}")
        
        # Example: Send a template message
        template_response = client.send_template_message(
            "31612345678",
            "welcome_message",
            "nl",
            [
                {
                    "type": "body",
                    "parameters": [
                        {
                            "type": "text",
                            "text": "John"
                        }
                    ]
                }
            ]
        )
        print(f"Template sent: {template_response}")
        
    except Exception as e:
        print(f"Error in example: {e}") 