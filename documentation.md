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

## Bug Fixes
- Fixed microchipped checkbox in NewReportForm where "I don't know" was checked by default
- Ensure no microchipped options are checked by default for better UX

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

## New Learnings
- Always ensure component props are properly typed and defaulted
- Use proper type assertions for synthetic events when working with Material-UI components
- Use optional props with sensible defaults for component customization
- Maintain backwards compatibility when adding new display options
- Ensure consistent form control heights across all input types including Autocomplete
- Use MUI's size="small" prop consistently for form inputs
