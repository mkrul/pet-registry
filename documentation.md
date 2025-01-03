## New Learnings
- Only include instructional messages where they provide relevant context
- Differentiate between new report creation and editing workflows
- Use consistent label styling (text-sm, font-medium, text-gray-900) across related forms
- Use semantic HTML elements (label instead of h3) for form field labels
- Maintain consistent label styling even for read-only sections
- Pay attention to exact font sizes when matching styles between components
- Use text-base for form labels to ensure better readability
- Show location feedback in both edit and view modes for better user experience
- Maintain consistent location display patterns across form states
- Reuse successful UI patterns across related components
- Maintain consistent location feedback across all form variants
- Pay attention to subtle label text differences between forms
- Maintain consistent button widths for similar actions
- Use consistent image preview sizes across forms
- Avoid using placeholder text in select inputs for better UX consistency
- Keep form input behavior consistent across similar forms
- Remove placeholder text from all select inputs for consistent user experience
- Apply consistent dropdown patterns across all form sections
- Use consistent button styles for similar actions (like remove buttons)
- Prefer icon-only buttons for common actions to reduce visual clutter
- Use subtle hover effects instead of error colors for common actions like remove buttons
- Maintain consistent button styling across forms by avoiding variant and color props when matching existing designs
- Pay attention to exact button padding and icon sizes for visual consistency
- Use lighter colors and smaller icons for secondary actions to maintain visual hierarchy
- Reuse existing component styles when available instead of creating new variations
- Use consistent icon components (MUI vs FontAwesome) within the same context
- Use consistent button components (MUI Button vs HTML button) across related forms
- Maintain consistent text button styling using MUI's variant="text" and color="primary"
- Apply consistent button styling patterns across all similar actions in forms
- Use MUI Button component consistently for all action buttons in forms
- Use consistent form validation across related forms
- Validate forms on the frontend before making API calls to improve user experience
- Reuse existing validation logic to maintain consistency across forms
- Consider both new and existing data when implementing form validation
- Check for existing assets before requiring new uploads in edit forms
- Ensure interface field types match between related interfaces to maintain type compatibility
- Make form interfaces compatible with API response interfaces for seamless data handling
- Ensure all nullable fields are consistently marked as nullable across related interfaces
- Handle nullable form values by converting null to empty string for MUI Select components
- Split complex form components into view/edit modes for better separation of concerns
- Extract form action logic into custom hooks for reusability
- Use existing form section components to maintain consistency
- Define explicit prop interfaces for form mode components
- Avoid spreading undefined props to child components
- Maintain strict typing for event handlers in form components
- Ensure event handler types are compatible with all child component requirements
- Use consistent null checks for all optional date fields in form data
- Learned how to test LogoutButton component's logout functionality using Vitest and React Testing Library
- Use Vitest's mocking utilities for consistent test behavior
- Properly mock Redux hooks in component tests
- Test both success and error scenarios for async operations
- Use proper assertion timing with waitFor for async operations
- Follow established patterns for Redux store mocking in tests
- Use proper type imports for test mocks to maintain type safety
- Properly type test utilities and mocks to catch potential issues early
- Follow consistent type import patterns across test files
- Empty test files will cause Vitest to report no test suites found
- Always implement complete test cases with proper assertions
- Use proper typing for test utilities to maintain type safety
- Mock window methods properly in test environment
- Test React Router hook behavior in isolation
- Verify side effects in components without DOM output
- Define mock objects inside vi.mock callbacks to avoid hoisting issues
- Use vi.mocked when accessing mock exports for better type safety
- Export internal mock objects through the mock module for configuration
- Avoid mixing require with ES modules in tests - use consistent module system
- Keep mock references at module level when needed across multiple test contexts
- Follow consistent API mocking patterns across test files, especially for Redux store setup
- Use factory functions to create consistent mock objects across test setup and assertions
- Avoid using factory functions that could be affected by hoisting in test files
- Use getByRole with name matchers for better element querying specificity in tests
- Use data-testid for unique element identification when role and name are not specific enough
- Use getAllByTestId when multiple elements share the same test ID and select by index
- Properly type mock reducers when configuring test store to match Redux expectations
- Use role-based queries with type selectors for form controls
- Adjust test timeouts for complex async operations
- Use role with name matchers for more precise button identification in tests
- Use consistent element querying strategy across all test cases for the same component
- Use getByLabelText for file inputs in Material-UI components instead of test IDs
- Wait for conditional elements to appear after async actions in tests

