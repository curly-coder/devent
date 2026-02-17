# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js App Router project with PostHog analytics. The integration includes client-side event tracking using the modern `instrumentation-client.ts` approach (recommended for Next.js 15.3+), a reverse proxy configuration to improve tracking reliability, and automatic exception capture for error monitoring.

## Integration Summary

### Files Created
- `instrumentation-client.ts` - Client-side PostHog initialization with exception capture enabled
- `.env.local` - Environment variables for PostHog API key and host

### Files Modified
- `next.config.ts` - Added reverse proxy rewrites for PostHog ingestion
- `components/ExploreBtn.tsx` - Added `explore_events_clicked` event capture
- `components/EventCard.tsx` - Added `event_card_clicked` event capture with event properties
- `components/NavBar.tsx` - Added `nav_link_clicked` event capture with link name property

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `explore_events_clicked` | User clicks the Explore Events button to navigate to the events section | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks on an event card to view event details (includes event_title, event_slug, event_location, event_date properties) | `components/EventCard.tsx` |
| `nav_link_clicked` | User clicks on a navigation link (includes link_name property for Home, Events, Create Event, Logo) | `components/NavBar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://eu.posthog.com/project/127862/dashboard/527928) - Core analytics dashboard tracking user interactions and event engagement

### Insights
- [User Interactions Over Time](https://eu.posthog.com/project/127862/insights/2R6cSDyM) - Tracks all user interaction events over time
- [Event Card Engagement](https://eu.posthog.com/project/127862/insights/1gNQA7AK) - Shows event card click volume with breakdown by event title
- [Explore to Event Conversion Funnel](https://eu.posthog.com/project/127862/insights/HIdR9K07) - Tracks user journey from clicking Explore Events to clicking on an event card
- [Navigation Usage](https://eu.posthog.com/project/127862/insights/R0uIuV8t) - Breakdown of navigation link clicks by link name
- [Daily Active Users by Interaction](https://eu.posthog.com/project/127862/insights/LnfFmAWV) - Unique users performing each type of interaction per day

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Configuration Details

### Environment Variables
The following environment variables have been configured in `.env.local`:
- `NEXT_PUBLIC_POSTHOG_KEY` - Your PostHog project API key
- `NEXT_PUBLIC_POSTHOG_HOST` - PostHog host (https://eu.i.posthog.com)

### Reverse Proxy
A reverse proxy has been configured in `next.config.ts` to route PostHog requests through `/ingest/*`, improving tracking reliability by avoiding ad blockers.

### Automatic Features
- **Pageview tracking** - Automatically captures page views via the `defaults: '2025-11-30'` configuration
- **Exception capture** - Automatically captures unhandled exceptions via `capture_exceptions: true`
- **Session replay** - Available and can be enabled in your PostHog project settings
