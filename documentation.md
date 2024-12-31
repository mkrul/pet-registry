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
+ Split complex form components into view/edit modes for better separation of concerns
+ Extract form action logic into custom hooks for reusability
+ Use existing form section components to maintain consistency
+ Define explicit prop interfaces for form mode components
+ Avoid spreading undefined props to child components
+ Maintain strict typing for event handlers in form components
+ Ensure event handler types are compatible with all child component requirements
+ Handle all potentially null form values consistently across form fields
+ Ensure form field types accurately reflect possible null values from API responses
+ Ensure required form fields are properly marked as nullable or non-nullable based on business logic
+ Align interface types with form validation requirements to maintain data integrity
+ Handle nullable location fields by providing empty string fallbacks in view components
+ Keep navigation logic in the component closest to where it's needed
+ Remove unnecessary component layers when functionality can be handled directly
- When refactoring complex forms, maintain state in the container component
- Keep form mode toggle state at container level for better control flow
- Handle notifications at container level to maintain consistent UX across modes
- Preserve existing notification patterns when splitting components
- Maintain consistent error display patterns across form modes
- Extract complex form state management into custom hooks for better reusability
- Handle form submission results at the container level for consistent UX
- Use proper type safety for form submission results
- Maintain form state in custom hooks to reduce container complexity
- Keep view/edit mode toggle separate from form state management
- Use variant props to handle component size variations while maintaining consistent styling
- Match form control heights exactly when components are used in the same context
- Use descriptive prop names that directly reflect their purpose (e.g., 'height' instead of 'variant')
- Keep component APIs intuitive and self-documenting
- Follow MUI conventions for prop naming (e.g., using 'size' instead of 'height')
- Align component props with established design system patterns
- Ensure consistent prop naming across all component instances
- When updating component APIs, check all usage locations including form field components
- Apply consistent height styling to both Autocomplete and TextField components
- When using MUI compound components, ensure styles are applied at the correct level
- Maintain consistent size props across multiple instances of the same component
- Pay special attention to component variations in compound form fields
+ Ensure all instances of a component within the same form context use consistent size props
+ When adding a new component instance, copy all relevant props from existing instances
+ Disable clear option in form contexts where fields are required
+ Follow MUI's Autocomplete API patterns for consistent behavior
+ Verify field requirements match business rules before marking as required
+ Double-check form field requirements across all form contexts
- Don't send image data in update requests when image hasn't changed
- Filter out read-only fields (createdAt, updatedAt) before sending to API
- Check field types before including in API requests to prevent serialization issues
+ Handle image uploads separately from other form fields
+ Skip serialization of existing image objects in form data
+ Only send image data when a new file is selected
+ Handle case sensitivity for breed and color fields when submitting form data
+ Ensure form field values are properly normalized before submission
+ Ensure field names match between frontend and Rails API (camelCase vs snake_case)
+ Pay special attention to field name conventions when submitting form data
+ Use existing case conversion utilities consistently across the application
+ Check for existing helper functions before implementing new conversion logic
+ Check for both null and undefined when handling form data values
+ Use strict null checks when converting form values to strings
+ When handling dependent form fields, check all possible conflicts before updating values
+ Clear conflicting values immediately to maintain data integrity
+ Consider the hierarchy of form fields when handling conflicts (primary fields take precedence)
+ When handling form field dependencies, maintain a clear hierarchy (color1 > color2 > color3)
+ Handle all possible duplicate scenarios by checking against all other fields
+ Clear dependent fields immediately when a duplicate value is detected
+ When clearing form fields, ensure both the value and visibility states are updated
+ Handle state updates in the correct order: clear conflicting fields before setting new values
+ Consider visibility state when handling form field dependencies
+ Handle form state updates atomically to prevent inconsistent states
+ Use functional state updates to ensure state changes are based on latest values
+ Clear dependent field values in the same state update to maintain consistency
+ Make secondary form fields nullable in TypeScript interfaces to match business requirements
+ Keep primary fields required while allowing null for optional fields
- Make date fields optional in form interfaces when they're not required for creation
- Use proper middleware types in test files to maintain type safety
- Handle nullable user types in test files

## Bug Fixes
- Fixed microchipped checkbox in NewReportForm where "I don't know" was checked by default
- Ensure no microchipped options are checked by default for better UX
- Fixed duplicate function declarations in ReportViewMode component
- Fixed infinite loading spinner in ReportViewMode by properly handling image load state

