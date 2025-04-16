import requests
from typing import Dict, Any

class WhatsAppAPI:
    def __init__(self, phone_number_id: str, access_token: str):
        self.phone_number_id = phone_number_id
        self.access_token = access_token
        self.base_url = f"https://graph.facebook.com/v18.0/{phone_number_id}/messages"

    def send_message(self, phone_number: str, message: str) -> Dict[str, Any]:
        """
        Send a WhatsApp message to a specific phone number.
        
        Args:
            phone_number (str): The recipient's phone number in international format
            message (str): The message content to send
            
        Returns:
            Dict[str, Any]: The API response
        """
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
        
        data = {
            "messaging_product": "whatsapp",
            "to": phone_number,
            "type": "text",
            "text": {"body": message}
        }

        response = requests.post(self.base_url, json=data, headers=headers)
        return response.json()

    def send_template_message(self, phone_number: str, template_name: str, parameters: Dict[str, str]) -> Dict[str, Any]:
        """
        Send a WhatsApp template message.
        
        Args:
            phone_number (str): The recipient's phone number
            template_name (str): The name of the approved template
            parameters (Dict[str, str]): Template parameters
            
        Returns:
            Dict[str, Any]: The API response
        """
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
        
        data = {
            "messaging_product": "whatsapp",
            "to": phone_number,
            "type": "template",
            "template": {
                "name": template_name,
                "language": {"code": "en"},
                "components": [
                    {
                        "type": "body",
                        "parameters": [
                            {"type": "text", "text": value}
                            for value in parameters.values()
                        ]
                    }
                ]
            }
        }

        response = requests.post(self.base_url, json=data, headers=headers)
        return response.json() 