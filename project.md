# Project Progress

## Completed Tasks

### Event Infrastructure Implementation (October 22, 2025)
- Created polymorphic events system for tracking events related to reports and other resources
- **Database Layer:**
  - Created `events` table migration with:
    - `category` field to store event type (e.g., "report_tip")
    - Polymorphic `eventable_type` and `eventable_id` fields for flexible association
    - `user_id` foreign key to track event creator
    - `data` jsonb field to store event-specific data (message, location, etc.)
    - Indexes on category, user_id, and polymorphic fields for performance
- **Model Layer:**
  - Created `Event` model with polymorphic `eventable` association and `user` association
  - Added data validation to ensure data field is always a hash
  - Created `Events::Report::Tip` concern in `/app/models/concerns/events/report/tip.rb`:
    - Defines CATEGORY constant for "report_tip" events
    - Validates that message is present in data for tip events
    - Provides helper methods to access data fields (message, area, state, country, latitude, longitude)
    - Includes class method `create_tip` for convenient tip creation
  - Updated `Report` model with:
    - `has_many :events` polymorphic association
    - `has_many :tips` convenience association filtered by report_tip category
  - Updated `User` model with `has_many :events` association
- **Service Layer:**
  - Created `Events::Create` service in `/app/services/events/create.rb`
  - Uses ActiveInteraction pattern consistent with existing services
  - Accepts eventable, user, category, and data parameters
  - Returns created event or nil with merged validation errors
- **Design Decisions:**
  - Used simple polymorphic approach without STI for flexibility
  - JSON data field allows different event types to store custom data
  - Tips are always attributed to users via required user_id
  - Public visibility (no access control at model layer)
  - Infrastructure ready for future event types (sightings, status changes, etc.)

### Tip Functionality Implementation (October 22, 2025)
- **Backend API:**
  - Created `Api::EventsController` in `/app/controllers/api/events_controller.rb`:
    - `create_tip` action for submitting tips with message and optional location data
    - `index_tips` action for retrieving all tips for a report
    - Proper authentication and validation using existing `Events::Create` service
    - Returns structured JSON responses with tip data and user information
  - Added nested routes in `/config/routes.rb`:
    - `POST /api/reports/:report_id/events/create_tip` - Submit a tip
    - `GET /api/reports/:report_id/events/index_tips` - Get all tips for a report
- **Frontend Components:**
  - Created `TipsSection` component in `/app/src/features/tips/components/TipsSection.jsx`:
    - Main container that shows tip list and form
    - Handles authentication state (shows sign-in prompt for non-authenticated users)
    - Manages form visibility state
  - Created `TipList` component in `/app/src/features/tips/components/TipList.jsx`:
    - Displays all tips for a report with user attribution and timestamps
    - Shows location information when available
    - Handles loading and error states
    - Empty state with encouraging message
  - Created `TipForm` component in `/app/src/features/tips/components/TipForm.jsx`:
    - Form for submitting tips with message (required) and optional location fields
    - Includes area, state, country, latitude, longitude fields
    - Form validation and error handling
    - Success feedback and form reset
- **Redux Integration:**
  - Created `tipsApi` slice in `/app/src/store/features/tips/tipsApi.js`:
    - `useGetTipsQuery` hook for fetching tips
    - `useCreateTipMutation` hook for submitting tips
    - Proper cache invalidation and tag management
  - Updated Redux store configuration to include tips API
- **Integration:**
  - Integrated `TipsSection` into `ListingDetailsCard` component
  - Tips section appears below the main report details on report viewing pages
  - Maintains existing design patterns and styling consistency
- **User Experience:**
  - Authenticated users can submit tips with optional location data
  - Non-authenticated users see sign-in prompt
  - Tips are displayed with user attribution and timestamps
  - Form validation ensures required message field is provided
  - Success/error notifications provide user feedback

### Report Events Tracking Implementation (October 27, 2025)
- **Backend Event Categories:**
  - Created `Events::Report::Create` concern for "report_created" events
  - Created `Events::Report::Update` concern for "report_updated" events
  - Created `Events::Report::Archive` concern for "report_archived" events
  - Updated `Event` model to include all new concerns
  - Each concern follows existing pattern with CATEGORY constant and helper methods
- **Service Integration:**
  - Added event creation to `Reports::Create` service after successful report creation
  - Added event creation to `Reports::Update` service after successful report updates
  - Added event creation to `ReportsController#archive` action after successful archiving
  - Events store minimal data (title, species) for context without sensitive information
- **Frontend Display:**
  - Updated `DashboardOverview` component to format new event categories
  - Added appropriate icons and colors for each event type:
    - Created: Green plus icon
    - Updated: Yellow edit icon
    - Archived: Gray down arrow icon
  - Events display with readable descriptions and proper context

