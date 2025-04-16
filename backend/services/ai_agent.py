import requests
from typing import Dict, Any, List

class AIAgent:
    def __init__(self, api_key: str, model: str = "gpt-3.5-turbo"):
        self.api_key = api_key
        self.model = model
        self.base_url = "https://api.openai.com/v1/chat/completions"

    def get_response(self, messages: List[Dict[str, str]], temperature: float = 0.7) -> str:
        """
        Get a response from the AI model based on the conversation history.
        
        Args:
            messages (List[Dict[str, str]]): List of message dictionaries with 'role' and 'content'
            temperature (float): Controls randomness in the response (0.0 to 1.0)
            
        Returns:
            str: The AI's response
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature
        }

        response = requests.post(self.base_url, json=data, headers=headers)
        response_data = response.json()
        
        if "choices" in response_data and len(response_data["choices"]) > 0:
            return response_data["choices"][0]["message"]["content"]
        else:
            raise Exception("Failed to get response from AI model")

    def generate_lead_response(self, lead_message: str, context: Dict[str, Any] = None) -> str:
        """
        Generate a response for a lead's message with optional context.
        
        Args:
            lead_message (str): The message from the lead
            context (Dict[str, Any], optional): Additional context about the lead
            
        Returns:
            str: The generated response
        """
        system_prompt = """You are a helpful business assistant for a financial services company. 
        Your goal is to engage with potential leads in a professional and friendly manner, 
        while gathering relevant information about their needs and interests."""
        
        if context:
            system_prompt += f"\nAdditional context: {context}"

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": lead_message}
        ]

        return self.get_response(messages) 