# Documentation

## Database

- Users table: added `admin:boolean` (default: false, null: false). This flag is used for authorization checks. Not exposed via public serializers and not mass-assignable via registration/profile endpoints.

## API

- No changes to registration or profile update params; `admin` is managed internally.

## Frontend

- TipsSection ownership check: `isOwner` now derives from `report.userId || report.user_id || report.ownerId || report.owner_id || report.user?.id` and compares to `user.id` as strings to avoid type/shape mismatches.
- Messages: Conversations list displays associated report image/title and shows a preview of the last message sent by the other participant.
- Messages: Removed duplicate preview line in the conversations list items.
- Messages: Conversation thread now aligns current user messages to the right and other participant messages to the left.
- Messages: Alignment uses flex column with `self-end`/`self-start` and compares user ids as strings to avoid type mismatches.

## Deployment Notes

- Run migrations: `bin/rails db:migrate`
- Existing users will automatically have `admin` set to `false`.
