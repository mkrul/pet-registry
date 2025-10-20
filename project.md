# Project Tracking

## Completed Tasks

### 2025-10-12: Added comprehensive logging for pet registration flow
- **Purpose**: To diagnose error notifications occurring during pet registration submissions
- **Solution**: Added detailed console logging throughout the entire frontend submission flow and enhanced backend Rails logging with clear markers and error details
- **Frontend logging added to**:
  - `usePetFormSubmission.js`: Logs submission start, form data, selected image, response handling, navigation decisions, and errors
  - `usePetSubmit.js`: Logs FormData creation, mutation calls, response handling, validation errors, and success notifications
  - `petFormData.js`: Logs input data, data transformation, field appending, and image details
  - `petsApi.js`: Logs API request initiation, raw server responses, response transformations, and final results
- **Backend logging enhanced in**:
  - `PetsController#create`: Added clear section markers, raw params inspection, current user details, success responses, validation errors with details, and full exception handling with backtraces
  - `Pets::Create` service: Added detailed input inspection (including image presence/class), is_altered conversion tracking, pet instantiation details, validation checks before save, save failures with error details, and exception handling
- **Files Modified**:
  - `app/src/shared/hooks/usePetFormSubmission.js`
  - `app/src/shared/hooks/usePetSubmit.js`
  - `app/src/shared/utils/petFormData.js`
  - `app/src/store/features/pets/petsApi.js`
  - `app/controllers/api/pets_controller.rb`
  - `app/services/pets/create.rb`