### Dashboard Recent Activity Implementation (October 27, 2025)
- **Backend API:**
  - Added `user_events` action to `EventsController` for fetching paginated user events
  - Created `EventSerializer` to format event data with eventable summary information
  - Added `GET /api/users/events` route with pagination support (5 events per page)
  - Events ordered by `created_at DESC` to show most recent first
  - Eager loading of eventable associations to prevent N+1 queries
- **Frontend Integration:**
  - Created `eventsApi` RTK Query slice with `getUserEvents` endpoint
  - Updated Redux store configuration to include events API
  - Transformed `DashboardOverview` component from placeholder to functional component
  - Displays paginated events with event type, timestamp, and eventable context
  - Added event category formatting (e.g., "report_tip" → "Submitted a tip")
  - Shows eventable information (e.g., "for Lost Dog Report (active)")
  - Includes loading states, error handling, and empty state
  - Pagination component for navigating through event history
- **User Experience:**
  - Recent Activity section shows user's most recent 5 events per page
  - Events display with appropriate icons and readable descriptions
  - Context information shows which report or pet the event relates to
  - Clean, consistent design matching existing dashboard patterns
  - Encourages user engagement by showing their activity history

### About Page Implementation (October 20, 2025)
- Created `/app/src/features/about/pages/AboutPage.jsx` with comprehensive content including:
  - Hero section with warm, community-focused messaging
  - Mission statement explaining the platform's purpose
  - **"Time Is Critical" section** explaining the urgent realities:
    - Stray hold periods (3-7 days) and their limitations
    - How animals move through the shelter/rescue pipeline across jurisdictions
    - The absence of a national database for tracking lost pets
    - How pets can be transferred, adopted, or moved hundreds of miles away before owners find them
    - Emphasized why Lost Pets Registry provides a crucial centralized solution
  - **"How It Works" section** with proactive 3-step process:
    - 1. Add Your Pets: Create account and add pets to database preemptively
    - 2. Report If Lost: One-click reporting from dashboard if pet goes missing
    - 3. Create Flyers: Generate printable flyers instantly with pet's photo and details
    - Includes pro tip encouraging users to add pets before they go missing
  - Key Features section highlighting location-based search, photo uploads, report management, and filters
  - Community section emphasizing volunteer-driven platform and solidarity messaging
  - Get Involved section with calls to action
  - Sign Up and Search Reports call-to-action buttons
- Added `/about` route to `AppRouter.jsx`
- Updated navigation links in `Footer.jsx` and `Navbar.jsx` to point to `/about` instead of `#`
- Used MaterialUI components for consistent styling
- Maintained accessibility standards with semantic HTML and proper ARIA labels
- Content emphasizes warm, community-focused tone with emphasis on helping pets reunite with families
- Red-highlighted warning section draws attention to the time-sensitive nature of lost pet situations

### Address Input Autofill Fix (January 2, 2025)
- **Problem:** Address input fields were triggering browser password managers and autofill suggestions, creating poor UX
- **Root Cause:** TextField components used "address" in aria-label and placeholder, which browsers associate with saved addresses
- **Solution Implemented:**
  - Changed `aria-label` from "Enter an address" to "Enter a location"
  - Changed `placeholder` from "Enter an address" to "Enter a location"
  - Added `name="location-search"` to provide specific field identification
  - Added `autoComplete="off"` to disable browser autofill
- **Files Updated:**
  - `/app/src/features/reports/components/ReportLocationSelect.jsx`
  - `/app/src/features/listings/components/common/LocationSelect.jsx`
  - `/app/src/features/tips/components/TipLocationSelect.jsx`
- **Result:** Location input fields no longer trigger password manager dropdowns, improving user experience

### Pet Archive Redirect Fix (January 2, 2025)
- **Problem:** After archiving a pet, users remained on the current page instead of being redirected to the My Pets page
- **Solution Implemented:**
  - Added `navigate('/dashboard/pets')` to the `handleConfirmArchive` function in `DashboardPets.jsx`
  - Redirect occurs after successful pet archiving and success notification
- **File Updated:**
  - `/app/src/features/dashboard/components/DashboardPets.jsx`
- **Result:** Users are now automatically redirected to the My Pets page after successfully archiving a pet, providing better UX flow

### Pet Creation Scroll Fix (January 2, 2025)
- **Problem:** When creating a new pet and being redirected back to `/dashboard/pets`, the screen was positioned toward the bottom instead of the top
- **Root Cause:** Scroll-to-top logic only ran on component mount, but when navigating back from pet creation, the component was already mounted
- **Solution Implemented:**
  - Added additional `useEffect` that triggers scroll-to-top when `isCreatingPet` changes from true to false
  - This ensures the page scrolls to top when returning from pet creation or editing