## Learnings
- When working with tri-state checkboxes (true/false/null), ensure the initial state is properly handled
- Simplify boolean conditions to avoid unexpected behavior with null/undefined checks
- Simplify form fields when binary questions can be replaced with optional inputs
- Use clear placeholder text to indicate optional fields
- Remove unnecessary user interactions when simpler input patterns exist
- Maintain consistent pattern for optional fields across the form (name, microchip ID)
- Use clear, consistent placeholder text patterns for optional fields
- Simplify form by removing unnecessary binary questions when optional inputs suffice
- When removing database columns, ensure to check seed data for removed fields
- Keep seed data in sync with schema changes
- Maintain data consistency by removing deprecated fields from all seed records
- Ensure images are responsive at all breakpoints, especially on mobile devices
- Use w-full with max-width constraints for flexible image sizing
- Consider mobile-first design when implementing image containers
- Set explicit pixel heights for dropdown menus when viewport-relative units are too large
- Consider fixed heights for consistent dropdown experience across devices
- Apply consistent dropdown height constraints across all related select components
- Maintain consistent user experience across similar form elements
- Apply consistent dropdown height constraints across all select components in a form
- Use the same maxHeight value for similar form elements to maintain visual consistency
- Apply consistent dropdown height constraints to all form select components, including gender selects
- Maintain consistent dropdown behavior across all form select elements

## Recent Changes
- Removed `microchipped` column from reports table while maintaining `microchip_id` functionality
- Updated all relevant components and services to remove microchipped field
- Simplified microchip handling to focus only on the ID

## Learning
- When removing database columns, ensure to check all related files including validation and formatting functions
- Pay special attention to form validation logic when removing fields
- Check form display/formatting functions when removing fields
- Maintain consistent button styling across the entire application
- Reuse existing button styles from established components
- Use consistent hover and transition effects across all buttons
- Use consistent icon placement and spacing across action buttons
- Include visual indicators (icons) for primary actions to improve UX
- Apply consistent disabled button styling across all form actions
- Use cursor-not-allowed to indicate disabled state
- Maintain visual hierarchy with lighter colors for disabled states
- Apply consistent disabled styling to all form buttons, including primary actions
- Use lighter color variants for disabled primary buttons to maintain visual hierarchy

## Component Updates
- BreedSearch component updated to properly handle required and disabled states
- Fixed type safety issues with breed selection handling
- Added hideLabel prop to BreedSearch component for flexible label display
- Standardized BreedSearch input height to match other form controls
- Updated BreedSearch size to 'medium' in IdentificationFields to maintain consistent sizing across new and edit forms

## New Learnings
- Always ensure component props are properly typed and defaulted
- Use proper type assertions for synthetic events when working with Material-UI components
- Use optional props with sensible defaults for component customization
- Maintain backwards compatibility when adding new display options
- Ensure consistent form control heights across all input types including Autocomplete
- Use MUI's size="small" prop consistently for form inputs

## UI Updates
- Report view mode now displays the title as a heading (h2) without a label for better visual hierarchy
- Added colons to field labels in ReportViewMode for improved readability and consistency
- Added colons to field labels in ReportEditMode to match ReportViewMode styling
- Added loading spinner while image loads in ReportViewMode for better user feedback
- Added proper disabled state styling to Save and Cancel buttons during form submission
- Added location display to report cards for better geographical context
- Moved "Updated" badge to overlay report card images for better visual hierarchy
- Enhanced "Updated" status with green border around image and bottom-right indicator
- Enhanced "Updated" status visual treatment with thicker border and rounded corners
- Adjusted "Updated" indicator size and positioning for better visibility and alignment
- Enhanced "Updated" indicator text weight and size for better readability
- Refined "Updated" indicator corner radius and font weight for better visual balance
- Fine-tuned "Updated" indicator padding for better visual alignment with image
- Added subtle visual separation between report card metadata and description
- Enhanced report card divider visibility for clearer content separation
- Added responsive layout for report cards on mobile screens (<480px)
- Optimized image display for mobile viewing with adjusted height and full width
- Fixed report card image dimensions to maintain consistent sizing across viewport changes
- Enhanced report card responsive layout for small screens (<640px)
- Adjusted report card image height to 18rem for small screens while maintaining desktop layout

## Map Component Updates
- Fixed map initialization to properly use provided coordinates
- Added marker to show location on map
- Default center remains at US center coordinates when no location provided
- Standardized zoom level (15) across view and edit modes for consistent user experience
- Fixed map zoom level prop name in edit mode to match view mode (VIEW_ZOOM_LEVEL)
- Fixed zoom level prop type definition in ReportEditModeProps interface
- Fixed default zoom level in Map component to match view mode (15)
- Set different default zoom levels for new reports (4) vs existing reports (15)
