# Pagination Controls

## Overview
`PaginationControls` renders paging navigation shared by listings across the app. Controls now honor dark mode styling and render at both the top and bottom of paginated grids on the public reports index for quicker navigation.

## Styling
- Default state uses `text-gray-600` with hover treatments, while dark mode applies `dark:text-gray-400` for unselected numbers and `dark:text-gray-500` for navigation labels to keep contrast balanced.
- Active page adopts `dark:bg-gray-700 dark:text-gray-100` so the current selection remains legible in dark mode.
- Disabled navigation buttons retain `cursor-not-allowed` and shift to `dark:text-gray-500` to signal unavailable actions.

## Usage Notes
- `PaginationControls` auto-hides when `totalPages` is `<= 1`.
- Place the component above and below long grids to reduce scrolling; the reports index uses this pattern by default.

---

# Dashboard Settings Reset Confirmation

## Overview
Resetting dashboard settings now routes through a confirmation modal, matching the existing dashboard confirmation pattern and preventing accidental preference changes.

## Behavior
- Clicking `Reset to Defaults` opens `ConfirmationModal` with contextual copy and primary/secondary actions.
- Confirming applies the default notification, privacy, and dark-mode values through `updateSettings`.
- The modal reuses the mutation loading state to disable confirm while the request is pending.

---

# Search Panel Light Mode Styling

## Overview
The search slide-out now respects light theme preferences for the keyword input and the remember-preferences toggle.

## Behavior
- `SearchBar` pulls `isDarkMode` to swap text, border, and focus-ring treatments and only applies the dark background when appropriate.
- `RememberFiltersToggle` derives its background, border, and focus styles from the current theme, keeping copy legible in both modes.

---

# Search Panel Filters

## Overview
Slide-out search filters now share the exact select styling used by the New Pet form’s `First Color` dropdown, ensuring identical visuals and interactions in light and dark themes.

## Styling
- All selects import `getDashboardSelectConfig`, which standardizes padding, typography, border radii, and light/dark colors for the input and the options menu.
- Menu popovers inherit the same border, background, hover, and selected-state treatments as the New Pet form, so option lists match one-to-one.
- Placeholder text uses the same muted gray palette, keeping guidance legible without overpowering selected values.

## Usage Notes
- `Filters.jsx` extends the shared `menuProps` with `disableScrollLock` for the slide-out panel while keeping the core styling intact.
- `LocationFilter.jsx` passes the shared config through to state selection, guaranteeing parity across all dropdowns in the search experience.
- Future dashboard-style selects should prefer `getDashboardSelectConfig` instead of duplicating inline style objects.

---

# FormLayout Component Documentation

## Overview
`FormLayout` is a shared component that provides a consistent layout wrapper for form screens (both create and edit flows). It handles the page header with title and action buttons, plus optional footer action buttons.

## Props

### Required
- `title` (string): The page title displayed in the header
- `children` (React.ReactNode): The form content to render

### Optional
- `backButton` (object): Renders a button in the header (legacy usage pattern)
  - `label` (string): Button label text
  - `onClick` (function): Click handler
  - `className` (string): Optional custom styling

- `headerActions` (React.ReactNode | React.ReactNode[]): Optional elements rendered on the right side of the header before any action/back buttons. Useful for environment-only controls like the dev Form Fill button.

- `primaryAction` (object): Primary action button (typically "Save")
  - `label` (React.ReactNode): Button label (can be JSX for dynamic content)
  - `onClick` (function): Click handler
  - `disabled` (boolean): Whether button is disabled
  - `className` (string): Custom styling
  - `type` (string): Button type (default: "button")

- `secondaryAction` (object): Secondary action button (typically "Back")
  - `label` (string): Button label
  - `onClick` (function): Click handler
  - `disabled` (boolean): Whether button is disabled
  - `className` (string): Custom styling
  - `type` (string): Button type (default: "button")

- `formWrapperClassName` (string): Custom wrapper class for form content (default: "w-full mx-auto px-2")

## Behavior