### 2025-10-12: Fixed RadioGroup null value warning
- **Issue**: Warning appeared in console when visiting "Register new pet" page: "Warning: `value` prop on `input` should not be null"
- **Root Cause**: The RadioGroup for "Is the pet spayed or neutered?" was using `null` as a value for the "I don't know" option, and the `isAltered` field was initialized to `null`. React doesn't accept `null` as a valid value for controlled inputs
- **Solution**: Updated RadioGroup to convert `null` to empty string for display (`formData.isAltered === null ? "" : String(formData.isAltered)`), changed radio button values from `true/false/null` to `"true"/"false"/""``, and preserved the data model by converting string values back to boolean/null in onChange handler
- **Files Modified**:
  - `app/src/features/pets/components/common/PetIdentificationFields.jsx`

### 2025-10-12: Added filter state to dashboard URLs
- **Issue**: Filter state (e.g., "Dogs", "Cats", "Archived" on pets; "Archived" on reports) was not reflected in URLs, making it impossible to bookmark or share filtered views, and causing filter state loss on refresh
- **Root Cause**: Filter changes only updated local state without updating the URL query parameters
- **Solution**:
  - Updated both `DashboardPets` and `DashboardReports` to persist filter state in URL query parameters
  - Filters now appear as `?filter=dog`, `?filter=archived`, etc.
  - Filter state is preserved across navigation (e.g., viewing a report detail maintains the active filter)
  - URLs properly restore filter state on page load or refresh
  - Default filters ("all" for pets, "active" for reports) are not added to the URL to keep URLs clean
- **Files Modified**:
  - `app/src/features/dashboard/components/DashboardPets.jsx`
  - `app/src/features/dashboard/components/DashboardReports.jsx`

### 2025-10-12: Made dashboard action URLs consistent
- **Issue**: Inconsistent URL patterns - "Register new pet" showed `/dashboard/pets` while "Create new report" showed `/dashboard/reports?action=create`
- **Root Cause**: `DashboardPets` was only updating local state when creating a pet, while `DashboardReports` was properly updating the URL with query parameters
- **Solution**: Updated `DashboardPets` to match `DashboardReports` behavior by navigating to `/dashboard/pets?action=create` when creating a pet, and added useEffect to sync state with URL query parameters
- **Files Modified**:
  - `app/src/features/dashboard/components/DashboardPets.jsx`

### 2025-10-12: Implemented nested routing for dashboard sections
- **Issue**: Dashboard URLs did not reflect the current section - all sections showed `/dashboard` in the URL bar instead of specific paths like `/dashboard/reports` or `/dashboard/pets`
- **Root Cause**: Dashboard was using a single route with query parameters (`?section=reports`) for internal navigation instead of proper nested routes
- **Solution**:
  - Converted dashboard to use nested routes: `/dashboard/overview`, `/dashboard/reports`, `/dashboard/pets`, `/dashboard/profile`, `/dashboard/settings`
  - Updated `DashboardView` to use URL path instead of query parameters for determining active section
  - Updated all navigation calls throughout the app to use new URL structure
  - Maintained backward compatibility for query parameters like `?action=create&reportId=123` which continue to work alongside the new path structure
- **Files Modified**:
  - `app/src/app/AppRouter.jsx`
  - `app/src/features/dashboard/pages/DashboardView.jsx`
  - `app/src/features/dashboard/components/DashboardReports.jsx`
  - `app/src/features/dashboard/components/DashboardPets.jsx`
  - `app/src/shared/hooks/usePetFormSubmission.js`
  - `app/src/shared/hooks/useFormSubmission.js`
  - `app/src/shared/components/common/Navbar.jsx`
  - `app/src/shared/components/common/Footer.jsx`

### 2025-10-12: Added populate form button for pet registration
- **Issue**: Pet registration form lacked a dev-only feature to quickly populate the form with test data
- **Solution**: Created `PetFormPopulateButton` component that auto-fills the form with cat data (using public/images/cat.png) including name "Whiskers", species "Cat", breed "Domestic Shorthair", colors "Orange" and "White", and a randomly generated microchip ID. The button only renders in development environment
- **Files Modified**:
  - `app/src/shared/components/common/PetFormPopulateButton.jsx` (created)
  - `app/src/features/pets/components/forms/PetNewForm.jsx`

### 2025-10-12: Added loading spinner for report images
- **Issue**: While report images were loading on the "My Reports" page, only the title text was visible with no whitespace or loading indicator, and the image container was collapsing
- **Solution**: Updated `ItemPreview` component to use padding-bottom technique (pb-[100%]) to maintain a square aspect ratio container that never collapses. Added loading state tracking to display a centered spinner with gray background while images load. The image is absolutely positioned and fades in smoothly once loaded
- **Files Modified**:
  - `app/src/shared/components/common/ItemPreview.jsx`

### 2025-10-12: Disabled map interaction during report submission
- **Issue**: Users could interact with the map while a report was being submitted or while processing address data
- **Solution**: Updated `LocationSelect` to pass `readOnly={isDisabled}` to the `Map` component, which disables map clicks when `isLoading` or `isProcessingAddress` is true
- **Files Modified**:
  - `app/src/features/listings/components/common/LocationSelect.jsx`

### 2025-10-12: Changed grid layout to 4-column maximum
- **Issue**: The dashboard grids (Reports and Pets) displayed items 6-across on large screens, which was too wide
- **Solution**: Updated the `ItemGrid` component default className to limit the grid to a maximum of 4 columns (responsive: 2 on mobile, 3 on small screens, 4 on medium and larger)
- **Files Modified**:
  - `app/src/shared/components/common/ItemGrid.jsx`

### 2025-10-12: Fixed report detail view URL persistence
- **Issue**: When viewing a single report and performing a hard refresh, the page loaded back to the "My Reports" list view instead of staying on the report detail
- **Root Cause**: Clicking a report only updated local state without updating the URL with the `reportId` parameter, so hard refresh had no URL state to restore from
- **Solution**:
  - Added `handleSelectReport` to update both state and URL when selecting a report
  - Added `handleDeselectReport` to clear state and URL when going back
  - Updated all report selection/deselection points to use these handlers
  - Fixed the `reportId` useEffect to properly restore selected report from URL on page load
- **Files Modified**:
  - `app/src/features/dashboard/components/DashboardReports.jsx`

### 2025-10-12: Fixed report edit refresh issue
- **Issue**: After editing a report, the detail view showed stale data until hard refresh
- **Root Cause**: The `selectedReport` state contained a snapshot of the old report data and wasn't updated after the edit mutation completed
- **Solution**:
  - Modified `handleEditSaveSuccess` to accept the updated report data as a parameter
  - Updated `ReportEditView` to pass the mutation response to the success callback
  - Modified `useReportEdit` to transform and return the updated report data from the mutation response
  - The `selectedReport` state is now updated with fresh data immediately after save
- **Files Modified**:
  - `app/src/features/dashboard/components/DashboardReports.jsx`
  - `app/src/features/reports/forms/ReportEditView.jsx`
  - `app/src/shared/hooks/useReportEdit.js`

### 2025-10-12: Fixed report archive redirect behavior
- **Issue**: After archiving a report from the detail view, users remained on the archived report's detail page instead of being redirected to the main "My Reports" view
- **Solution**: Updated `handleConfirmArchive` in `DashboardReports.jsx` to clear `selectedReport` state and navigate to `/dashboard?section=reports` after successful archive
- **Files Modified**:
  - `app/src/features/dashboard/components/DashboardReports.jsx`

### 2025-10-14: Fixed pet data pre-population in report creation form
- **Issue**: When clicking "Create a lost pet report" for a pet, the report form was not pre-populated with pet data even though the mapping logic existed
- **Root Cause**: The form was rendering before pet data finished loading. The `useReportForm` hook initialized with `undefined` initialData, and didn't update when pet data arrived
- **Solution**: Added loading state check in `DashboardReports.jsx` - when creating a report from a pet (`petId` is present), the form now waits for pet data to load before rendering. A loading spinner is displayed while fetching pet data
- **Pre-population Mapping**: Pet fields map to report fields as follows:
  - `name` → `name`
  - `microchipId` → `microchipId`
  - `species` → `species`
  - `breed1` → `breed1`
  - `breed2` → `breed2`
  - `gender` → `gender`
  - `isAltered` → `isAltered`
  - `color1` → `color1`
  - `color2` → `color2`
  - `color3` → `color3`
  - `image` → `image` (including all image URLs)
- **Files Modified**:
  - `app/src/features/dashboard/components/DashboardReports.jsx`

### 2025-10-14: Fixed map street tiles not displaying
- **Issue**: Maps were not displaying street tiles, only showing location markers (orangeish triangles with house numbers). This issue was particularly noticeable when creating a report via "Create a lost pet report" button
- **Root Cause**: Multiple URL typos throughout the codebase - used `https:/` instead of `https://` (missing one slash) - affecting both map tiles and geocoding/location services (OpenStreetMap Nominatim API and Overpass API)
- **Solution**: Corrected all URL typos across multiple files:
  - Map tiles: Fixed TileLayer URL and attribution link in Map component
  - Address search: Fixed Nominatim search API URL in LocationSelect component
  - Geocoding services: Fixed all Nominatim reverse geocoding URLs in locationUtils.js and geocoding.js (7 instances total)
  - Overpass API: Fixed street intersection lookup URLs in locationUtils.js and geocoding.js (4 instances total)
