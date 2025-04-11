"""
Configuration settings for AI Agent integration with DeepSeek
"""

class AIConfig:
    # DeepSeek API Configuration
    MODEL_NAME = "deepseek-chat"
    API_VERSION = "v1"
    
    # Conversation settings
    MAX_HISTORY_LENGTH = 10
    MAX_TOKENS = 2000
    
    # Response templates
    SYSTEM_PROMPT = """
    Je bent een behulpzame business assistent die klanten helpt via WhatsApp.
    Wees vriendelijk, professioneel en to-the-point.
    Geef duidelijke antwoorden en vraag door waar nodig.
    """
    
    # Conversation flow settings
    FLOW = {
        "greeting": True,
        "intent_detection": True,
        "sentiment_analysis": True,
        "human_handoff_detection": True
    }
    
    # Language settings
    DEFAULT_LANGUAGE = "nl"
    SUPPORTED_LANGUAGES = ["nl", "en"] 