### When primaryAction/secondaryAction are provided:
- Action buttons render in both header and footer
- Buttons are centered and spaced with `gap-2`
- Footer section includes a top border separator
- `headerActions` render (if provided) to the left of the primary/secondary/back buttons, keeping supplemental controls aligned with the header actions.
- Dev-only form populate buttons plug into `headerActions` and only render when `NODE_ENV === "development"` and the current user has `admin: true`.

### When only backButton is provided:
- Single button renders in header (legacy pattern, used for creation flows)
- Maintains backwards compatibility

## Usage Examples

### Creation Flow (Legacy)
```jsx
<FormLayout
  title="New Pet"
  backButton={{
    label: "Back to Pets",
    onClick: handleBack
  }}
>
  <PetNewForm />
</FormLayout>
```

### Edit Flow (New Pattern)
```jsx
<FormLayout
  title="Edit Pet"
  primaryAction={{
    label: isSaving ? "Saving..." : "Save",
    onClick: handleSave,
    disabled: isSaving
  }}
  secondaryAction={{
    label: "Back to Pets",
    onClick: handleBack
  }}
>
  <form className="space-y-6">
    {/* form fields */}
  </form>
</FormLayout>
```

## Current Usage
- `DashboardPets.jsx`: Creation flow with `backButton` and legacy `FormLayout` behavior
- `DashboardReports.jsx`: Creation flow with `backButton` and legacy `FormLayout` behavior
- `PetEditForm.jsx`: Edit flow with `primaryAction` and `secondaryAction`
- `ReportEditForm.jsx`: Edit flow with `primaryAction` and `secondaryAction`

---

## Report Location Initialization in Edit Forms

### Overview
When editing a report, the location map should initialize with the report's existing location data, which is stored as tip events on the report.

### Data Flow
1. **Backend**: `ReportSerializer` includes `lastSeenLocation` which queries the most recent tip event with location data
2. **Frontend**: `useReportEdit.js` hook hydrates the form state with location fields from `report.lastSeenLocation`
3. **Map Component**: `ReportLocationSelect` receives `initialLocation={formData}` with latitude/longitude populated
4. **Rendering**: `ReportMap` initializes with the tip-derived coordinates instead of defaults

### Implementation Details
- `useReportEdit.js` extracts area, state, country, latitude, longitude, and intersection from `report.lastSeenLocation`
- These fields are merged into the `formData` state during initialization and on report updates
- The location data persists throughout the editing session and can be modified via the map or address search
- On save, location changes are handled by `handleLocationSelect` which updates the form state

### Tip Visibility
- The tip in `ReportLocationSelect` only renders when no location has been selected yet. This keeps the guidance visible for first-time entries without duplicating information once a location is present.

### Dashboard Label Styling
- When `ReportLocationSelect` is rendered in dashboard flows, the `Location` label matches the typography and spacing used by adjacent form labels (e.g., `Third Color`) for visual consistency.

### Listing Detail Text Weight
- `ListingDetailsCard` presents report attribute values (name, description, breeds, gender, microchip details) with normal font weight so the emphasis stays on the section labels while the content remains easy to scan.

---

## Conversation Flow & Contact Preference Integration

### Overview
When users click "Start a Conversation" on a report listing, they are now taken directly to the messages dashboard with a new conversation instantiated, rather than displaying an inline form.

### Contact Gating
The "Start a Conversation" button is only displayed if the report owner has enabled contact in their settings (`allow_contact: true`). This preference is exposed through the `ownerAllowContact` field on report payloads.

### Data Flow
1. **Backend**: `ReportSerializer` includes `owner_allow_contact` which reads the report owner's `settings.allow_contact` (defaults to true)
2. **Search Optimization**: `Reports::Search` now eagerly loads user associations to prevent N+1 queries
3. **Conversation Guards**: `Api::ConversationsController` blocks conversation creation if the owner has disabled contact
4. **Frontend**: `TipsSection` checks `report.ownerAllowContact` to conditionally render the button, then invokes `useCreateConversationForReportMutation` and redirects to `/dashboard/messages/<conversationId>`