Testing Best Practices:
- Use renderWithProviders helper for consistent test setup with Redux and Router
- Mock API hooks at module level to ensure consistent behavior across test cases
- Use proper typing for mock implementations to catch type errors early
- Organize form tests by functional sections (rendering, validation, interaction)
- Test form validation before testing submission logic
- Mock file uploads with proper File constructor parameters
- Test dynamic form field visibility based on user interactions
- Verify loading states and disabled states during form submission
- Use waitFor for asynchronous UI updates after user interactions
- Test error notifications with proper error message assertions
- Mock location-based functionality consistently across tests
- Test form field dependencies and validation rules together
- Use proper cleanup between tests to prevent state leakage
- Mock complex hooks like useReportForm at module level
- Test loading states for initial data fetching
- Test proper error handling for failed submissions
- Verify proper form state management during async operations
- Test proper cleanup of notification messages
- Test proper handling of file upload validations
- Include all required properties when mocking RTK Query mutation states
- Ensure mutation state mocks include reset function and originalArgs
- Mock Redux middleware functions with proper function chain (middleware => store => next => action)
- Ensure RTK Query API mocks include middleware and reducer implementations
- Type middleware mock parameters explicitly to avoid TypeScript implicit any errors
- Type all middleware chain parameters (next, action) to maintain strict TypeScript checks
- Export both individual hooks and API object when mocking RTK Query APIs
- Define hook mocks outside the returned object for reuse within the mock
- Use getByRole with name matcher for button elements in MUI components
- Mock all required hooks when testing components with multiple hook dependencies
- Set up proper initial state in hook mocks to test conditional UI elements
- Use role-based queries with name matchers for MUI buttons instead of test IDs
- Use consistent query methods across all similar elements (e.g., all buttons use getByRole)
- Match button text exactly as it appears in the component, including case sensitivity
- Match button text exactly including case and special characters when using getByRole
- Set up proper initial form state to test conditional button visibility
- Wrap Material-UI button interactions in act() to handle async state updates
- Use longer timeouts for tests with multiple async operations
- Use name matcher instead of type for finding submit buttons with getByRole
- Match button text case-insensitively when exact text is not critical
- Handle Material-UI ripple effect updates in tests
- Use unique and specific test IDs to avoid duplicate selector issues
- Differentiate between form fields and descriptive text with specific test IDs
- Use getAllByTestId when expecting multiple elements with same test ID
- Match test IDs exactly as they appear in the component code
- When updating test IDs, update both component and test files together
- Consider using constants for test IDs to maintain consistency
- Use suffixes like '-field', '-help-text' to differentiate between similar elements
- Avoid reusing the same test ID for different elements in the same component
- Use getAllByTestId when intentionally querying multiple elements with same test ID
- Use React.act instead of ReactDOMTestUtils.act for handling state updates in tests
- Import act directly from 'react' package to avoid deprecation warnings
- Handle React Router future flag warnings by considering v7 migration flags
- Create snapshot tests for complex form components
- Match test IDs exactly with component implementation
- Configure React Router future flags to prevent warnings
- Keep test IDs in sync between tests and components
- Create __snapshots__ directory for snapshot files
- Apply React Router future flags in test setup
- Use consistent snapshot format across test files
- Use consistent element querying strategy within the same test file
- Prefer getByRole for interactive elements like buttons
- Use data-testid for non-interactive or structural elements
- Use exact button text for Material-UI file upload buttons
- Check component implementation for correct button text/labels
- Avoid regex matchers when exact text is known
- Mock form validation state in useReportSubmit hook
- Provide mock image preview data in useReportForm hook
- Mock hook state to match expected component behavior
- Use role="alert" to find notification messages in tests
- Test notification content along with presence
- Match notification test queries to Material-UI Alert component implementation
- Check actual component implementation for correct test selectors
- Use data-testid for components that don't use ARIA roles consistently
- Consider component hierarchy when testing notifications and alerts
- Use Material-UI's built-in ARIA roles for testing alerts and notifications
- Remember that MUI Alert component uses role="alert" by default
- Check Material-UI component documentation for correct test selectors
- When component uses data-testid, prefer it over role-based queries
- Don't assume MUI components are being used when custom components exist
- Match test queries to actual component implementation without modifying components
- Ensure notification state is properly mocked in useReportSubmit hook
- Use longer timeouts when testing notification appearance
- Mock complete notification state object including visibility flags
- Use proper enum values when mocking notification types
- Import type definitions used in mocks to maintain type safety
- Match notification state structure exactly as used in component
- Mock form visibility state to match expected UI state after user interactions
- Include all form fields in mock data even if initially empty
- Set visibility flags in hook mocks to test conditional rendering
- Use getAllByTestId when testing components with duplicate test IDs
- Match button text exactly as it appears in the component, including capitalization
- Use array indexing to test specific instances of duplicate elements
- Set initial visibility states in hook mocks to match component's default state
- Use separate test cases for initial state and state after user interactions
- Ensure mock state matches component's expected initial render state
- Match button text exactly including uppercase/lowercase and special characters
- Use error messages to identify exact button text in component
- Verify button text in component DOM output before updating tests
- Mock state setter functions to actually update mock state values
- Use closure scope in vi.mock to maintain state between renders
- Handle state updates in mock implementations for UI interaction tests
- Use setTimeout in mock implementations to ensure state updates trigger re-renders
- Handle async state updates in mock implementations properly
- Consider component re-render timing when testing state changes
- Use rerender from render result to force component update after state changes
- Check element count instead of specific index when testing dynamic elements
- Use length assertions for testing multiple elements with same test ID
- Match test IDs exactly with component implementation for color fields
- Use consistent test ID patterns across similar form controls
- Verify test IDs in component code before writing tests
- Mock all form field visibility states in hook mocks
- Implement state setters for all visibility flags
- Include all possible form fields in mock data structure
- Use data-testid for buttons when role-based queries are unreliable
- Prefer data-testid over text content for button identification
- Use consistent button identification strategy within test suite
- Fall back to role-based queries when data-testid is not available
- Use exact button text when data-testid is not implemented
- Maintain consistent query strategy within test suite
- Use exact test ID from component implementation
- Verify test ID in component code before writing tests
- Maintain consistent test ID naming across components
- Verify test IDs directly from component implementation files
- Use consistent test ID naming between component and test files
- Keep test ID references in sync with component implementation

