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

