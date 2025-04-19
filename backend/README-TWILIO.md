# Twilio Webhook Configuratie

Deze handleiding beschrijft hoe je de Twilio webhook kunt configureren om SMS-berichten te ontvangen en te verwerken met de Waviate applicatie.

## Vereisten

1. Een Twilio account (https://www.twilio.com)
2. Een Twilio telefoonnummer met SMS-mogelijkheden
3. De Waviate backend gedeployed op Railway (of een andere hosting service)

## Stappen voor configuratie

### 1. Configureer omgevingsvariabelen

Zorg ervoor dat je de volgende omgevingsvariabelen hebt ingesteld in je Railway project:

```
TWILIO_ACCOUNT_SID=je_twilio_account_sid
TWILIO_AUTH_TOKEN=je_twilio_auth_token
TWILIO_PHONE_NUMBER=je_twilio_telefoonnummer
```

Je kunt deze waarden vinden in je Twilio Console.

### 2. Configureer de Twilio webhook

1. Log in op je Twilio Console (https://console.twilio.com)
2. Ga naar "Phone Numbers" > "Manage" > "Active Numbers"
3. Selecteer het telefoonnummer dat je wilt gebruiken
4. Scroll naar beneden naar de sectie "Messaging Configuration"
5. Bij "A MESSAGE COMES IN", stel de webhook URL in op:
   ```
   https://jouw-app-url.railway.app/api/twilio/webhook
   ```
   Vervang `jouw-app-url.railway.app` door je daadwerkelijke Railway URL
6. Zorg ervoor dat de methode is ingesteld op "HTTP POST"
7. Klik op "Save"

### 3. Configureer de statusupdates (optioneel)

Voor het ontvangen van statusupdates (delivery, sent, etc.):

1. In de Twilio Console, ga naar "Settings" > "Messaging" > "Settings"
2. Onder "STATUS CALLBACK URL", vul in:
   ```
   https://jouw-app-url.railway.app/api/twilio/status
   ```
3. Klik op "Save"

## Testen

Om de webhook te testen:

1. Stuur een SMS bericht naar je Twilio telefoonnummer
2. De Waviate applicatie zal het bericht ontvangen, verwerken met DeepSeek AI
3. De AI-gegenereerde respons wordt automatisch teruggestuurd naar het afzendende telefoonnummer

## Problemen oplossen

Als je problemen ondervindt met de webhook:

1. Controleer de Railway logs voor foutmeldingen
2. Zorg ervoor dat je URL correct is en publiek toegankelijk
3. Verifieer dat alle omgevingsvariabelen correct zijn ingesteld
4. Controleer of je Twilio account actief is en voldoende krediet heeft

## Verbinden met Facebook

Om je Twilio telefoonnummer te verbinden met Facebook WhatsApp Business:

1. Ga naar je WhatsApp Business Platform dashboard
2. Volg de instructies voor het toevoegen van een telefoonnummer
3. Kies voor "Use an existing phone number" of "Connect an external provider" 
4. Voer je Twilio telefoonnummer in
5. Volg de verificatiestappen van Facebook

Opmerking: Facebook kan beperkingen hebben voor welke telefoonnummers kunnen worden gebruikt voor WhatsApp Business. Zorg ervoor dat je een ondersteund nummer gebruikt. 