## Testing Learnings

- When testing form components that show/hide elements based on form state, ensure that mocks provide the correct initial state that matches the component's expectations
- For ColorFields component, the first "Add Another Color" button (data-testid="add-color-button-1") only appears when color1 has a value and showColor2 is false
- When mocking state setter functions (like setShowColor2), ensure they actually update the mock state values for proper testing of conditional rendering
- When testing Material-UI Button components, use getByRole("button", { name: "button text" }) instead of getByTestId
- Material-UI Button components don't automatically include data-testid attributes, while custom button elements might have them
- For ColorFields component:
  - First "Add Another Color" button is a Material-UI Button component - use getByRole to find it
  - Second "Add Another Color" button is a custom button element with data-testid - use getByTestId
- When testing conditional rendering that depends on initial state, use waitFor to ensure the component has rendered with the expected state
- For ColorFields component:
  - The first "Add Another Color" button (data-testid="add-color-button-1") needs time to render after initial state is set
  - Use waitFor to ensure the button is in the DOM before attempting to interact with it
- When testing form components with dependent fields:
  - Pay attention to the complete sequence of state changes needed
  - For ColorFields component:
    - First button appears when color1 has value and showColor2 is false
    - After clicking first button, must select a color2 value
    - Second button only appears after color2 has a value
  - Mock state should reflect the complete state needed at each step
- When testing Material-UI components with conditional rendering:
  - Check if the component uses data-testid or relies on MUI's default accessibility roles
  - For MUI Button without data-testid, use getByText instead of getByRole or getByTestId
  - Ensure mock state handlers (like handleInputChange) actually update the state
  - Pay attention to the initial state values that control conditional rendering
