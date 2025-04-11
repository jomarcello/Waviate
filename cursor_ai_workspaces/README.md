# Cursor AI Workspaces

Deze map bevat de configuratie en code voor de verschillende AI werkruimtes in het project.

## Structuur

### WhatsApp API Workspace
- `whatsapp_api/` - Configuratie en code voor WhatsApp Business API integratie
  - `config.py` - Configuratie-instellingen voor de WhatsApp API
  
### AI Agent Workspace
- `ai_agent/` - Configuratie en code voor de DeepSeek AI integratie
  - `config.py` - Configuratie-instellingen voor de AI agent

## Gebruik

1. Configureer de juiste omgevingsvariabelen in je `.env` bestand
2. Importeer de configuraties in je code:

```python
from cursor_ai_workspaces.whatsapp_api.config import WhatsAppConfig
from cursor_ai_workspaces.ai_agent.config import AIConfig
```

## Ontwikkeling

- Voeg nieuwe configuraties toe in de relevante `config.py` bestanden
- Houd de documentatie up-to-date
- Test nieuwe functionaliteit voordat je het naar productie pusht 