- **Files Modified**:
  - `app/src/shared/components/common/Map.jsx`
  - `app/src/features/listings/components/common/LocationSelect.jsx`
  - `app/src/shared/utils/locationUtils.js`
  - `app/src/shared/geocoding.js`

### 2025-10-14: Fixed pet image copy error in Reports::CopyFromPet
- **Issue**: Error "Failed to copy pet image: undefined local variable or method `report'" when creating a report from a pet
- **Root Cause**: Typo in the error handling code - referenced undefined variable `report` instead of `new_report`
- **Solution**: Changed `errors.merge!(report.errors)` to `errors.merge!(new_report.errors)` on line 22
- **Files Modified**:
  - `app/services/reports/copy_from_pet.rb`

### 2025-10-14: Fixed notification not displaying when deleting report from pet detail view
- **Issue**: When deleting a lost pet report via the "Delete Report" button from the pet detail view, the success notification "Report deleted successfully. Pet status updated to home" was not displaying as a toast
- **Root Cause**: The Notification component was only rendered when viewing the pets list, not when viewing a specific pet's detail. When `selectedPet` was truthy, the notification component wasn't included in the rendered output
- **Solution**: Moved the Notification component into each conditional rendering branch (pet detail view, pets list, and empty state) so it displays regardless of which view is active. Wrapped each branch in a React fragment to group the notification with the view content
- **Files Modified**:
  - `app/src/features/dashboard/components/DashboardPets.jsx`

### 2025-10-14: Fixed pet status not updating to "missing" after creating a report
- **Issue**: After creating a report for a pet, the status pill on the pet didn't display "missing" until a hard page refresh
- **Root Cause**: The `Pets::Fetch` service query wasn't eager-loading the `report` association. When the PetSerializer computed the status by checking `object.missing?` (which calls `report.present? && report.active?`), it would use stale cached data or trigger N+1 queries, resulting in incorrect status computation
- **Solution**: Added `.includes(:report)` to the pets query in both the archived and active branches of `Pets::Fetch` service, ensuring the report association is eager-loaded and the status is computed correctly from fresh database data
- **Files Modified**:
  - `app/services/pets/fetch.rb`

### 2025-10-14: Fixed "Report deleted successfully" notification not displaying
- **Issue**: When deleting a report via the "🎉 My pet was found! Delete this report." button from pet detail view, the success notification was not displayed as a toast
- **Root Cause**: The `handleDeleteReport` function was calling `await refetch()` after deleting the report, which set `isLoading` to true and caused the pet detail view (including the notification component) to unmount and be replaced with a loading spinner. The notification was set after the refetch completed, but the unmount/remount cycle prevented it from displaying properly
- **Solution**: Removed the explicit `refetch()` call from `handleDeleteReport`. The `deleteReport` mutation already invalidates the Pets cache tags, which triggers RTK Query's automatic refetch without setting `isLoading` to true. This allows the notification to display immediately while the data updates in the background
- **Files Modified**:
  - `app/src/features/dashboard/components/DashboardPets.jsx`

