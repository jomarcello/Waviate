"""
DeepSeek AI Agent for WhatsApp Conversation Management
Provides intelligent responses based on conversation context.
"""

import os
import json
import requests
from datetime import datetime
from config import AIConfig

class DeepSeekAgent:
    """
    DeepSeek AI Agent handling the conversation flow with WhatsApp leads
    """
    
    def __init__(self):
        """Initialize the agent with configuration"""
        self.api_key = os.getenv('DEEPSEEK_API_KEY')
        self.api_url = os.getenv('DEEPSEEK_API_URL', 'https://api.deepseek.com')
        self.model = os.getenv('DEEPSEEK_MODEL', AIConfig.MODEL_NAME)
        self.system_prompt = AIConfig.SYSTEM_PROMPT
        self.max_history = AIConfig.MAX_HISTORY_LENGTH
        self.max_tokens = AIConfig.MAX_TOKENS
        
        # Validate API key
        if not self.api_key:
            raise ValueError("DEEPSEEK_API_KEY environment variable is required")
    
    def generate_response(self, message, conversation_history=None):
        """
        Generate a response using DeepSeek AI
        
        Args:
            message (str): The incoming message from the user
            conversation_history (list): Previous messages in the conversation
            
        Returns:
            str: The AI-generated response
        """
        if conversation_history is None:
            conversation_history = []
        
        # Prepare messages for API
        messages = self._prepare_messages(message, conversation_history)
        
        # Make API request
        try:
            response = requests.post(
                f"{self.api_url}/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": self.model,
                    "messages": messages,
                    "temperature": 0.7,
                    "max_tokens": self.max_tokens
                }
            )
            
            # Handle API response
            response.raise_for_status()
            result = response.json()
            
            # Log the result (for debugging)
            self._log_response(message, result)
            
            # Extract and return the generated text
            return result["choices"][0]["message"]["content"]
            
        except requests.exceptions.RequestException as e:
            print(f"Error calling DeepSeek API: {e}")
            return "Sorry, I'm having trouble connecting to my brain right now. Please try again later."
    
    def detect_intent(self, message):
        """
        Detect the intent of the user's message
        
        Args:
            message (str): The incoming message from the user
            
        Returns:
            dict: Intent classification result
        """
        system_message = (
            "Classify the following message into one of these intents: "
            "greeting, question, complaint, feedback, purchase_intent, "
            "human_agent_request, other. Return only the intent name."
        )
        
        try:
            response = requests.post(
                f"{self.api_url}/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": self.model,
                    "messages": [
                        {"role": "system", "content": system_message},
                        {"role": "user", "content": message}
                    ],
                    "temperature": 0.3,
                    "max_tokens": 50
                }
            )
            
            response.raise_for_status()
            result = response.json()
            intent = result["choices"][0]["message"]["content"].strip().lower()
            
            return {"intent": intent}
            
        except Exception as e:
            print(f"Error detecting intent: {e}")
            return {"intent": "other"}
    
    def _prepare_messages(self, current_message, history):
        """
        Format conversation history for the API request
        
        Args:
            current_message (str): Current user message
            history (list): Previous messages
            
        Returns:
            list: Formatted messages for API request
        """
        # Start with system message
        messages = [{"role": "system", "content": self.system_prompt}]
        
        # Add history (limited to prevent token overflow)
        limited_history = history[-self.max_history:] if history else []
        for msg in limited_history:
            messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })
        
        # Add current message
        messages.append({"role": "user", "content": current_message})
        
        return messages
    
    def _log_response(self, message, response):
        """
        Log API responses for debugging and analysis
        
        Args:
            message (str): The original message
            response (dict): The API response
        """
        timestamp = datetime.now().isoformat()
        log_entry = {
            "timestamp": timestamp,
            "input": message,
            "response": response
        }
        
        # Log to console for now
        print(f"[{timestamp}] AI Response Log: {json.dumps(log_entry, indent=2)}")


if __name__ == "__main__":
    # Example usage
    agent = DeepSeekAgent()
    
    # Test conversation
    history = [
        {"role": "user", "content": "Hallo, ik wil graag informatie over jullie diensten."},
        {"role": "assistant", "content": "Hallo! Natuurlijk kan ik je meer vertellen over onze diensten. We bieden verschillende oplossingen aan. Waar ben je specifiek in geïnteresseerd?"}
    ]
    
    # Generate a response
    user_message = "Ik wil graag weten wat de kosten zijn."
    intent = agent.detect_intent(user_message)
    print(f"Detected intent: {intent['intent']}")
    
    response = agent.generate_response(user_message, history)
    print(f"AI Response: {response}") 