## New Learnings
- Gender field is now restricted to "Male" and "Female" options only
- Gender field can be left blank if unknown
- Gender values are case-normalized between frontend and backend
- Altered status uses numeric values (1/0/null) consistently throughout the application stack
- Altered status values are validated in both frontend and backend
- Altered status is handled consistently across services and seeds
- Seed data includes altered status for all reports
- Altered status values are normalized to handle empty/nil values consistently
- Altered status is displayed in human-readable format in view mode