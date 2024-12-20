## Search Functionality Updates
- [x] Fixed color search functionality to properly handle case sensitivity
- [x] Implemented color normalization in the Report model
- [x] Simplified Elasticsearch query structure for better performance
- [x] Added documentation for color search implementation

## Data Standardization Updates
- [x] Created shared gender options configuration
- [x] Implemented GenderList concern for backend validation
- [x] Added TypeScript types and helpers for frontend gender validation
- [x] Removed duplicated gender options list
- [x] Added documentation for gender options implementation

### Technical Debt Addressed
- Removed complex regexp queries in favor of simple term queries
- Standardized color case handling across the application
- Eliminated duplicate gender definitions between frontend and backend
- Standardized gender validation across the application