### Implementation Details
- The button is disabled during mutation and shows "Starting..." feedback
- On success, user is navigated to the new conversation thread
- On error, a notification displays and user remains on the report page
- No inline form is rendered; the `ConversationStartForm` component is no longer used for this flow

### Dark Mode Readability
- The `Conversations` list header applies `dark:text-white` to preserve contrast when users enable dark mode.

---

## Dashboard Loading State Optimization

### Overview
Dashboard components (DashboardPets, DashboardReports, DashboardOverview) have been optimized to skip the full-page spinner entirely and provide instant rendering with cached data for improved user experience.

### Changes Made
1. **Removed Global Loading Spinners**: All three dashboard tabs no longer show overarching loading states
2. **Immediate Rendering**: Components render cached data, item grids, or empty states immediately, even while background fetches run
3. **Cache-First Strategy**: Queries are configured with `refetchOnMountOrArgChange: false` to ensure tab switches use cached data instantly
4. **Form-Specific Loading Preserved**: LoadingState is retained only where form-specific loading cases apply (e.g., loading pet data for report creation in DashboardReports)

### Implementation Details
- `DashboardPets`: Removed conditional rendering based on `isLoading || isPreloading`, renders content immediately
- `DashboardReports`: Removed global loading check, but kept form-specific loading for pet data in report creation
- `DashboardOverview`: Removed loading state check, renders events immediately or empty state
- `useUserPetsData`: Main query now includes `refetchOnMountOrArgChange: false` for instant tab switches
- `useGetUserEventsQuery`: Called with `refetchOnMountOrArgChange: false` in DashboardOverview

### Benefits
- Instant tab switching using cached data
- Better perceived performance with immediate content rendering
- Per-item loaders can still show individual fetch states
- No jarring full-page spinners on navigation

---

## DashboardOverview Dark Mode Styling

### Overview
DashboardOverview component has been updated to properly support dark mode throughout all UI elements.

### Changes Made
- **Heading**: Added `dark:text-gray-100` for proper contrast
- **Empty State**: Updated background (`dark:bg-gray-700`), heading, and description text colors
- **Empty State Icon**: Added `dark:text-gray-500` for proper icon visibility
- **Event Cards**: Added `dark:bg-gray-700` background and `dark:border-gray-600` borders
- **Event Icon Background**: Added `dark:bg-gray-600` for contrast
- **Event Category Text**: Added `dark:text-gray-100` for headings
- **Event Timestamps**: Added `dark:text-gray-400` for secondary text
- **Event Description**: Added `dark:text-gray-300` for body text
- **Event Links**: Added `dark:text-blue-400` and `dark:hover:text-blue-300` for proper link styling
- **Error State**: Updated background (`dark:bg-red-900/30`), heading (`dark:text-red-400`), and description (`dark:text-red-300`)

### Styling Pattern
All color changes follow the dashboard pattern established in DashboardView:
- Light backgrounds use `gray-50` / `gray-100` → `gray-700` in dark mode
- Text hierarchy: `gray-900` → `gray-100` (headings), `gray-600` → `gray-300` (body), `gray-500` → `gray-400` (secondary)
- Accent colors (blue) use lighter shades in dark mode (`blue-400`, `blue-300`)

### Icon Color Dark Mode Updates
- **report_tip icon**: Changed to `dark:text-blue-500` for better visibility in dark mode
- **conversation_started icon**: Changed to `dark:text-blue-500` for better visibility in dark mode
- **report_archived / pet_archived icons**: Changed to `dark:text-gray-300` for higher contrast on dark backgrounds
- **Archived icons alignment**: Applied `transform -translate-x-0.5 translate-y-0.5` to center chevron icons within their circular containers

---

## Dashboard Navigation Responsive Redesign

### Overview
The dashboard navigation has been redesigned to use horizontal tabs on small/medium screens and a vertical sidebar on large screens, providing a better mobile and tablet experience.

