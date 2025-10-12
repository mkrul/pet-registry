# Project Tracking

## Completed Tasks

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

