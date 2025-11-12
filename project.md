# Project Status

## Completed Tasks

### Search Tab Persistent Green

**Objective**: Ensure the floating "Search" trigger retains brand-consistent styling across themes and open state.

**Changes Made**:

1. **SearchTab.jsx**
   - Replaced conditional gray/green background logic with a fixed `bg-green-600 hover:bg-green-700`
   - Removed dark-mode overrides so the button renders identically in both themes
   - Kept focus outlines (`focus-visible:outline-green-300`) and first-click glow pulse

**Result**:
- Users always see the Search tab in the brand green regardless of theme or whether the panel is open
- Maintains visual consistency and reinforces discoverability of the search experience

---

### Public Report Cards Dark Mode Styling

**Objective**: Ensure report cards on the public listings/home page (ListingCard component) honor dark mode settings, matching dashboard card styling.

**Changes Made**:

1. **ListingCard.jsx** - Updated report card styling to support dark mode:
   - Card container: `bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700` with `hover:shadow-md transition-shadow`
   - Removed redundant `bg-white` from inner wrapper
   - Image placeholder: `bg-gray-100 dark:bg-gray-700`
   - Card title (h2): `text-gray-900 dark:text-gray-100`
   - Breed/metadata (p): `text-gray-600 dark:text-gray-400`
   - Location section background: `text-gray-600 dark:text-gray-400`
   - Location label: `text-gray-800 dark:text-gray-300`

**Pattern Consistency**:
- Matches ItemPreview component used in dashboard (DashboardPets, DashboardReports)
- Uses same dark mode color palette as established dashboard pattern:
  - Container: `dark:bg-gray-800`
  - Borders: `dark:border-gray-700`
  - Loading state: `dark:bg-gray-700`
  - Text: `dark:text-gray-100` (headings), `dark:text-gray-400` (secondary)

**Result**:
- Public report listings now have consistent dark mode styling with dashboard
- Proper contrast and visibility in both light and dark modes
- Users see a cohesive experience across the entire application

---

### Inbox Dark Mode Styling Refinement

**Objective**: Improve the visual distinction and contrast in dark mode for the Inbox/Messages view.

**Changes Made**:

1. **ConversationListItem.jsx** - Updated active conversation styling:
   - Active state: `bg-blue-50 dark:bg-gray-700` (previously `dark:bg-gray-800`)
   - Inactive state: `bg-white dark:bg-gray-800` (unchanged but now consistent)
   - Unread badge: Added dark mode support with `dark:bg-blue-900 text-blue-800 dark:text-blue-200`
   - Added `transition-colors` for smooth theme switching

2. **MessageComposer** - Enhanced textarea and container styling:
   - Container: `bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700`
   - Textarea: `bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600`
   - Added placeholder contrast: `placeholder-gray-500 dark:placeholder-gray-400`
   - Added text color: `text-gray-900 dark:text-gray-100`

3. **ConversationThread** - Updated header and messages container:
   - Header: `bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700` (changed from `bg-gray-50`)
   - Messages container: `bg-gray-50 dark:bg-gray-900` (adjusted for light mode)

4. **MessagesPage** - Updated main layout containers:
   - Conversation list: Added explicit `bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700`
   - Header: `bg-gray-50 dark:bg-gray-900` with `border-b border-gray-200 dark:border-gray-700`
   - Dividers: Changed to `divide-y divide-gray-200 dark:divide-gray-700`
   - Thread container: Added `bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700`
   - Pagination: `bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700`

**Result**:
- Clearer visual hierarchy with better color contrast in dark mode
- Active conversations now pop with `dark:bg-gray-700` while inactive remain at `dark:bg-gray-800`
- Unread badges have proper dark mode contrast
- All containers and dividers now use consistent dark mode palette
- Smooth transitions between light and dark modes

---

### Dashboard Settings Reset Confirmation
- Wrapped the `Reset to Defaults` action in `DashboardSettings.jsx` with a confirmation modal so users must affirm before preferences change.
- Reused the shared `ConfirmationModal` component and mutation loading state to ensure consistent UX with other dashboard confirmations.
- Reset flow now reapplies default notification, privacy, and dark-mode values only after confirmation, keeping accidental clicks from altering saved settings.