### Changes Made
1. **DashboardView.jsx**:
   - Navigation ul changed from `space-y-2` to `flex flex-wrap gap-1 lg:flex-col lg:space-y-2`
   - Each nav button now uses `flex-1 min-w-max lg:w-auto` for responsive sizing
   - Added `whitespace-nowrap lg:whitespace-normal` to prevent text wrapping on small screens
   - Text alignment: `text-center lg:text-left` for tab-style appearance on small screens
   - Increased tab font size on medium screens with `md:text-base` and large screens with `lg:text-base` while retaining compact `text-sm` on smaller viewports
   - Tab labels shortened on small screens (e.g., "My Reports" → "Reports", "My Pets" → "Pets")
   - Unread count badge styled with `dark:bg-blue-700 dark:text-blue-100` for dark mode visibility
   - Messages button uses `flex items-center justify-center lg:justify-between` for proper badge alignment

### Responsive Behavior
- **Small/Medium screens (default)**: Horizontal tabs that wrap if needed, all on one line or less
- **Large screens (lg breakpoint)**: Vertical sidebar layout with full-width text
- Tab text remains centered on small screens, left-aligned on large screens
- All functionality and styling preserved across breakpoints

---

## Global Loading State Dark Mode Support

### Overview
The global loading state components (`Spinner` and `LoadingState`) have been updated to properly support dark mode styling.

### Changes Made

**Spinner.jsx**:
- Background: Updated from `bg-white bg-opacity-75` to `bg-white/75 dark:bg-gray-900/75`
- This ensures the loading overlay uses a white semi-transparent background in light mode and a dark semi-transparent background in dark mode
- Applies when `bgFaded={true}` (the default), showing the overlay when fetching backend data

**LoadingState.jsx**:
- Default className: Updated from `bg-gray-50 rounded-lg p-8 text-center` to `bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center`
- Container background now respects dark mode with `dark:bg-gray-800` for proper contrast

### Result
When navigating between pages (e.g., dashboard → home) with data fetching in progress, the loading spinner now displays with appropriate styling for dark mode, eliminating the white flash and maintaining visual consistency with the rest of the application's dark mode design.

---

## Reports Index Loading UX

### Overview
The public reports index now renders immediately using cached data, removing the global loading spinner that previously blocked the page and produced a white flash in dark mode.

### Changes Made
- `app/src/features/listings/components/ListingContainer.jsx`: Removed the `isLoading` gate and global spinner so the component always renders `ListingsGrid` with whatever data is available from `useReportsData`.

### Result
- Navigating from dashboard views back to the index page no longer triggers a white flash; content persists while background fetches refresh data.
- Aligns the index page with the dashboard loading optimization strategy for a consistent user experience.

---

## About Page Horizontal Scrollbar Fix

### Overview
The About page had two full-width hero sections that were causing an unwanted horizontal scrollbar to appear due to overflow from images extending beyond the viewport.

### Root Cause
The `width: "100vw"` property includes the browser scrollbar width in its calculation. This caused the hero sections to exceed the actual viewport width, creating horizontal overflow. The child sections also used `overflowY: "hidden"`, which only hid vertical overflow and didn't prevent horizontal scrolling.

### Solution
Applied a three-layer overflow clipping strategy:
1. **Root page container** (line 17): Added `overflow: "hidden"` to the main Box wrapping the entire page
   - This ensures any overflow from child elements is clipped at the page level
   - Prevents horizontal scrollbar from appearing regardless of child element widths

2. **Individual sections** (lines 31 and 681): Changed from `overflowY: "hidden"` to `overflow: "hidden"`
   - Top hero section (stray cat image)
   - Bottom hero section (man-with-dog image)
   - This clips overflow on both axes within each section

### Result
The About page now displays without a horizontal scrollbar at any viewport size. The full-width sections render correctly edge-to-edge, and images no longer overhang beyond the page boundaries.

---

## Global Navigation Dark Mode Support

### Overview
The Navbar and Footer components have been updated to properly support dark mode styling.

### Changes Made