- When mocking React hooks:
  - Module-level mocks (vi.mock) take precedence over test-case level mocks
  - All hook functions used in components must be defined in the module mock
  - Event handlers in mocks should update mock state to simulate real behavior
  - Keep state management consistent between all mock functions
  - Define mock event handlers at module level to ensure they're available to all tests
- When defining mock handlers that reference mock state:
  - Declare all state variables before defining handlers that use them
  - Keep state declarations at the top of the mock scope
  - Ensure variables are in scope for all functions that reference them
- When using vi.mock for React hooks:
  - Module-level mocks must include ALL functions and properties used by the component
  - Test-specific mocks cannot override module-level mocks
  - Event handlers defined in module-level mocks should be accessible to all tests
  - Missing handlers in module-level mocks will cause all tests to fail
  - Keep mock implementations consistent between module-level and test-specific mocks
- When mocking React hooks with complex state:
  - Mock must match the exact interface of the original hook
  - Include all form fields in the mock state, even optional ones
  - Event handlers must be defined at module level, not in test cases
  - State updates in mock handlers must match the original hook behavior
  - Use vi.fn() for event handlers that need to be spied on in tests
  - Mock state structure must match the type definitions exactly
- When mocking React hooks with component callbacks:
  - Event handler functions must be properly mocked with vi.fn()
  - Setter functions must be mocked as functions, not just values
  - Component callbacks (like onShowBreed2Change) must be included in the mock
  - State updates in mock functions should maintain internal state consistency
  - All component-required props must be included in the mock
- When using module-level mocks:
  - Remove duplicate mock implementations in individual test cases
  - Rely on the module-level mock state and handlers
  - Test-level mocks cannot override module-level mocks in vi.mock

- When testing Material-UI form components with conditional buttons:
  - Use findByTestId instead of getByText for buttons that depend on state
  - Wait for initial state to be set up before interacting with elements
  - Verify that data-testid attributes match exactly with component implementation
  - Use findBy queries for elements that may not be immediately available

- When testing Material-UI form components with conditional rendering:
  - First "Add Another Color" button is a MUI Button - use getByRole with exact text
  - Second button appears after first color is selected - use findByTestId
  - Use findBy queries for elements that appear after state changes
  - Wait for elements to be available after state updates with findBy
  - Match button text exactly including capitalization

- When testing form input clearing:
  - Use userEvent.clear() instead of userEvent.type("") to clear input values
  - userEvent.type() requires actual characters to type, cannot type empty string
  - For validation testing, clearing the input is more appropriate than typing empty string
  - Remember that userEvent simulates real user keyboard interactions

- When testing form validation:
  - Prefer testing validation through form submission rather than direct input manipulation
  - Form submission triggers all validation rules consistently
  - Some inputs may not be directly editable in test environment
  - Use form-level events to test validation behavior
  - Remember that MUI components may have different editability in test environment

- When testing form validation sequences:
  - Mock validation messages need to reflect the current form state
  - Update mock responses based on form field values
  - Consider the validation order in the actual validation logic
  - Mock hooks need to be aware of form state changes
  - Remember that validation messages should match the first failing validation rule

- When mocking hooks that need to access form state:
  - Define state variables in the mock closure scope
  - Share state between mock implementations using closure scope
  - Ensure state is accessible to all mock functions
  - Remember that mock scope is isolated from test scope

- When mocking multiple hooks that share state:
  - Create a shared mock state object outside mock definitions
  - Use the same state reference in all related mocks
  - Update shared state in mock handlers
  - Ensure state updates are reflected across all mocks

- When mocking form state for components with required fields:
  - Include all required fields in mock state, even if empty
  - Match the exact type structure from the component interface
  - Provide default values that won't cause type coercion errors
  - Remember that undefined values can cause runtime errors with string methods
  - Initialize optional fields as null rather than undefined

- When mocking form state updates in tests:
  - Use spread operator to maintain all existing fields when updating
  - Update the entire form state object to trigger reactive updates
  - Ensure mock state updates are reflected in all dependent mocks
  - Remember that mock state updates need to be immutable
  - Keep state management consistent between related mocks

