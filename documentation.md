# Pet Registry Documentation

## User Dashboard Feature

### Overview
The user dashboard provides authenticated users with access to their personal sections including "My Reports", "My Pets", "Profile", and "Settings".

### Implementation Details

#### Authorization
- Uses Pundit gem for authorization
- `UserDashboardController` requires user authentication via `authenticate_user!`
- `DashboardPolicy` ensures only authenticated users can access the dashboard
- Authorization is enforced through the `authorize_dashboard_access` before_action

#### Components
1. **UserDashboardController** (`app/controllers/user_dashboard_controller.rb`)
   - Inherits from `ApplicationController`
   - Includes Pundit authorization
   - Requires user authentication
   - Authorizes dashboard access via policy

2. **DashboardPolicy** (`app/policies/dashboard_policy.rb`)
   - Inherits from `ApplicationPolicy`
   - `access?` method checks if user is present (authenticated)

3. **ApplicationPolicy** (`app/policies/application_policy.rb`)
   - Base policy class for all Pundit policies
   - Provides standard CRUD method stubs
   - Includes Scope class for collection authorization

4. **Routes** (`config/routes.rb`)
   - `GET /dashboard` routes to `user_dashboard#index`

5. **View** (`app/views/user_dashboard/index.html.erb`)
   - Basic dashboard layout with navigation
   - Placeholder links for future pages
   - Displays user email

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
