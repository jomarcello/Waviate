"""
Configuration settings for WhatsApp API integration
"""

class WhatsAppConfig:
    # API Version
    API_VERSION = "v18.0"
    
    # Base URL for WhatsApp Business API
    BASE_URL = "https://graph.facebook.com/{version}"
    
    # Message templates
    TEMPLATES = {
        "welcome": "Welkom! Hoe kan ik u vandaag helpen?",
        "follow_up": "Bedankt voor uw bericht. Een van onze medewerkers zal spoedig contact met u opnemen.",
        "closing": "Bedankt voor het gesprek! Heeft u nog vragen?"
    }
    
    # Webhook configuration
    WEBHOOK = {
        "verify_token": None,  # To be set from environment variable
        "callback_url": "/webhook"
    }
    
    # Rate limiting (requests per minute)
    RATE_LIMIT = 200 