- When testing MUI input changes:
  - Use fireEvent.change instead of userEvent.type for MUI inputs
  - Include both name and value in the change event target
  - Query for the actual input element within the MUI wrapper
  - Remember that MUI inputs are wrapped in multiple divs
  - Use querySelector to find the actual input element

- When testing with snapshots and shared state:
  - Reset mock state before each test to ensure consistent snapshots
  - Place snapshot tests before other tests that modify state
  - Clear all mocks in beforeEach to prevent state leakage
  - Remember that snapshots capture the initial state
  - Keep snapshot tests independent of other test state changes

- When testing form validation with shared mock state:
  - Rerender component after state changes to trigger validation updates
  - Use RTL's rerender function to force component update
  - Remember that mock state changes don't automatically trigger rerenders
  - Ensure validation state is consistent before assertions
  - Consider component lifecycle when testing validation messages

- When testing components that need store rerendering:
  - Define Redux store at module level for consistent access
  - Use same store instance for initial render and rerenders
  - Avoid creating new store instances during tests
  - Remember that store needs to be accessible for rerender calls
  - Keep store configuration consistent across test cases

- When testing MUI form validation with complex inputs:
  - Query for nested input elements using querySelector
  - Use textarea selector for multiline text fields
  - Remember that MUI wraps inputs in multiple container divs
  - Target the actual input element for change events
  - Validate error messages on the container element

- When testing form validation with default values:
  - Reset mock state fields to empty before validation tests
  - Clear default values that might prevent validation errors
  - Remember that mock state initialization can affect validation
  - Test validation messages against notification component
  - Ensure mock state reflects the intended test scenario

- When mocking form validation with multiple fields:
  - Mock validation in the same order as the actual form
  - Chain validation checks using ternary operators
  - Return appropriate error message for first failing validation
  - Ensure mock validation logic matches component behavior
  - Remember that validation order affects error messages

- When testing form validation order with mock state:
  - Update mock state after input changes to maintain field values
  - Set all required fields before testing specific validation
  - Remember that resetting one field shouldn't clear others
  - Ensure mock state updates preserve existing valid data
  - Consider the full form state when testing individual validations

- When testing form validation with mock state updates:
  - Rerender component after updating mock state
  - Use RTL's rerender function to ensure state changes are reflected
  - Pass the same provider structure to rerender as initial render
  - Remember that mock state updates don't automatically trigger rerenders
  - Ensure validation state is synchronized with component state

- When testing form validation sequences with multiple required fields:
  - Test validations in the same order as the form implementation
  - Fill in all previous required fields before testing each validation
  - Mock complete objects for complex fields like images
  - Handle nested validation requirements (e.g., location requiring multiple fields)
  - Use consistent test patterns for all validation cases

- When mocking form state with optional fields:
  - Use empty strings instead of null for optional string fields
  - Keep null only for explicitly nullable numeric fields
  - Match the component's expected types exactly
  - Avoid type coercion in mock state
  - Remember that form fields usually expect string values

# Test Coverage Updates

## FilterContainer Component Tests
- Added comprehensive test suite for FilterContainer component
- Tests cover all major filter interactions including species, color, gender, and location filters
- Includes tests for filter reset logic when changing country/state
- Snapshot testing implemented for UI consistency
- All tests utilize data-testid attributes for reliable element selection

### Key Learnings
- Use data-testid attributes for reliable component testing
- Test filter dependencies (country->state->area) thoroughly
- Mock store provider for components using Redux
- Snapshot testing helps catch unintended UI changes

### Material-UI Select Component Testing
- Use `within(listbox).getByText()` to find options within MUI Select dropdowns
- Query for listbox using `screen.getByRole("listbox")` after triggering dropdown
- Trigger dropdown with `fireEvent.mouseDown()` on select element
- Use data-testid for select components but role/text for options
- Remember that MUI Select options are rendered in a portal when dropdown is open

