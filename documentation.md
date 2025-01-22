## New Learnings

### State Management
- Centralized notification handling using Redux improves code maintainability and reduces prop drilling
- Using Redux for cross-cutting concerns like notifications follows best practices for state management
- Backend messages should be used directly rather than creating custom messages in the frontend

### Map Behavior
- The map now zooms out to a level of 4 when creating a new report, providing a broader view of the United States
- Default zoom level is standardized across the application for consistency
- Location selection is handled without visual markers for improved privacy
- Address search and map click interactions use consistent location data handling
- Loading states are consistently displayed for both map and address search interactions
