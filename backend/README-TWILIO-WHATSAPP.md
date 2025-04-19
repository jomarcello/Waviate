# Twilio WhatsApp Configuratie Handleiding

Deze handleiding beschrijft hoe je WhatsApp Business via Twilio kunt configureren en koppelen aan de Waviate applicatie.

## Vereisten

1. Een betaald Twilio account (niet trial) - https://www.twilio.com
2. Een Meta Business Manager account
3. Een telefoon met WhatsApp geïnstalleerd voor het testen
4. De Waviate backend gedeployed op Railway (of een andere hosting service)

## Stap 1: Twilio Account Setup

1. Meld je aan voor een Twilio account als je er nog geen hebt
2. Upgrade je account naar betaald (pay-as-you-go) door je betalingsgegevens toe te voegen
3. Noteer je Twilio Account SID en Auth Token van het Twilio Dashboard

## Stap 2: WhatsApp Business Setup via Twilio

1. Ga naar de Twilio Console
2. Navigeer naar "Messaging" > "Try it out" > "WhatsApp"
3. Klik op de "Self-Signup" knop om het WhatsApp Business registratieproces te starten
4. Volg de stappen voor het verbinden of aanmaken van:
   - Je Meta Business Manager account
   - Een WhatsApp Business Account (WABA)
   - Een telefoonnummer voor WhatsApp berichten

### Meta Business Manager Verificatie (Aanbevolen)

Voor het beste resultaat, verifieer je Meta Business Manager account:
1. Ga naar https://business.facebook.com
2. Ga naar "Bedrijfsinstellingen" > "Bedrijfsinfo"
3. Volg de stappen voor verificatie (vereist bedrijfsdocumenten)

Een geverifieerd Meta Business Manager account heeft de volgende voordelen:
- Tot 20 telefoonnummers (versus 2 voor niet-geverifieerde accounts)
- Tot 20 WhatsApp Business Accounts (WABAs)
- Betere kans op goedkeuring van templates

## Stap 3: Telefoonnummer activeren voor WhatsApp

Tijdens de Self-Signup:
1. Kies een bestaand Twilio telefoonnummer of koop een nieuw nummer
2. Activeer dit nummer voor WhatsApp
3. Je telefoon wordt nu weergegeven onder "WhatsApp Senders" in de Twilio Console

## Stap 4: Webhook Configuratie

1. In de Twilio Console, ga naar "Phone Numbers" > "Manage" > "Active Numbers"
2. Selecteer het telefoonnummer dat je voor WhatsApp hebt geactiveerd
3. Scroll naar beneden naar "Messaging Configuration"
4. Stel de webhook URL in op:
   ```
   https://jouw-railway-url.up.railway.app/api/twilio/webhook
   ```
   Vervang `jouw-railway-url.up.railway.app` met je eigenlijke Railway URL
5. Zorg ervoor dat de methode is ingesteld op HTTP POST
6. Klik op "Save"

## Stap 5: Environment Variables Configuratie

Voeg de volgende omgevingsvariabelen toe aan je Railway project:

```
TWILIO_ACCOUNT_SID=jouw_account_sid
TWILIO_AUTH_TOKEN=jouw_auth_token
TWILIO_PHONE_NUMBER=jouw_whatsapp_telefoonnummer
```

Het telefoonnummer moet in internationaal formaat zijn, bijv. `+31612345678`

## Stap 6: Initieel Contact via WhatsApp

Voor alle nieuwe WhatsApp integraties moet de gebruiker eerst contact opnemen met jouw nummer:

1. Open WhatsApp op je telefoon
2. Voeg je Twilio WhatsApp-geactiveerde telefoonnummer toe aan je contacten
3. Stuur een eerste bericht naar dit nummer
4. Dit opent een 24-uurs "sessie" waarin je zakelijke berichten kunt versturen

## Stap 7: Testen van de Integratie

Na configuratie:
1. Stuur een bericht via WhatsApp naar je Twilio nummer
2. Je Waviate applicatie verwerkt het bericht via de Twilio webhook
3. DeepSeek AI genereert een antwoord
4. Het antwoord wordt automatisch teruggestuurd via Twilio's WhatsApp kanaal

## WhatsApp Template Berichten

Als je berichten buiten de 24-uurs sessie wilt versturen, moet je WhatsApp templates gebruiken:

1. Ga naar Twilio Console > "Messaging" > "Content Template Builder"
2. Maak een nieuwe template aan en dien deze in voor goedkeuring
3. Gebruik deze templates voor het initiëren van gesprekken

Meer informatie over templates vind je in de [Twilio WhatsApp Templates documentatie](https://www.twilio.com/docs/whatsapp/tutorial/send-whatsapp-notification-templates-using-twilio).

## Veelvoorkomende Problemen

1. **Berichten worden niet ontvangen**:
   - Controleer of je webhook URL correct is geconfigureerd
   - Zorg ervoor dat je omgevingsvariabelen juist zijn ingesteld
   - Controleer de Twilio logs voor mogelijke fouten

2. **Kan geen berichten initiëren**:
   - WhatsApp staat alleen reactieve berichten toe binnen 24 uur na een gebruikersbericht
   - Voor pro-actieve berichten moet je goedgekeurde templates gebruiken

3. **Beperkingen in aantal telefoonnummers**:
   - Niet-geverifieerde accounts: max 2 nummers
   - Geverifieerde accounts: max 20 nummers (kan verhoogd worden op aanvraag)

## Ondersteuning

Bij problemen met de WhatsApp integratie:
- Controleer de Railway logs voor backend fouten
- Bekijk de Twilio Console voor messaging logs
- Raadpleeg de [Twilio WhatsApp documentatie](https://www.twilio.com/docs/whatsapp) 