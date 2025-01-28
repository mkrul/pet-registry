## New Learnings

### State Management
- Centralized notification handling using Redux improves code maintainability and reduces prop drilling
- Using Redux for cross-cutting concerns like notifications follows best practices for state management
- Backend messages should be used directly rather than creating custom messages in the frontend
- Consolidating state management improves maintainability
- Proper separation of concerns between API calls and local state
- Loading and error states should be handled consistently

### Map Behavior
- The map now zooms out to a level of 4 when creating a new report, providing a broader view of the United States
- Default zoom level is standardized across the application for consistency
- Location selection is handled without visual markers for improved privacy
- Address search and map click interactions use consistent location data handling
- Loading states are consistently displayed for both map and address search interactions

### Code Organization
- Validation logic organized into domain-specific concerns improves code maintainability
- Following established patterns in the codebase for concern organization
- Core model validations separated from specialized validations (location, image, color) for better organization
- Search functionality extracted into a concern for better separation of concerns
- Data normalization logic extracted into a dedicated concern for improved maintainability

### Testing
- RSpec tests follow strict guidelines for readability and maintainability
- Tests focus on individual validations and edge cases
- FactoryBot is used for test data creation
- Each test focuses on a single expectation for clarity
- Added tests for breed validation against species
- Implemented tests for gender validation
- Added image size and format validation tests
- Included tests for color uniqueness validation
- Added location data completeness tests
- Implemented tests for attribute normalization
- Added tests for searchable concern functionality
- Implemented tests for breed list edge cases
- Added location validation edge case tests
- Included color validation edge case tests
- Added normalization edge case tests
- Added tests for intersection field validation
- Implemented tests for searchkick settings validation
- Added breed list file corruption handling tests
- Included image attachment presence tests
- Added normalization of nil values tests

### API Authentication
- Case-insensitive email handling improves user experience
- Proper content-type headers are crucial for JSON API endpoints
- Request parameter handling should be consistent between JSON and form data

### API Testing
- API tests should consistently use JSON format for request bodies
- Headers should be consistent across all API test cases

### Authentication Architecture
- Consolidated authentication logic into a single controller improves maintainability
- Session management should be handled consistently across all authentication endpoints
- Remember-me functionality and session expiration are handled in one place

### Controller Design
- Breaking complex authentication logic into focused methods improves maintainability
- Consistent error handling and response formats improve API reliability
- Extracting configuration options reduces duplication and improves maintainability

### Session Management
- Proper session store configuration is essential for maintaining authentication state
- Complete session destruction requires clearing multiple authentication states
- Frontend state must be synchronized with backend session
- Remember tokens must be explicitly cleared from both cookies and user records
- Complete session cleanup requires updating the user record
- Remember token validation must check both cookie and database values
- User authentication should fail if remember_token is cleared from database
- Session authentication should verify both session validity and remember token status
- User lookup from session must respect remember token state
- All authentication methods must consistently validate remember token state
- Warden user lookup should respect the same authentication rules as other methods

### Error Handling
- Consistent error response formatting improves API reliability
- transformErrorResponse should be used across all API endpoints for uniform error handling

### API Slice Management
- When resetting API state, use the current slice instance rather than undefined references
- Proper instance references prevent TypeScript errors and runtime issues

### Redux Toolkit
- Action creators must be properly imported before use
- Missing imports can cause TypeScript errors

### RTK Query
- Mutation hooks require proper argument types
- Empty objects can be used as default arguments when no data is needed

### Redux Actions
- Use the correct action creators for state management
- clearUser is the appropriate action for logout functionality

### Session Persistence
- Proper session store configuration is essential for maintaining authentication state
- Cookies must be properly included in API requests
- Frontend state must be synchronized with backend session

### Session Security
- CSRF protection is essential for all state-changing requests
- Complete logout requires clearing both client and server state
- Force page reload after logout ensures clean state

### Notifications System Updates
- Removed default error messages from notifications system
- Notifications now only display messages provided from the backend
- Error messages from the sessions controller are now properly displayed
- Notifications slice handles both object and string error messages
