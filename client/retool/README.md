# Waviate Retool Dashboards

Deze map bevat JSON-configuraties voor de Retool dashboards die gebruikt worden in de Waviate WhatsApp Outreach Platform.

## Dashboards

- `leads_dashboard.json` - Dashboard voor het bekijken en beheren van leads en hun gesprekken

## Setup Instructies

### 1. Maak een Retool account

Ga naar [Retool](https://retool.com/) en maak een account aan als je er nog geen hebt.

### 2. Maak resources aan

1. Maak een **Supabase** resource aan:
   - Ga naar 'Resources' in de Retool interface
   - Klik op 'Create a new resource'
   - Selecteer 'Supabase'
   - Voer je Supabase URL en API key in
   - Sla de resource op als 'supabase'

2. Maak een **REST API** resource aan:
   - Ga naar 'Resources' in de Retool interface
   - Klik op 'Create a new resource'
   - Selecteer 'REST API'
   - Voer de base URL van je Railway API in (bijv. https://jouw-api.up.railway.app)
   - Sla de resource op als 'waviate_api'

### 3. Importeer de dashboards

1. Ga naar de Retool editor
2. Klik op 'Create new' > 'Import from JSON'
3. Kopieer en plak de inhoud van het JSON-bestand 
4. Klik op 'Import'

### 4. Configureer de dashboards

Na het importeren moet je mogelijk nog enkele kleine aanpassingen doen:

1. Controleer of de queries correct verwijzen naar je resources
2. Test de verbindingen en queries
3. Pas eventueel de styling aan naar je eigen wensen

## Dashboard Overzicht

### Leads Dashboard

Dit dashboard geeft een overzicht van alle leads in het systeem en maakt het mogelijk om:

- Leads te bekijken en filteren
- Gesprekken met leads te bekijken
- Berichten te versturen naar leads

#### Componenten

- **Leads Table**: Toont alle leads met hun basisinformatie
- **Filters**: Filtert leads op status, datum en zoektekst
- **Conversation View**: Toont het volledige gesprek met een geselecteerde lead
- **Send Message**: Stuurt een nieuw bericht naar de geselecteerde lead

#### Queries

- `getLeadsQuery`: Haalt alle leads op uit Supabase
- `getLeadMessagesQuery`: Haalt alle berichten op voor een specifieke lead
- `sendMessageQuery`: Verstuurt een bericht naar een lead via de WhatsApp API

## Aanpassingen

Je kunt de dashboards naar wens aanpassen. Enkele suggesties:

- Voeg extra filters toe
- Maak grafieken voor statistieken
- Voeg mogelijkheden toe voor bulkacties
- Integreer notificaties voor nieuwe berichten

## Problemen Oplossen

### Data wordt niet geladen

1. Controleer of je resources correct zijn geconfigureerd
2. Controleer de query parameters
3. Test de API endpoints direct in de resource-instellingen

### UI-problemen

1. Controleer of alle componenten correct zijn gerenderd
2. Inspecteer de console voor JavaScript-fouten
3. Probeer de dashboard te herimporteren 