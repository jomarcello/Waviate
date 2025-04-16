# Waviate WhatsApp Outreach Platform

Een platform voor geautomatiseerde WhatsApp communicatie met leads, geïntegreerd met DeepSeek AI en Supabase.

## Overzicht

Deze applicatie maakt gebruik van de volgende technologieën:

- **WhatsApp Business API** - Voor het versturen en ontvangen van berichten via WhatsApp
- **DeepSeek AI** - Voor het genereren van intelligente, relevante antwoorden
- **Supabase** - Voor het opslaan van leads, gesprekken en berichten
- **Railway** - Voor deployment en hosting
- **Retool** - Voor het bouwen van een dashboard-interface

## Project Structuur

```
/waviate
│
├── /backend                  # Backend (API en Webhook logica)
│   ├── /server               # Express server
│   ├── /controllers          # Request handlers
│   ├── /services             # Business logic en externe API integraties
│   ├── /models               # Supabase modellen
│   └── /routes               # API routes
│
├── /scripts                  # Database scripts en migraties
│   └── /migrations           # Supabase tabel definities
│
├── /cursor_ai_workspaces     # Cursor AI configuratie
│   ├── /whatsapp_api         # WhatsApp API configuratie
│   └── /ai_agent             # DeepSeek AI configuratie
│
└── /docs                     # Documentatie
```

## Setup Instructies

### 1. Accounts en API Keys

1. **WhatsApp Business API**
   - Maak een WhatsApp Business account aan via Facebook Developer Portal
   - Configureer een app en verkrijg de nodige API tokens

2. **Supabase**
   - Maak een Supabase account en project aan
   - Configureer tabellen met het script in `scripts/migrations/create_tables.sql`
   - Verkrijg de Supabase URL en API key

3. **DeepSeek AI**
   - Maak een DeepSeek account aan
   - Verkrijg een API key voor het gebruik van de chat model

### 2. Omgevingsvariabelen

Kopieer het voorbeeld `.env` bestand:

```bash
cp backend/.env.example backend/.env
```

Vul de juiste waarden in voor alle variabelen:

```
# Server
PORT=3000
NODE_ENV=production
BASE_URL=https://jouw-railway-url.up.railway.app

# WhatsApp API
WHATSAPP_PHONE_NUMBER_ID=123456789
WHATSAPP_ACCESS_TOKEN=your_token_here
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_key

# DeepSeek AI
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_API_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
```

### 3. Deployment op Railway

1. Push je code naar GitHub
2. Verbind je Railway account met je GitHub repository
3. Creëer een nieuw project in Railway en configureer de volgende instellingen:
   - Verwijzen naar de `/backend` map als de root
   - Zet alle omgevingsvariabelen in Railway
   - Gebruik het `npm start` commando voor starten

4. Deploy je applicatie
5. Verifieer dat de webhook URL correct werkt door te testen

### 4. Supabase Tables Setup

Run het SQL script uit `scripts/migrations/create_tables.sql` in de Supabase SQL Editor. Dit zal alle benodigde tabellen, indices en relaties aanmaken.

### 5. WhatsApp Webhook Configuratie

Configure de webhook in de Meta Developer Portal:

1. Ga naar je WhatsApp app in de Meta Developer Portal
2. Navigeer naar 'WhatsApp > Configuration'
3. Voeg je webhook URL toe: `https://jouw-railway-url.up.railway.app/api/whatsapp/webhook`
4. Gebruik dezelfde verify token als in je `.env` bestand
5. Selecteer de 'messages' webhook subscription

### 6. Retool Dashboard

1. Maak een Supabase resource in Retool
2. Creëer dashboards voor:
   - Lead overzicht
   - Gesprekken browser
   - Berichten verzenden

## API Endpoints

### WhatsApp Endpoints

- `GET /api/whatsapp/webhook` - Voor webhook verificatie door Meta
- `POST /api/whatsapp/webhook` - Voor het ontvangen van berichten
- `POST /api/whatsapp/send` - Voor het manueel versturen van berichten
- `GET /api/whatsapp/leads/:leadId/history` - Voor het ophalen van gesprekgeschiedenis

## Onderhoud en Monitoring

- Railway geeft basis monitoring en logging
- Controleer regelmatig de logs voor fouten
- Monitor krediet/quota verbruik voor WhatsApp API en DeepSeek

## Problemen Oplossen

### Webhook Verificatie Faalt

1. Controleer of de webhook URL correct is
2. Controleer of het verify token exact overeenkomt
3. Controleer of het endpoint bereikbaar is vanuit het internet

### Berichten worden niet ontvangen/verzonden

1. Controleer de WhatsApp API credentials
2. Controleer de Railway logs voor fouten
3. Verifieer dat de webhook subscriptions actief zijn

## Contact

Voor vragen of ondersteuning, neem contact op met de ontwikkelaar. 