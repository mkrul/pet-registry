## New Learnings

- Error notifications for login failures are handled through Redux state management
- The Notification component requires both the notification state and a way to clear notifications (onClose handler)
- After logout, users should be redirected to the login page to maintain proper authentication flow
- Success notifications should be shown for successful authentication actions with messages from the backend
- Notifications should be handled at the layout level to persist across route changes
- Success notifications for API actions should be handled in a single location to prevent duplicates
- Notifications should be centered and constrained within the page layout for consistent display
