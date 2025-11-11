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