### 2025-10-14: Converted all notifications to use toast notification system
- **Issue**: The app had two notification systems running in parallel - toast notifications (using `addNotification` and displayed via `ToastManager`) and static notifications (using `setNotification` and displayed via local `Notification` component). Static notifications were not displaying properly throughout the app
- **Root Cause**: Many components and hooks were still using the old `setNotification` action which sets `state.notification` (singular) instead of `addNotification` which adds to `state.notifications` (plural). The `ToastManager` only reads from `state.notifications`, so notifications set with `setNotification` were never displayed as toasts
- **Solution**:
  - Converted all uses of `setNotification` to `addNotification` throughout the app
  - Removed static `Notification` component usage from components and replaced with toast notifications
  - Deleted obsolete notification cleanup hooks (`useNotificationCleanup.js` and `useAutoClearNotifications.js`)
  - Removed unused notification props from `FormLayout` component
  - Removed redundant error notification from `ListingContainer` (errors are now handled by toast notifications in `useReportsData`)
  - Removed `apiNotification` handling from dashboard components as notifications are now dispatched directly from hooks
- **Files Modified**:
  - `app/src/features/dashboard/pages/DashboardView.jsx` - Removed `setNotification(null)` call
  - `app/src/shared/hooks/useUserReportsData.js` - Converted to use `addNotification`, removed local notification state
  - `app/src/features/listings/pages/ListingShowView.jsx` - Changed `setNotification` to `addNotification`
  - `app/src/store/features/auth/authApiSlice.js` - Changed `setNotification` to `addNotification`
  - `app/src/shared/hooks/useUserPetsData.js` - Converted to use `addNotification`, removed local notification state
  - `app/src/shared/hooks/useReportsData.js` - Converted to use `addNotification`, removed local notification state
  - `app/src/shared/components/common/MapContainer.jsx` - Converted to dispatch toast notifications instead of using local static notifications
  - `app/src/features/auth/pages/SignUpPage.jsx` - Converted to use toast notifications, removed local notification state
  - `app/src/shared/components/common/FormLayout.jsx` - Removed unused notification props
  - `app/src/features/listings/components/ListingContainer.jsx` - Removed redundant error notification display
  - `app/src/features/dashboard/components/DashboardPets.jsx` - Removed apiNotification handling
  - `app/src/features/dashboard/components/DashboardReports.jsx` - Removed apiNotification handling
- **Files Deleted**:
  - `app/src/shared/hooks/useNotificationCleanup.js`
  - `app/src/shared/hooks/useAutoClearNotifications.js`