### Material-UI Select Testing Best Practices
- When testing MUI Select components, target the native input element directly
- Use querySelector to find the native input by name attribute
- Trigger change events on the native input instead of trying to interact with the portal
- Focus on testing the onChange handler behavior rather than the UI interactions
- Keep tests simple by avoiding complex portal interactions
- Use data-testid to find select containers reliably
- When testing MUI Select changes, mock the event object structure exactly
- Use simple event objects with just target.name and target.value
- Call the handler directly instead of triggering DOM events
- Match the component's expected event structure in assertions
- Test disabled states by checking the native input element's disabled attribute
- Test select dependencies (country->state->area) by verifying disabled states
- Mock API hooks that provide select options with consistent test data
- Test both enabled and disabled states for dependent selects

### Key Testing Patterns
- Find MUI Select's native input by name attribute
- Trigger change events directly for better performance
- Skip unnecessary UI interactions in tests
- Keep test implementation simple

### RTK Query Testing Best Practices
- Mock both API hooks and the default export for RTK Query APIs
- Include reducerPath and middleware in API mocks
- Provide mock data for dependent queries
- Mock API module at top level before component renders

### Key Testing Patterns
- Mock complete modules when using RTK Query
- Use proper module structure in mocks
- Test filter dependency chains thoroughly
- Verify component markup before writing tests

### Key Testing Patterns
- Use type assertions when working with querySelector in tests
- Handle potential null values from DOM queries

### Key Testing Patterns
- Use consistent test patterns across all similar interactions
- Apply same select testing strategy throughout test suite
- Maintain consistent approach for all MUI Select tests

## New Learnings
- When testing MUI Select components:
  - Use querySelector to find the native input element
  - Trigger change events directly on the native input
  - Use data-testid attributes for reliable element selection
  - Match exact option values from configuration files
- For snapshot testing:
  - Create snapshots at the container level to capture full component state
  - Include provider wrappers in snapshot renders
- When testing filter components:
  - Test both the presence of filter options and their interactions
  - Verify filter changes trigger correct handler calls
  - Use configuration files as source of truth for options
  - Test option presence before testing interactions

### Key Testing Patterns
- Test input components for both controlled and uncontrolled behavior
- Test event handlers with appropriate event objects
- Test keyboard interactions with proper key events
- Verify placeholder text and accessibility attributes

### Key Testing Patterns
- Match component prop names exactly as defined in interfaces
- Verify prop names against component interface definitions

### Key Testing Patterns
- Test clearing functionality for search inputs
- Verify input placeholder text matches design requirements

### Key Testing Patterns
- Test button text content changes based on props
- Use rerender to test component with different prop values
- Test toggle functionality with boolean state
- Verify button click handlers are called with correct arguments

### Key Testing Patterns
- Mock router hooks for components using URL params
- Test URL parameter updates with window.location
- Use act() for asynchronous state updates
- Test container components with their child interactions

### Key Testing Patterns
- Mock utility functions used by container components
- Separate act() calls for different state updates
- Mock router hooks with proper return values
- Test URL parameter management through mocked functions

### Key Testing Patterns
- Extract common render logic into helper functions
- Use consistent mock data across all tests
- Avoid async/await when not needed for state updates
- Keep mocks simple and predictable

### Key Testing Patterns
- Mock date/time utilities for consistent test output
- Test date formatting through utility function calls
- Verify date display through text content rather than specific elements
- Use consistent date formats in test mocks

### Key Testing Patterns
- Create utility modules before writing tests that depend on them
- Keep utility functions simple and focused

### Key Testing Patterns
- Use correct relative paths when importing utility modules
- Verify import paths match project structure

### Key Testing Patterns
- Add TypeScript types to mock component props
- Make props optional when mocking display components

### Key Testing Patterns
- Type test helper functions with ReactElement
- Use explicit types for test utility parameters

### Key Testing Patterns
- Match mock data types exactly with component prop types
- Include all required props in test mock objects

### Key Testing Patterns
- Match interface definitions exactly in test mocks
- Include all required interface properties in mock data

### Key Testing Patterns
- Include all required nested interface properties in mocks
- Match child component prop types exactly in test data

### Key Testing Patterns
- Match exact property types from interfaces
- Pay attention to string vs number type requirements