**Navbar.jsx**:
- Outer nav: Added `dark:bg-gray-900` for dark background
- Navbar container: Added `dark:bg-gray-900` for consistency
- Hamburger button: Added `dark:text-gray-200` for visibility
- Mobile menu dropdown: Added `dark:bg-gray-800 dark:shadow-lg dark:border dark:border-gray-700` for dark styling
- Mobile menu items: Added `dark:hover:bg-gray-700` for hover states
- Logo/brand link: Added `dark:hover:bg-transparent dark:text-gray-100` to ensure text is visible in dark mode

**Footer.jsx**:
- Container: Added `dark:bg-gray-900` for dark background
- Text content: Added `dark:text-gray-400` to footer text for proper contrast in dark mode

**NavLink.jsx**:
- Added text color styling to baseClasses: `text-gray-700 dark:text-gray-200` for link text visibility
- Added hover state: `hover:text-gray-900 dark:hover:text-gray-900` for interactive feedback in both light and dark modes
- This ensures all navigation links in Navbar and Footer respect dark mode

**ProfileDropdown.jsx**:
- Profile button: Added `dark:hover:bg-gray-700 dark:text-gray-200` for dark mode button styling
- Dropdown menu: Added `dark:bg-gray-800 dark:shadow-lg dark:border dark:border-gray-700` matching mobile hamburger menu
- Menu items: Added `dark:hover:bg-gray-700` for hover states in dark mode

---

## Search Panel Dark Mode Styling

### Overview
The slide-out search experience now mirrors dashboard form styling and responds to dark-mode preferences.

### Changes Made
- **SearchTab.jsx**: Toggle button now has dark-mode states, enhanced focus outlines, and announces its pressed state via `aria-pressed`; the slide-out panel adopts `dark:bg-gray-900` with matching borders.
- **SearchContainer.jsx**: Filters and tip sections sit inside bordered panels that switch to `dark:bg-gray-900` and `dark:bg-gray-800`, and the tips toggle gains dark-friendly typography and focus outlines.
- Tweaked panel backgrounds to use `dark:bg-gray-800` / `dark:bg-gray-700` for a lighter dark-mode tone without losing contrast.
- **SearchBar.jsx / SearchButtons.jsx**: Input fields reuse dashboard focus rings, placeholder contrast, and a visible clear control; primary/reset buttons add dark-mode hover and focus treatments.
- **Filters.jsx / LocationFilter.jsx / RememberFiltersToggle.jsx**: Dropdowns receive theme-aware MUI `sx` styling (palette, focus, and menu paper), clear icons maintain contrast, and the remember-toggle now uses a unified `rgba(29, 29, 29, 1)` background with accessible focus cues.

### Result
Users now see consistent, legible styling throughout the search panel regardless of dark-mode preference, matching dashboard forms.

---

## Runtime Logger Removal

### Overview
All debug and runtime logging statements have been removed from both frontend and backend codebases to produce cleaner production code without logging noise.

### Frontend Changes
Removed all `console.log`, `console.error`, and `console.warn` statements from:
- Map components: TipLocationSelect, MapEvents, ReportMap, ReportLocationSelect, TipMap
- Utility functions: geocoding.js, filterUtils.js, locationUtils.js
- Hooks: useFlyerGeneration.js, useFormSubmission.js
- Components: ErrorBoundary, ProfileDropdown, DashboardProfile, TipForm, ConversationStartForm

All error handling logic was preserved; only logging statements were removed.

### Backend Changes
Removed all `Rails.logger.*` calls from:
- Controllers: EventsController, RegistrationsController
- Services: Reports::Create, Reports::CopyFromPet, Events::Create
- Models: User (settings validation warnings)
- Serializers: EventSerializer
- Migrations: migrate_report_locations_to_tips.rb
- Initializers: searchkick.rb, byebug.rb
- Test configuration: spec/rails_helper.rb, spec/requests/api/sessions_controller_spec.rb

### Result
- Production code is cleaner without debug logging statements
- Reduced console and server log output
- All error handling remains functional; only logging was removed
- Test setup simplified by removing logger configuration