- **File Updated:**
  - `/app/src/features/dashboard/components/DashboardPets.jsx`
- **Result:** Users now see the top of the My Pets page when returning from pet creation, providing better UX

### Report Creation Scroll Fix (January 2, 2025)
- **Problem:** When creating a new report and being redirected back to `/dashboard/reports`, the screen was positioned toward the bottom instead of the top
- **Root Cause:** Same issue as pet creation - scroll-to-top logic only ran on component mount, but when navigating back from report creation, the component was already mounted
- **Solution Implemented:**
  - Added additional `useEffect` that triggers scroll-to-top when `isCreatingReport` changes from true to false
  - This ensures the page scrolls to top when returning from report creation or editing
- **File Updated:**
  - `/app/src/features/dashboard/components/DashboardReports.jsx`
- **Result:** Users now see the top of the My Reports page when returning from report creation, providing consistent UX across both dashboard sections

### Hide Archived Item Action Buttons (January 2, 2025)
- **Problem:** Edit (pencil) and archive (trash can) icons were still visible for pets and reports with "archived" status, which could confuse users
- **Solution Implemented:**
  - Added conditional rendering to hide edit and archive buttons when status is "archived"
  - For pets: `{onEdit && pet.status !== 'archived' && (...)}`
  - For reports: `{onEdit && report.status !== 'archived' && (...)}`
- **Files Updated:**
  - `/app/src/features/pets/components/PetDetailView.jsx`
  - `/app/src/features/reports/ReportDetailView.jsx`
- **Result:** Archived pets and reports no longer show edit/archive buttons, providing clearer UI state indication and preventing user confusion

### User Settings Infrastructure Implementation (October 27, 2025)
- **Database Layer:**
  - Created migration to add `settings` JSONB column to users table
  - Set default values: `email_notifications: true`, `allow_contact: true`, `dark_mode: false`
  - Added GIN index on settings column for efficient querying
  - All existing users automatically receive default settings values
- **Model Layer:**
  - Updated `User` model with settings validation
  - Added `settings_structure` validation method to ensure settings is a hash with valid keys and boolean values
  - Valid settings keys: `email_notifications`, `allow_contact`, `dark_mode`
- **API Layer:**
  - Added `update_settings` action to `RegistrationsController`
  - Created `PATCH /api/settings` endpoint for updating user settings
  - Settings updates return updated user object via `UserSerializer`
  - Proper error handling and validation messages
- **Serializer:**
  - Updated `UserSerializer` to include settings in user data
  - Settings automatically transformed to camelCase format for frontend consumption
- **Frontend Redux:**
  - Added `updateSettings` mutation to `authApiSlice`
  - Mutation updates Redux user state upon successful settings update
  - Automatic success/error notifications via existing notification system
  - Exported `useUpdateSettingsMutation` hook for component usage
- **Dashboard Settings UI:**
  - Updated `DashboardSettings` component to fetch and persist settings
  - Component reads current settings from Redux user state
  - Toggles for email notifications, allow contact, and dark mode
  - "Save Settings" button persists changes to backend and updates Redux state
  - "Reset to Defaults" button restores default values (email_notifications: true, allow_contact: true)
  - Loading states and disabled buttons during save operations
  - Dark mode toggle continues to work with existing `useTheme` hook while also being persisted to database
- **User Experience:**
  - New users automatically get default settings on account creation
  - Settings are immediately available in user state after login
  - Changes persist across sessions and devices
  - Clear feedback via notifications on save success/failure
  - Settings page maintains existing styling and accessibility standards

### Footer Background Color Fix (October 28, 2025)
- **Problem:** Footer background color (`bg-base-200`) was different from navbar background color (`bg-page`)
- **Solution Implemented:**
  - Changed footer background class from `bg-base-200` to `bg-page` to match navbar
- **File Updated:**
  - `/app/src/shared/components/common/Footer.jsx`
- **Result:** Footer and navbar now have consistent background colors, improving visual consistency across the application


### Add admin flag to users (October 30, 2025)
- Added migration to introduce `admin:boolean` on `users`
- Default `false`, `null: false` to ensure consistency and backwards compatibility
- Not exposed in `UserSerializer` and not permitted via sign up/update params
- No changes to seeds; existing users default to non-admin


### TipsSection ownership check hardening (October 30, 2025)
- Fixed owner detection in `TipsSection.jsx` by normalizing owner id lookup and type comparison
- Now checks `userId`, `user_id`, `ownerId`, `owner_id`, and `user.id` on report and compares as strings
- Impact: non-owners reliably see the “Start a Conversation” button; owners still don’t

