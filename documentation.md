# Documentation

## Database

- Users table: added `admin:boolean` (default: false, null: false). This flag is used for authorization checks. Not exposed via public serializers and not mass-assignable via registration/profile endpoints.

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
- Report creation API still accepts location parameters, but stores them as tip events instead of on the report
- Report update API no longer accepts location parameters
- Report serializer returns `lastSeenLocation` instead of direct location fields

## Frontend

- TipsSection ownership check: `isOwner` now derives from `report.userId || report.user_id || report.ownerId || report.owner_id || report.user?.id` and compares to `user.id` as strings to avoid type/shape mismatches.
- Messages: Conversations list displays associated report image/title and shows a preview of the last message sent by the other participant.
- Messages: Removed duplicate preview line in the conversations list items.
- Messages: Conversation thread now aligns current user messages to the right and other participant messages to the left.
- Messages: Alignment uses flex column with `self-end`/`self-start` and compares user ids as strings to avoid type mismatches.
- Messages: Conversations list column is now flexed with `min-h-0` overflow handling so long lists scroll correctly.
- Messages: Conversations list now uses shared pagination controls matching the Sightings & Tips section, positioned below the conversation panel outside the grid layout for visibility on all viewports, with mobile layout keeping controls flush against the conversation list.
- Messages: Scroll-to-top behavior disabled when navigating within messages section (e.g., clicking a conversation to view thread) to preserve user's scroll position.
- Report edit form: Location editing removed; location updates should be done via tip submission
- Report display components: All now use `lastSeenLocation` from tips instead of direct report location fields

## Deployment Notes

- Run migrations: `bin/rails db:migrate`
  - First run `20251106084319_migrate_report_locations_to_tips.rb` to backfill existing locations as tips
  - Then run `20251106084426_remove_location_from_reports.rb` to remove location columns
- Existing users will automatically have `admin` set to `false`.
- After migration, all existing report locations will be available as tip events with message "Initial location when reported"