### Key Testing Patterns
- Wrap components using router features with MemoryRouter
- Test components with proper routing context

### Key Testing Patterns
- Match mock module paths exactly with import paths
- Test date display without relying on spy assertions

### Key Testing Patterns
- Use dynamic date formatting in tests to match component behavior
- Test date displays with regex to handle timezone variations

### Key Testing Patterns
- Use data-testid for dynamic content like dates
- Set system time in tests for consistent date testing

### Key Testing Patterns
- Use consistent data-testid values between mocks and tests
- Verify data-testid matches mock component implementation

### Key Testing Patterns
- Match component props exactly with interface definitions
- Remove props not defined in component interfaces

### Key Testing Patterns
- Use consistent data-testids between mocks and component tests
- Verify data-testid values match the mocked component implementation

### Key Testing Patterns
- Ensure component state prerequisites before testing elements
- Test conditional rendering in correct sequence

### Key Testing Patterns
- Test required attribute on form inputs explicitly
- Use toHaveAttribute for HTML attribute testing

### Key Testing Patterns
- Match string literal types exactly in test props
- Use correct enum/union type values in tests

### Key Testing Patterns
- Wrap MUI component tests in act() for state updates
- Use role selectors for MUI form elements

### Key Testing Patterns
- Use correct role selectors for MUI Autocomplete inputs
- Test MUI Autocomplete with combobox role for accessibility
- Match component's actual ARIA roles in tests

### Key Testing Patterns
- Place vi.mock() calls before any imports
- Mock utility functions with default return values

### Key Testing Patterns
- Mock all required utility functions with default values
- Define mock data constants before vi.mock calls

### Key Testing Patterns
- Define mock return values inline within vi.mock
- Avoid external variables in vi.mock factory functions

### Key Testing Patterns
- Wrap components using Redux with Provider and store
- Mock RTK Query API with proper reducer and middleware

### Key Testing Patterns
- Mock API services with minimal implementation
- Provide mock reducerPath and middleware for RTK Query

### Key Testing Patterns
- Define mock API objects before vi.mock for store usage
- Reference mock API in store configuration

### Key Testing Patterns
- Mock Redux middleware with proper function signature
- Return correct middleware chain function structure

### Key Testing Patterns
- Mock all required API endpoints in store setup
- Include all necessary API reducers and middleware

### Key Testing Patterns
- Add type annotations to middleware mock functions
- Use explicit types for middleware chain parameters

### Key Testing Patterns
- Mock RTK Query endpoints with complete hook return values
- Include refetch function in RTK Query hook mocks

### Key Testing Patterns
- Include complete RTK Query API mock implementation
- Add required API utility methods and state management

### Key Testing Patterns
- Mock all required RTK Query hooks in component tests
- Include complete query state for each hook mock

### Key Testing Patterns
- Include injectEndpoints method in RTK Query mocks
- Add query status to hook return values

### Key Testing Patterns
- Configure store with all required API middleware
- Chain multiple middleware using concat correctly

### RTK Query Store Configuration in Tests
- When mocking RTK Query store, ensure middleware configuration matches the actual store setup
- Example:
  ```typescript
  const store = configureStore({
    reducer: {
      [mockApi.reducerPath]: mockApi.reducer
    },
    middleware: getDefaultMiddleware => {
      const middleware = getDefaultMiddleware();
      return middleware.concat([mockApi.middleware]);
    }
  });
  ```

### RTK Query Testing Best Practices
- When mocking RTK Query middleware, ensure proper function chain:
  ```typescript
  middleware: () => (next: any) => (action: any) => next(action)
  ```
- Always pass middleware as array to concat:
  ```typescript
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat([mockApi.middleware])
  ```

### RTK Query Testing Best Practices
- When mocking RTK Query hooks, export both API and individual hooks:
  ```typescript
  vi.mock("../services/api", () => ({
    api: mockApi,
    useMyQuery: vi.fn().mockImplementation(mockApi.endpoints.myQuery.useQuery)
  }));
  ```

### RTK Query Testing Best Practices
- Order of operations is critical when setting up RTK Query tests:
  1. Define mock API
  2. Configure store with middleware
  3. Mock API module
  4. Render components
