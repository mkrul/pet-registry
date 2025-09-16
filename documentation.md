# Pet Registry Documentation

## User Dashboard Feature

### Overview
The user dashboard provides authenticated users with access to their personal sections including "Overview", "My Reports", "My Pets", "Profile", and "Settings". The dashboard uses Turbo frames for seamless navigation without full page reloads.

### Implementation Details

#### Turbo Frames Integration
- Uses Turbo Rails for SPA-like navigation within the dashboard
- Each section loads content dynamically using `turbo_frame_tag`
- Navigation links target the `dashboard_content` frame
- Maintains state and provides smooth user experience

#### Authorization
- Uses Pundit gem for authorization
- `UserDashboardController` requires user authentication via `authenticate_user!`
- `DashboardPolicy` ensures only authenticated users can access the dashboard
- Authorization is enforced through the `authorize_dashboard_access` before_action

#### Components
1. **UserDashboardController** (`app/controllers/user/dashboard_controller.rb`)
   - Inherits from `ApplicationController`
   - Includes Pundit authorization
   - Requires user authentication
   - Authorizes dashboard access via policy
   - Uses dedicated `dashboard` layout
   - Handles multiple sections: index, reports, pets, profile, settings
   - Tracks active section for navigation highlighting

2. **DashboardPolicy** (`app/policies/dashboard_policy.rb`)
   - Inherits from `ApplicationPolicy`
   - `access?` method checks if user is present (authenticated)

3. **ApplicationPolicy** (`app/policies/application_policy.rb`)
   - Base policy class for all Pundit policies
   - Provides standard CRUD method stubs
   - Includes Scope class for collection authorization

4. **Routes** (`config/routes.rb`)
   - `GET /user/dashboard` routes to `user/dashboard#index`
   - `GET /user/dashboard/reports` routes to `user/dashboard#reports`
   - `GET /user/dashboard/pets` routes to `user/dashboard#pets`
   - `GET /user/dashboard/profile` routes to `user/dashboard#profile`
   - `GET /user/dashboard/settings` routes to `user/dashboard#settings`

5. **Layout** (`app/views/layouts/dashboard.html.erb`)
   - Dedicated layout for dashboard pages
   - Includes Turbo Rails assets
   - Optimized for dashboard functionality

6. **Main View** (`app/views/user_dashboard/index.html.erb`)
   - Turbo frame-based navigation structure
   - Dynamic content loading via `turbo_frame_tag`
   - Active section highlighting
   - Renders appropriate partials based on active section

7. **Partial Views**
   - `_overview.html.erb` - Dashboard overview with quick access cards
   - `_reports.html.erb` - Reports management section
   - `_pets.html.erb` - Pet registration and management
   - `_profile.html.erb` - User profile information
   - `_settings.html.erb` - Account settings and preferences

### Development Setup

#### Docker Configuration
The application uses Docker with multiple services:
- **web**: Rails application server
- **vite**: Vite development server for React/TypeScript assets
- **postgres**: PostgreSQL database
- **redis**: Redis for caching and Action Cable
- **elasticsearch**: Search functionality
- **css**: CSS build process
- **typescript**: TypeScript type checking

#### Running the Application
To start the full development environment with all services:
```bash
make dev
```

This will start all services including the Vite dev server, which is required for the dashboard to load properly.

#### Vite Asset Loading
The dashboard requires the Vite dev server to be running to serve CSS and JavaScript assets. The Docker configuration ensures:
- Vite service has a health check
- All services start in the correct order
- Assets are properly served in development mode

### Future Development
The dashboard is structured to accommodate the following pages:
- My Reports
- My Pets
- Profile
- Settings

These pages will be implemented in future iterations.
