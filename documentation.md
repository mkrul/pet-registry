## New Learnings

- Error notifications for login failures are handled through Redux state management
- The Notification component requires both the notification state and a way to clear notifications (onClose handler)
- After logout, users should be redirected to the login page to maintain proper authentication flow
- Success notifications should be shown for successful authentication actions with messages from the backend
- Notifications should be handled at the layout level to persist across route changes
- Success notifications for API actions should be handled in a single location to prevent duplicates
- Notifications should be centered and constrained within the page layout for consistent display
- Map zoom levels should be consistently controlled through the initialZoom prop, avoiding hardcoded values in both MapContainer and MapEvents components
- Session persistence requires proper credential handling in API requests
- User state should only be cleared on explicit authentication failures
- Page refreshes should maintain authentication state when valid session exists
- Loading states should be shown during authentication checks to prevent UI flashing
- Skeleton loaders provide better user experience during authentication state transitions
- Avatar images should be preloaded to prevent visual flashing during authentication
- Loading states should account for both data and asset loading

## Search Interface Updates
- Migrated to a unified search experience across all device sizes
- Replaced the separate desktop and mobile search interfaces with a single slide-out search panel
- Search panel is accessed via a floating action button in the bottom-right corner
- Panel slides in from the right side when activated
- Maintains all existing search and filter functionality
- Panel width is responsive: full-width on mobile, 1/3 width on larger devices
- Search bar consistently displays full-width above action buttons
- Filters are now always visible for improved accessibility and usability
- Search button uses refined sizing for optimal visibility across screen sizes
- Added enhanced outward pulsing glow animation to search button on all devices that stops permanently after first click
- Prevents page scrolling and layout shifts when search panel is open

## UI/UX Improvements
- Fixed layout shift caused by horizontal scrollbar during search panel animation by adding global CSS to prevent horizontal overflow while maintaining vertical scrolling functionality

## Recent Updates
- Fixed issue with browser's vertical scrollbar disappearing when dropdown filters are opened in the search panel
  - Solution: Added `disableScrollLock: true` to Material-UI Select components' MenuProps
  - This prevents Material-UI from locking the body scroll when dropdowns are opened while maintaining dropdown functionality

## Performance Optimizations
- Added database indices for frequently queried columns to improve report loading times
- Indexed status and species fields for faster filtering
- Added composite index for location-based queries (country, state)
- Added indices for timestamp columns to improve sorting performance
- Optimized query performance for archived/active report filtering
- Optimized front-end data fetching with strategic caching
- Reduced unnecessary API calls on page refresh
- Improved initial state handling for search parameters
- Fixed color field indexing in Elasticsearch for proper filtering
- Reindexed reports to ensure all searchable fields are properly indexed
