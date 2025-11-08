# Documentation

## Database

- Users table: added `admin:boolean` (default: false, null: false). This flag is used for authorization checks. Not exposed via public serializers and not mass-assignable via registration/profile endpoints.
- Users `settings` JSONB default now includes granular email preferences (`send_email_for_tip`, `send_email_for_message`, `send_email_for_conversation`, `send_email_for_match`) alongside `allow_contact` and `dark_mode`. Migration `20251108093000_update_user_settings_defaults.rb` preserves each user's prior preferences when backfilling from the legacy `email_notifications` flag.

## Location Data Migration (November 6, 2025)

- **Report Location Migration:** All location data has been migrated from reports to tip events
  - Location fields (area, state, country, latitude, longitude, intersection) removed from reports table
  - Initial report location is now stored as a tip event created automatically when a report is created
  - Location updates should be done via tip submission, not report updates
  - Report location is accessed via `lastSeenLocation` which pulls from the most recent tip with location data
  - Search indexing uses cached tip location data from the most recent tip
  - Initial report locations use privacy offset (0.0025 degrees) for coordinates
  - Subsequent tip locations store exact coordinates (no privacy offset)

## API

- No changes to registration or profile update params; `admin` is managed internally.
- Settings update endpoint now accepts `allow_contact`, `dark_mode`, `send_email_for_tip`, `send_email_for_message`, `send_email_for_conversation`, and `send_email_for_match`; legacy `email_notifications` is no longer used.
- Report creation API still accepts location parameters, but stores them as tip events instead of on the report
- Report update API no longer accepts location parameters
- Report serializer returns `lastSeenLocation` instead of direct location fields

## Frontend

- Dashboard pet edit form now uses the same dashboard card layout, labels, and native inputs as the settings/profile pages via new `dashboard` variants on `PetEditForm` field components while preserving the Material UI presentation for other contexts.
- TipsSection ownership check: `isOwner` now derives from `