### 2025-10-15: Fixed 422 error when editing reports
- **Issue**: Report edit operations were failing with a 422 Unprocessable Content error. The frontend was successfully submitting the form data, but the backend was rejecting the request
- **Root Cause**: The `Reports::Update` service was missing the `status` parameter definition. When the frontend sent the status field (which was permitted in the controller's `report_params`), ActiveInteraction rejected it as an invalid input parameter, causing the service outcome to be marked as invalid
- **Solution**: Added `string :status, default: nil` to the input parameters in the `Reports::Update` service, and added `status: status` to the `update_report_attributes` method to include the status field in the update operation
- **Files Modified**:
  - `app/services/reports/update.rb`

### 2025-10-15: Fixed pet status not updating when creating/deleting reports
- **Issue**: After marking a pet as missing (creating a report), the Pet Detail View and Pet Preview still showed status as "Home" and displayed the "My pet is missing! Create a new report" button instead of showing "Missing" status and the "My pet was found! Delete this report" button
- **Root Cause**: When creating a report from a pet, the `Reports::CopyFromPet` service only updated the `report_id` on the pet but didn't update the pet's status to 'missing'. Additionally, when reports were destroyed or archived, the pet status wasn't being reset to 'home'
- **Solution**:
  - Updated `Reports::CopyFromPet` service to set pet status to 'missing' when associating a pet with a report
  - Added callback to Pet model to automatically update status when `report_id` changes (sets to 'missing' when report_id is present, 'home' when null)
  - Updated Report model callbacks to set pet status back to 'home' when report is destroyed or archived
- **Files Modified**:
  - `app/services/reports/copy_from_pet.rb`
  - `app/models/pet.rb`
  - `app/models/report.rb`

### 2025-10-15: Fixed pet status not updating immediately in UI after creating reports
- **Issue**: After marking a pet as missing (creating a report), the Pet Detail View and Pet Preview didn't show the updated "Missing" status until a hard page refresh, even though the backend was correctly updating the pet status
- **Root Cause**: The `submitReport` mutation in RTK Query was only invalidating general pet list cache tags (`{ type: "Pets", id: "LIST" }` and `{ type: "Pets", id: "USER_LIST" }`) but not the specific pet's individual tag (`{ type: "Pets", id: petId }`). This meant the individual pet data in the cache wasn't being invalidated and refetched
- **Solution**: Updated the `submitReport` mutation's `invalidatesTags` to be a function that dynamically checks if a `petId` was provided in the form data. When `petId` is present, it now also invalidates the specific pet's individual tag, ensuring immediate cache invalidation and UI updates
- **Files Modified**:
  - `app/src/store/features/reports/reportsApi.js`

### 2025-10-15: Removed all debugging-related console.log and Rails.logger calls
- **Purpose**: Clean up the codebase by removing all debugging statements that were added for troubleshooting pet registration flow
- **Solution**: Systematically removed all debugging statements from:
  - **Frontend**: No console.log statements were found (already clean)
  - **Backend**: Removed Rails.logger debugging statements from:
    - `PetsController#create`: Removed detailed logging of params, user info, success/error states, and exception handling
    - `Pets::Create` service: Removed logging of input inspection, image details, validation checks, save operations, and error handling
    - `ReportsController#create`: Removed validation error logging
    - `Reports::Search` service: Removed 15 debug statements covering query processing, filter building, species/gender detection, and Elasticsearch operations
    - `Reports::Create` service: Removed input logging, save operation logging, and error logging
    - `SessionsController`: Removed session clearing logging and error logging
- **Preserved**: Legitimate configuration logging in initializers and test setup logging in spec files
- **Files Modified**:
  - `app/controllers/api/pets_controller.rb`
  - `app/services/pets/create.rb`
  - `app/controllers/api/reports_controller.rb`
  - `app/services/reports/search.rb`
  - `app/services/reports/create.rb`
  - `app/controllers/api/sessions_controller.rb`

### 2025-10-15: Implemented form disabling during location processing
- **Issue**: When creating or editing reports, users could interact with other form fields while OpenStreetMap was processing location requests (clicking map or entering address), potentially causing data inconsistency or user confusion
- **Solution**: Implemented comprehensive form disabling mechanism that prevents interaction with all form components during location processing:
  - **LocationSelect Component**: Added `onProcessingStateChange` callback prop to notify parent components when location processing starts/stops
  - **ReportNewView**: Added `isProcessingLocation` state that combines with `isLoading` to create `isFormDisabled` state
  - **ReportEditView**: Added `isProcessingLocation` state that combines with `isSaving` to create `isFormDisabled` state
  - **Form Components**: Updated all form components to respect the combined disabled state:
    - `BasicInfoFields`: Uses `readOnly={isFormDisabled}` for all text inputs
    - `IdentificationFields`: Uses `isLoading={isFormDisabled}` for all form controls
    - `ColorFields`: Uses `isLoading={isFormDisabled}` for all color selectors
    - `ImageUpload`: Uses `disabled={isFormDisabled}` for file input and upload button
- **User Experience**: Users can no longer interact with form fields while location data is being processed, preventing data conflicts and providing clear visual feedback that the system is working
- **Files Modified**:
  - `app/src/features/listings/components/common/LocationSelect.jsx`
  - `app/src/features/reports/forms/ReportNewView.jsx`
  - `app/src/features/reports/forms/ReportEditView.jsx`

### 2025-10-15: Fixed form disabling for map click location processing
- **Issue**: Form disabling only worked when entering an address in the location input bar, but not when clicking on the map to drop a pin. Users could still interact with form fields while the map was processing location data from clicks
- **Root Cause**: The `MapEvents` component had its own `isProcessing` state for map clicks, but this state wasn't communicated back to the `LocationSelect` component, so the form remained enabled during map click processing
- **Solution**: Extended the processing state communication chain to include map click processing:
  - **MapEvents Component**: Added `onProcessingStateChange` prop to communicate processing state to parent
  - **Map Component**: Added `onProcessingStateChange` prop to pass through to MapEvents
  - **LocationSelect Component**: Added `isProcessingMap` state and `handleMapProcessingStateChange` handler to track map processing state
  - **Combined Processing State**: Updated `isDisabled` to include both `isProcessingAddress` and `isProcessingMap`
  - **Parent Notification**: Updated the effect to notify parent components when either processing state changes
  - **Visual Feedback**: Updated spinner overlay to show during both address and map processing
- **User Experience**: Now both address input and map click processing disable the entire form consistently, providing uniform behavior regardless of how the user selects a location
- **Files Modified**:
  - `app/src/shared/components/common/MapEvents.jsx`
  - `app/src/shared/components/common/Map.jsx`
  - `app/src/features/listings/components/common/LocationSelect.jsx`

### 2025-10-15: Fixed radio group disabling during location processing
- **Issue**: The "Is the animal spayed or neutered?" radio group was not being disabled during location processing, allowing users to change the selection while the map was processing location data
- **Root Cause**: The `RadioGroup` component in `IdentificationFields` was missing the `disabled` prop, and the individual `Radio` components within `FormControlLabel` were also not disabled
- **Solution**: Added proper disabled state to the radio group:
  - **RadioGroup**: Added `disabled={isLoading}` prop to disable the entire group
  - **Individual Radio Components**: Added `disabled={isLoading}` prop to each `Radio` component within `FormControlLabel`
- **User Experience**: Users can no longer change the spay/neuter status while location processing is active, maintaining consistent form disabling behavior across all form elements
- **Files Modified**:
  - `app/src/features/listings/components/common/IdentificationFields.jsx`

### 2025-10-15: Fixed navigation after deleting report from pet detail view
- **Issue**: When clicking "My pet was found! Delete this report" from a pet detail view, users remained on the pet detail view instead of being redirected back to the "My Pets" list
- **Root Cause**: The `handleDeleteReport` function in `DashboardPets` only deleted the report and showed a success notification, but didn't clear the `selectedPet` state or navigate back to the pets list
- **Solution**: Updated `handleDeleteReport` to navigate back to the pets list after successful report deletion:
  - **Clear Selected Pet**: Added `setSelectedPet(null)` to clear the selected pet state
  - **Navigate to Pets List**: Added `navigate('/dashboard/pets')` to redirect users back to the pets list
  - **Maintain Success Flow**: Kept the success notification to inform users that the report was deleted and pet status was updated
- **User Experience**: Users are now automatically redirected to the "My Pets" list after successfully deleting a report, providing a smooth workflow when marking a pet as found
- **Files Modified**:
  - `app/src/features/dashboard/components/DashboardPets.jsx`

### 2025-10-15: Fixed pet status not updating after creating or deleting report
- **Issue**: Pet status pill wasn't updating immediately after report operations:
  - When clicking "My pet is missing!" and creating a report, the status remained "Home" instead of updating to "Missing"
  - When clicking "My pet was found! Delete this report", the status remained "Missing" instead of updating to "Home"
  - Both required a hard page refresh to show the correct status
- **Root Cause**: While the mutations properly invalidated the Pets cache tags, the `DashboardPets` component wasn't refetching the pet data after these operations, causing stale data to be displayed
- **Solution**: Added manual refetch mechanisms to ensure fresh pet data:
  - **Direct Query Access**: Added `useGetUserPetsQuery` import to get direct access to the refetch function
  - **Component Mount Refetch**: Added `refetchPets()` call in useEffect to refetch pet data when the component mounts (handles navigation back from report creation)
  - **Delete Report Refetch**: Added `await refetchPets()` in `handleDeleteReport` before navigation to ensure fresh data is loaded
  - **Cache Invalidation**: Maintained existing cache invalidation in mutations for automatic updates
- **User Experience**: Pet status now updates immediately after both creating and deleting reports, showing the correct status ("Missing" or "Home") without requiring a hard refresh
- **Files Modified**:
  - `app/src/features/dashboard/components/DashboardPets.jsx`

### 2025-10-15: Fixed variable declaration order error in ReportEditView
- **Issue**: When clicking the edit button (pencil and paper icon) to edit a report, the application crashed with error: "ReferenceError: can't access lexical declaration 'isSaving' before initialization"
- **Root Cause**: The `isFormDisabled` variable was declared before the `useReportEdit` hook that provides the `isSaving` variable it depends on, causing a temporal dead zone error
- **Solution**: Moved the `isFormDisabled` declaration to after the `useReportEdit` hook call, ensuring all dependencies are available before use
- **User Experience**: Users can now successfully click the edit button to edit reports without encountering a crash
- **Files Modified**:
  - `app/src/features/reports/forms/ReportEditView.jsx`

### 2025-10-15: Improved UX for deleting report from pet detail view
- **Issue**: When clicking "My pet was found! Delete this report" from the pet detail view, users were navigated back to the pets list, requiring them to click on their pet again to see the updated status
- **Solution**: Updated the delete report flow to keep users on the pet detail view with visual feedback:
  - **Stay on Detail View**: Removed navigation from `handleDeleteReport` - users remain on the pet detail view
  - **Visual Success Feedback**: Added green pulse animation on the pet detail card for 1 second after successful report deletion
  - **Pulse Animation**: The card border changes to green (`border-green-500`) with a green shadow (`shadow-green-500/50`) and pulses using Tailwind's `animate-pulse` class
  - **Auto-dismiss**: Pulse animation automatically disappears after 1 second
  - **Updated Status**: Pet status updates immediately from "Missing" to "Home" with the refreshed data
- **User Experience**: Users can now see the immediate result of marking their pet as found without losing context, with clear visual feedback that the operation succeeded
- **Files Modified**:
  - `app/src/features/dashboard/components/DashboardPets.jsx`
  - `app/src/features/pets/components/PetDetailView.jsx`

### 2025-10-15: Added scroll-to-top behavior for all dashboard pages
- **Issue**: When users perform actions that redirect them to different dashboard pages, they sometimes arrive at a scrolled position instead of at the top of the page, creating a disorienting experience
- **Solution**: Added comprehensive scroll-to-top behavior across all dashboard components:
  - **DashboardView**: Added scroll-to-top on section changes and component mount to handle tab navigation and direct URL access
  - **DashboardPets**: Added scroll-to-top on component mount to handle navigation from other parts of the app
  - **DashboardReports**: Added scroll-to-top on component mount to handle navigation from other parts of the app
  - **Consistent Behavior**: All dashboard pages now start at the top regardless of how users arrive at them
- **User Experience**: Users now consistently arrive at the top of dashboard pages, providing a predictable and professional navigation experience
- **Files Modified**:
  - `app/src/features/dashboard/pages/DashboardView.jsx`
  - `app/src/features/dashboard/components/DashboardPets.jsx`
  - `app/src/features/dashboard/components/DashboardReports.jsx`

### 2025-10-15: Implemented PDF flyer generation for missing pets
- **Purpose**: Enable users to quickly generate and print professional missing pet flyers to help find their lost pets
- **Solution**: Added comprehensive PDF flyer generation system with modal-based workflow:
  - **Backend**: Updated `UserSerializer` to expose `email` and `phone_number` attributes with camelCase transformation for contact information on flyers
  - **PDF Library**: Installed `react-to-print` package (v3.2.0) for client-side PDF generation
  - **Modal Component**: Created `FlyerGenerationModal` with optional reward amount and additional notes inputs, following existing modal patterns
  - **Flyer Component**: Created `LostPetFlyer` print-optimized React component with:
    - Large "MISSING" header with red accent color
    - Prominent pet image display
    - Complete pet details (name, species, breed, colors, gender, spay/neuter status)
    - Description and last seen location (for reports)
    - Optional reward amount in highlighted red section
    - Optional additional notes section
    - Contact information (phone and/or email based on availability)
    - Professional 8.5" x 11" layout with print-friendly styling
  - **Custom Hook**: Created `useFlyerGeneration` hook to manage modal state and integrate with react-to-print
  - **Pet Detail View**: Added "Generate Lost Pet Flyer" button visible when pet status is "missing"
  - **Report Detail View**: Added "Generate Lost Pet Flyer" button visible for active reports
  - **User Data Flow**: Updated `DashboardPets` and `DashboardReports` to fetch and pass user data from Redux auth state
- **User Workflow**:
  1. User clicks "Generate Lost Pet Flyer" button on missing pet or active report
  2. Modal prompts for optional reward amount and additional notes
  3. User confirms and browser print dialog opens automatically
  4. User can print to PDF or physical printer
- **Contact Information Logic**:
  - Shows phone number if present
  - Shows email if phone not present
  - Shows both if both are present
- **Files Created**:
  - `app/src/shared/components/common/FlyerGenerationModal.jsx`
  - `app/src/shared/components/common/LostPetFlyer.jsx`
  - `app/src/shared/hooks/useFlyerGeneration.js`
- **Files Modified**:
  - `app/serializers/user_serializer.rb`
  - `app/src/features/pets/components/PetDetailView.jsx`
  - `app/src/features/reports/ReportDetailView.jsx`
  - `app/src/features/dashboard/components/DashboardPets.jsx`
  - `app/src/features/dashboard/components/DashboardReports.jsx`
  - `package.json` (added react-to-print dependency)

### 2025-10-20: Added confirmation modals for updating associated pet/report records
- **Purpose**: Inform users when updating a pet or report will also update its associated record, providing transparency and preventing unexpected data changes
- **Solution**: Implemented comprehensive confirmation modal system for both pet and report updates:
  - **Modal Component**: Created `AssociatedRecordUpdateModal` that displays before saving when an associated record exists
  - **Pet Updates**:
    - Modified `usePetEdit` hook to detect if pet has an associated report (`reportId` present)
    - When saving a pet with an associated report, modal appears explaining that the report will be updated with the same information
    - Updated `PetEditForm` to integrate the confirmation modal
    - Backend service `Pets::Update` now syncs data to associated report (name, species, breeds, colors, gender, microchip ID, spay/neuter status)
  - **Report Updates**:
    - Modified `useReportEdit` hook to detect if report has an associated pet (`petId` present)
    - When saving a report with an associated pet, modal appears explaining that the pet will be updated with the same information
    - Updated `ReportEditView` to integrate the confirmation modal
    - Backend service `Reports::Update` now syncs data to associated pet (name, species, breeds, colors, gender, microchip ID, spay/neuter status)
  - **Modal Features**:
    - Shows only when an associated record exists
    - Clearly explains which fields will be synced
    - Provides "Cancel" and "Save Both" options
    - Displays loading state during save operation
    - Accessible with keyboard navigation (ESC to close)
  - **Data Synchronization**:
    - Synced fields: name, species, breed_1, breed_2, color_1, color_2, color_3, gender, microchip_id, is_altered
    - Uses fallback logic to preserve existing data if new values are nil
    - Executed within database transaction for consistency
  - **Backend Updates**:
    - Added `update_associated_report` method to `Pets::Update` service
    - Added `update_associated_pet` method to `Reports::Update` service
    - Updated `ReportSerializer` to include `pet_id` attribute for frontend detection
- **User Workflow**:
  1. User edits pet or report and clicks green "Save" button
  2. If associated record exists, confirmation modal appears
  3. User can cancel or confirm to save both records
  4. Data is saved to both records simultaneously
- **Files Created**:
  - `app/src/shared/components/common/AssociatedRecordUpdateModal.jsx`
- **Files Modified**:
  - `app/src/shared/hooks/usePetEdit.js`
  - `app/src/features/pets/components/forms/PetEditForm.jsx`
  - `app/src/shared/hooks/useReportEdit.js`
  - `app/src/features/reports/forms/ReportEditView.jsx`
  - `app/services/pets/update.rb`
  - `app/services/reports/update.rb`
  - `app/serializers/report_serializer.rb`

### 2025-10-20: Updated name validation to allow periods and hyphens
- **Purpose**: Allow more flexible pet and report names that can include periods and hyphens for better user experience
- **Solution**: Updated validation rules for both pet and report name fields:
  - **Pet Names**: Updated regex from `/\A[a-zA-Z0-9\s\-]+\z/` to `/\A[a-zA-Z0-9\s\-\.]+\z/` to allow periods
  - **Report Names**: Updated regex from `/\A[a-zA-Z0-9\s\-]+\z/` to `/\A[a-zA-Z0-9\s\-\.]+\z/` to allow periods
  - **Error Messages**: Updated validation messages to reflect new allowed characters: "can only contain letters, numbers, spaces, hyphens, and periods"
  - **Test Coverage**: Added test case to verify names with periods and hyphens are valid (e.g., "Mr. Fluffy-Paws")
- **Allowed Characters**: Letters (a-z, A-Z), numbers (0-9), spaces, hyphens (-), and periods (.)
- **Files Modified**:
  - `app/models/concerns/pet_validations.rb`
  - `app/models/concerns/report_validations.rb`
  - `spec/models/report_spec.rb`

### 2025-10-20: Fixed state synchronization between pet and report updates
- **Issue**: When updating a pet's name and then viewing the associated report detail view, the report still showed the old pet name until a hard page refresh. The state wasn't properly synchronized between pet and report caches in RTK Query
- **Root Cause**: Two issues were preventing proper state synchronization:
  1. RTK Query cache invalidation was not coordinated between pets and reports - when a pet was updated, only Pets cache tags were invalidated, not Reports cache tags
  2. `DashboardReports` component lacked the same state update pattern as `DashboardPets` - it didn't update `selectedReport` when the `reports` array refreshed from cache invalidation
- **Solution**:
  - **Cache Invalidation**: Updated both `updatePet` and `updateReport` mutations to invalidate both Pets and Reports cache tags, ensuring cross-cache synchronization
  - **State Update Pattern**: Added useEffect to `DashboardReports` (matching the pattern in `DashboardPets`) that updates `selectedReport` whenever the `reports` array changes, ensuring the detail view always shows fresh data
  - **Tag Types**: Added "Reports" to petsApi tagTypes for proper cross-cache invalidation
  - **Cache Tags Invalidated**: Both mutations now invalidate `LIST` and `USER_LIST` tags for both Pets and Reports
- **User Experience**: Pet and report data now stay synchronized across all views without requiring hard refreshes. When a pet name is updated, the associated report immediately reflects the new name in the report detail view
- **Files Modified**:
  - `app/src/store/features/pets/petsApi.js`
  - `app/src/store/features/reports/reportsApi.js`
  - `app/src/features/dashboard/components/DashboardReports.jsx`

