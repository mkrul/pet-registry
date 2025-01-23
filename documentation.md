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