### Search Panel Light Mode Styling
- Updated `SearchBar.jsx` to read the active theme, swapping border, text, and focus treatments so the keyword input renders light colors when dark mode is off.
- Refined `RememberFiltersToggle.jsx` to derive its background and focus-ring styling from `isDarkMode`, keeping the toggle and label legible in both themes while preserving the darker panel in dark mode.

### Pagination Controls Dark Mode & Placement
- Updated `PaginationControls.jsx` so non-active page buttons and navigation labels adopt dark-mode color tokens while preserving hover and disabled states.
- Adjusted `ListingsGrid.jsx` to render pagination at both the top and bottom of the reports grid, reducing scroll overhead for users navigating large result sets.

### Search Panel Select Parity
- Extracted `getDashboardSelectConfig` in `shared/commonStyles.js` to encapsulate the New Pet form select styling across themes.
- Updated `PetColorFields.jsx` to consume the shared helper so the New Pet form remains the canonical source of truth.
- Pointed `Filters.jsx` and `LocationFilter.jsx` to the shared config, ensuring slide-out search dropdowns (inputs and menus) visually match the `First Color` control in both light and dark modes.

### Dev Form Populate Button Placement
- Extended `FormLayout.jsx` with a `headerActions` slot so supplemental controls can render alongside back/action buttons without layout hacks.
- Updated `PetNewForm.jsx` and `ReportNewForm.jsx` to register their dev-only populate buttons with the layout (falling back to inline rendering when the slot isn't provided).
- Wired `DashboardPets.jsx` and `DashboardReports.jsx` to pass the header slot down, placing the "Form Fill (Dev Only)" button immediately to the left of each respective back button during creation flows.
- Gated the populate buttons so they only render for admin users in development; added the `admin` flag to `UserSerializer` and leveraged `useAppSelector` checks in the shared button components.

### FormLayout Component Enhancement for Edit Screens
- Extended `FormLayout.jsx` to support edit flows with both save/back button actions
- Added `primaryAction` and `secondaryAction` props to render action buttons in header and footer
- Refactored `PetEditForm.jsx` to use the enhanced `FormLayout` component
- Refactored `ReportEditForm.jsx` to use the enhanced `FormLayout` component
- Preserved backwards compatibility with existing `FormLayout` usage in creation flows (DashboardPets, DashboardReports)

### Changes Made
1. **FormLayout.jsx**: Added support for optional `primaryAction` and `secondaryAction` props. When provided, these render buttons in both header and footer. Maintains original behavior when only `backButton` is provided.
2. **PetEditForm.jsx**: Wrapped form content in `FormLayout`, removed duplicate button rendering logic, and wired existing handlers to new action props.
3. **ReportEditForm.jsx**: Same pattern as PetEditForm, ensuring consistent UI across edit screens.

### Benefits
- Unified form layout pattern across create and edit flows
- Reduced code duplication (removed ActionButtons components)
- Consistent button placement (header and footer) on edit screens
- Easier maintenance and future UI updates

---

### Search Panel Dark Mode Refresh
- Updated `SearchTab.jsx` and `SearchContainer.jsx` so the slide-out panel, toggle button, and tips block adopt dashboard dark-mode colors, borders, and focus outlines (now tuned to slightly lighter `dark:bg-gray-800`/`dark:bg-gray-700` tones).
- Restyled `SearchBar.jsx` and `SearchButtons.jsx` so inputs and actions share dashboard focus rings, placeholder contrast, and dark-mode hover states, plus a visible clear control.
- Reworked `Filters.jsx`, `LocationFilter.jsx`, `FilterWithClear.jsx`, and `RememberFiltersToggle.jsx` to use theme-aware MUI `sx` styling for dropdowns, menus, clear buttons, and a unified `rgba(29, 29, 29, 1)` background for the remember-toggle, ensuring legibility in dark mode.

---

### Report Edit Map Initialization Fix
- Fixed map initialization in the Edit Report form to display the report's existing location from the first associated tip event
- **Issue**: When editing a report, the map was displaying default coordinates instead of the location associated with the report's first tip event
- **Root Cause**: The `ReportSerializer` includes `lastSeenLocation` which derives location data from the report's tip events, but `useReportEdit.js` wasn't extracting these fields into the form state
- **Solution**: Updated `useReportEdit.js` to hydrate the `formData` state with location fields (area, state, country, latitude, longitude, intersection) from `report.lastSeenLocation` if available
- **Result**: The map now correctly initializes with the tip-derived location, and the location fields are properly populated in the form state

### Report Location Tip Visibility
- Updated `ReportLocationSelect` so the location tip displays only when no location has been selected yet, keeping the interface focused once location details are confirmed.

### Report Creation Label Alignment
- Matched the `Location` label styling in the dashboard report form to the surrounding color selectors and linked it to the address input for better accessibility.

### Listing Detail Typography
- Adjusted `ListingDetailsCard` so report attribute values (name, description, breeds, gender, microchip) render with normal font weight while the labels retain emphasis, matching the public report spec.

---

### Conversation Redirect & Contact Preference Integration

**Objective**: Redirect "Start a Conversation" flow directly to the messages dashboard and gate by report owner's contact preference.

**Changes Made**:
1. **ReportSerializer**: Added `owner_allow_contact` attribute that reads from report owner's `settings.allow_contact` (defaults to true)
2. **Reports::Search**: Updated both elasticsearch query methods to eagerly load user associations to prevent N+1 queries
3. **Api::ConversationsController**: Added allow-contact guards in `create_from_report` and `create_from_report_with_message` that block conversation creation if owner has disabled contact
4. **TipsSection**: Completely refactored to:
   - Remove inline `ConversationStartForm` rendering
   - Conditionally render "Start a Conversation" button only when `report.ownerAllowContact` is true
   - Use `useCreateConversationForReportMutation` to create empty conversation
   - Navigate directly to `/dashboard/messages/<conversationId>` on success
   - Provide button loading state and error notifications

**Benefits**:
- Better UX: users go straight to messaging without intermediate form
- Respects user contact preferences: button hidden if owner opted out
- Backend protection: double-check prevents contact if owner disables setting mid-session
- Performance: eager loading prevents N+1 queries on report searches

---

### Messages Dark Mode Contrast
- Updated the `Conversations` list header in `MessagesPage.jsx` to include `dark:text-white`, ensuring the title remains readable against the dark background.

---

### Dashboard Loading State Optimization

**Objective**: Remove global loading states from dashboard tabs to enable instant rendering with cached data for better user experience.

**Changes Made**:
1. **DashboardPets.jsx**:
   - Removed global loading spinner (`isLoading || isPreloading` check)
   - Component now renders cached data, item grids, or empty states immediately
   - Removed unused LoadingState import

2. **DashboardReports.jsx**:
   - Removed global loading spinner in main view
   - Preserved form-specific LoadingState for pet data loading during report creation
   - Component renders cached data or empty states immediately

3. **DashboardOverview.jsx**:
   - Removed loading state check and global spinner
   - Component renders events immediately or shows empty state
   - Removed LoadingState import

4. **useUserPetsData.js**:
   - Added `refetchOnMountOrArgChange: false` to main query
   - Ensures instant tab switches with cached data

5. **DashboardOverview query configuration**:
   - Configured `useGetUserEventsQuery` with `refetchOnMountOrArgChange: false`
   - Prevents unnecessary refetches on tab mount

**Benefits**:
- Instant tab switching: cached data renders immediately
- Improved perceived performance: no full-page spinners
- Better UX: users see content or empty states right away
- Background fetches still update data when needed
- Form-specific loading states preserved where appropriate

---

### DashboardOverview Dark Mode Styling

**Objective**: Enable proper dark mode support throughout the DashboardOverview component to match other dashboard pages.

**Changes Made**:
- Added `dark:text-gray-100` to all headings and primary text
- Updated empty state background to `dark:bg-gray-700`
- Updated event card backgrounds to `dark:bg-gray-700` with `dark:border-gray-600` borders
- Added `dark:bg-gray-600` to icon containers for proper contrast
- Updated secondary text to `dark:text-gray-400` and `dark:text-gray-500`
- Updated body text to `dark:text-gray-300`
- Updated link colors to `dark:text-blue-400` with hover state `dark:hover:text-blue-300`
- Updated error state background to `dark:bg-red-900/30` with `dark:text-red-400` and `dark:text-red-300`

**Styling Pattern**:
- Follows DashboardView established pattern: `gray-50`/`gray-100` backgrounds become `gray-700` in dark mode
- Text hierarchy maintained: headings `dark:text-gray-100`, body `dark:text-gray-300`, secondary `dark:text-gray-400`
- Accent colors use lighter shades in dark mode (`blue-400`, `blue-300`)

**Icon Color Improvements**:
- Blue icons (report_tip, conversation_started) now use `dark:text-blue-500` for better visibility and contrast against dark backgrounds
- Gray archived icons (report_archived, pet_archived) now use `dark:text-gray-300` to stay readable in dark mode
- Archived chevron icons are nudged with `transform -translate-x-0.5 translate-y-0.5` so they appear visually centered inside their circular badges

---

### Dashboard Navigation Responsive Redesign

**Objective**: Improve dashboard UX on small/medium screens by displaying navigation as horizontal tabs instead of a vertical sidebar.

**Changes Made**:
1. **Navigation Container**: Changed from vertical (`space-y-2`) to horizontal wrapping tabs (`flex flex-wrap gap-1`)
2. **Tab Styling**:
   - Each tab uses `flex-1 min-w-max` to allow wrapping while preventing text truncation
   - Added `whitespace-nowrap lg:whitespace-normal` to keep tab text on one line
   - Tab text centered on small screens, left-aligned on large screens
   - Medium screens bump typography to `md:text-base`, large screens to `lg:text-base`, keeping phones at compact `text-sm`
3. **Tab Labels**: Shortened for mobile readability ("My Reports" → "Reports", "My Pets" → "Pets")
4. **Unread Badge**: Updated with `dark:bg-blue-700 dark:text-blue-100` for dark mode compatibility
5. **Responsive Classes**:
   - `lg:flex-col lg:space-y-2` reverts to vertical sidebar on lg+ breakpoints
   - `lg:w-auto` allows sidebar to size naturally on large screens

**Breakpoint Behavior**:
- **Small/Medium (default)**: Horizontal tabs in a flexbox, centered text, wrapped if needed
- **Large (lg)**: Vertical sidebar layout with original styling and 256px fixed width

**Benefits**:
- Better space utilization on tablets and phones
- Cleaner appearance on smaller viewports
- Maintains familiar sidebar layout on desktop

---

### Global Navigation Dark Mode Support

**Objective**: Enable dark mode for top-level Navbar and Footer components.

**Changes Made**:

1. **Navbar.jsx**:
   - Added `dark:bg-gray-900` to nav and navbar containers
   - Hamburger button: `dark:text-gray-200` for icon visibility
   - Mobile dropdown menu: `dark:bg-gray-800 dark:shadow-lg dark:border dark:border-gray-700`
   - Mobile menu items: `dark:hover:bg-gray-700` for hover feedback
   - Brand/logo link: `dark:hover:bg-transparent dark:text-gray-100` to prevent default hover styling in dark mode

2. **Footer.jsx**:
   - Container: `dark:bg-gray-900` for consistent dark background
   - Text: `dark:text-gray-400` for proper contrast and readability

3. **NavLink.jsx**:
   - Added baseClasses styling: `text-gray-700 dark:text-gray-200` for link visibility in both modes
   - Added hover states: `hover:text-gray-900 dark:hover:text-gray-900` for interactive feedback
   - Ensures all navigation links (in Navbar and Footer) respect dark mode

4. **ProfileDropdown.jsx**:
   - Profile button: `dark:hover:bg-gray-700 dark:text-gray-200` for dark mode styling
   - Dropdown menu: `dark:bg-gray-800 dark:shadow-lg dark:border dark:border-gray-700` to match mobile menu
   - Menu items: `dark:hover:bg-gray-700` for consistent hover feedback

**Result**: All navigation components (Navbar, Footer, NavLinks, and ProfileDropdown) now properly adapt to dark mode with appropriate contrast and visibility across all interactive elements and links.

---

### About Page Horizontal Scrollbar Fix

**Objective**: Eliminate unwanted horizontal scrollbar on the About page caused by full-width hero sections overflowing the viewport.

**Root Cause**:
- `width: "100vw"` includes the browser scrollbar width in its calculation
- Hero sections exceeded viewport width when scrollbar was present
- `overflowY: "hidden"` only hid vertical overflow, allowing horizontal scroll to trigger

**Solution**:
Applied layered overflow clipping:
1. **Root container** (line 17): Added `overflow: "hidden"` to main page Box
   - Clips any overflow from child elements at the page level
   - Prevents horizontal scrollbar regardless of child element widths

2. **Individual sections** (lines 31 and 681):
   - Top hero (stray cat): Changed from `overflowY: "hidden"` to `overflow: "hidden"`
   - Bottom hero (man-with-dog): Changed from `overflowY: "hidden"` to `overflow: "hidden"`
   - Clips overflow in both axes within each section

**Result**:
- No horizontal scrollbar at any viewport size
- Full-width hero sections render edge-to-edge cleanly
- Images no longer overhang beyond page boundaries
- Maintained visual appearance of full-bleed hero sections



### Global Loading State Dark Mode Support

**Objective**: Fix the white loading overlay that appears when fetching backend data to respect dark mode enablement.

**Changes Made**:
1. **Spinner.jsx**:
   - Updated background styling from `bg-white bg-opacity-75` to `bg-white/75 dark:bg-gray-900/75`
   - Applies when `bgFaded={true}` (default), which is used for the global page-level loading overlay

2. **LoadingState.jsx**:
   - Updated default className background from `bg-gray-50` to `bg-gray-50 dark:bg-gray-800`
   - Ensures the loading state container respects dark mode

**Result**:
- When navigating from dashboard back to home/index page while reports load, the loading spinner no longer shows a white flash in dark mode
- Loading overlay now displays with dark background (`dark:bg-gray-900`) when dark mode is enabled, matching the rest of the application's color scheme
- Maintains visual consistency and prevents the jarring contrast shift during page transitions with active data fetches

---

### Reports Index Loading UX

**Objective**: Eliminate the global loading flash on the public reports index when navigating from dashboard views.

**Changes Made**:

1. **ListingsContainer.jsx**:
   - Removed the blocking loading state check and page-level spinner
   - Component now renders `ListingsGrid` immediately using cached report data returned by `useReportsData`

**Result**:
- Reports render instantly from cache on the home/index page without a white flash, even in dark mode
- Matches the dashboard loading optimization pattern while allowing background fetches to refresh content

---

### Report Detail Page Dark Mode Support

**Objective**: Ensure the public report detail page (ListingDetailsCard) properly respects user dark mode settings, matching the dashboard report detail view styling.

**Changes Made**:

1. **ListingDetailsCard.jsx** - Refactored to use Tailwind `dark:` prefix utilities instead of conditional classNames:
   - Removed `useTheme` hook dependency (Tailwind handles dark mode detection)
   - Main container: `bg-gray-50 dark:bg-gray-900`
   - Back button: `text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200`
   - Report card: `bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700`
   - Image loading state: `bg-gray-100 dark:bg-gray-900`
   - Headings (Name, Description, Breed, etc.): `text-gray-900 dark:text-gray-100`
   - Field labels: `text-gray-900 dark:text-gray-400`
   - Field values: `text-gray-700 dark:text-gray-100`
   - Archived badge: `bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300`
   - Tips section card: `bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700`
   - Tips list borders: `border-gray-200 dark:border-gray-700`
   - Timestamps: `text-gray-600 dark:text-gray-400`
   - Tip messages/location: `text-gray-700 dark:text-gray-200`
   - Links: `text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300`
   - Expand/collapse buttons: `text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300`
   - LocationDisplay: Updated textStyle to `text-gray-700 dark:text-gray-200`

**Result**:
- Report detail pages now use Tailwind native dark mode classes, matching ReportDetailView (dashboard) pattern
- All UI elements automatically respect user's dark mode preference
- No dependency on theme hook; styling is managed purely through Tailwind utilities
- Consistent styling across public and dashboard report views

### TipsSection and TipForm Dark Mode Support

**Objective**: Ensure tip submission and action panels honor dark mode settings.

**Changes Made**:

1. **TipsSection.jsx** - Updated the "Have Information?" panel with dark mode support:
   - Panel card: `bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700`
   - Heading: `text-gray-900 dark:text-gray-100`
   - Description: `text-gray-600 dark:text-gray-400`
   - "Start a Conversation" button: `bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200`

2. **TipForm.jsx** - Updated the "Submit a Tip" form with comprehensive dark mode support and matching typography:
   - Form card: `bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700`
   - Heading: `text-sm font-medium text-gray-900 dark:text-gray-100 uppercase tracking-wide` (matches Sightings & Tips)
   - Privacy notice box: `bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800`
   - Privacy notice text: `text-sm text-gray-600 dark:text-gray-400` (matches section description)
   - Form labels: `text-sm font-medium text-gray-900 dark:text-gray-100` (matches section styling)
   - Textarea and input fields: `bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400`
   - Input focus states: `focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400`
   - Cancel button: `bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200`
   - Helper and secondary text: `text-sm text-gray-600 dark:text-gray-400` (matches section description)

**Result**:
- All tip-related UI elements now fully support dark mode
- Form inputs have proper contrast and focus states in dark mode
- Privacy notice box styled appropriately for both themes
- Consistent styling with rest of report detail page

### TipLocationSelect Dark Mode Support

**Objective**: Ensure the Location input field in the tip form honors dark mode settings with proper autocomplete styling.

**Changes Made**:

1. **TipLocationSelect.jsx** - Added dark mode support throughout the location selector:
   - Added `useTheme` hook to access `isDarkMode` state
   - Location label: `text-sm font-medium text-gray-900 dark:text-gray-100` "Location:" (matches form label styling)
   - Placeholder text: `text-sm text-gray-600 dark:text-gray-400`
   - Removed the selected-location preview under the label to reduce duplication with the map
   - Address autocomplete matches the New Report form (12px × 14px input padding, 0.375rem radius, dark-friendly adornments, dropdown, and option styling)
   - Synced ReportLocationSelect placeholder colors so "Enter a location" stays readable in dark mode
   - Ensured ReportLocationSelect explicitly sets `placeholder="Enter a location"` so both forms show identical helper copy
   - Created `getAutocompleteInputSx()` function for dynamic MUI styling based on `isDarkMode`
   - Autocomplete input: Dark mode uses `rgb(55 65 81)` background with `rgb(243 244 246)` text
   - Input borders: `rgb(75 85 99)` (dark) / `rgb(209 213 219)` (light)
   - Dropdown menu: `rgb(31 41 55)` background (dark) / `white` (light)
   - Selected options: `rgba(59, 130, 246, 0.3)` (dark) / `rgba(59, 130, 246, 0.12)` (light)
   - All hover and focus states properly styled for both light and dark modes

**Result**:
- Location selection now fully respects dark mode in the "Submit a Tip" form
- Autocomplete dropdown remains readable with proper contrast in all modes
- Consistent dark mode styling across all tip submission form elements

### TipMap Height Optimization

**Objective**: Make the map in the "Submit a Tip" form more compact by reducing its vertical height.

**Changes Made**:

1. **TipMap.jsx** - Map container height update:
   - Changed from `h-[400px]` (fixed height of 400px)
   - Changed to `h-[22.5rem]` (fixed height of 360px / 22.5rem)

**Result**:
- Map takes up less vertical space in the "Submit a Tip" form while remaining visible at all breakpoints
- Better visual balance with other form elements
- Maintains full functionality while being more compact

---

### Runtime Logger Removal

**Objective**: Remove all debug and runtime logging statements from both frontend and backend codebases to clean up production code.

**Changes Made**:

1. **Frontend console logging removal**:
   - Removed all `console.log`, `console.error`, and `console.warn` statements from React components and utilities
   - Affected files include: TipLocationSelect, MapEvents, ReportMap, ReportLocationSelect, TipMap, geocoding utilities, filterUtils, useFlyerGeneration, ErrorBoundary, and various form components
   - Preserved all error handling logic; only removed logging statements

2. **Backend Rails.logger removal**:
   - Removed all `Rails.logger.info`, `Rails.logger.error`, `Rails.logger.warn`, and `Rails.logger.debug` calls from controllers, services, models, serializers, and migrations
   - Affected files include: EventsController, RegistrationsController, Reports::Create, Reports::CopyFromPet, Events::Create, User model, EventSerializer, and migration files
   - Removed logger configuration from test files (spec/rails_helper.rb, spec/requests/api/sessions_controller_spec.rb)
   - Removed logger call from byebug initializer

**Result**:
- Cleaner production code without debug logging noise
- Reduced console output in browser and server logs
- All error handling pathways remain intact; only logging statements were removed
- Test configuration simplified by removing logger setup

---

