## Color Search Implementation
- Colors are normalized to lowercase when saved to the database
- Color search uses exact matching with lowercase values
- This ensures consistent color matching regardless of the case used in the UI or database

### Learnings
1. When using Elasticsearch with case-sensitive fields, it's better to normalize the data at the database level rather than trying to handle case-insensitivity in the search query
2. Using regexp queries in Elasticsearch can be problematic and less performant than exact matching
3. Data normalization should be consistent across the application - from input to storage to search
4. When passing options to Searchkick's search method, use the double splat operator (**) to properly spread the options hash

## Species Search Implementation
- Added special handling for queries containing "dog" or "cat" words
- When users search with queries containing "dog" or "cat" (e.g. "black dog", "orange cat"), the system filters by the respective species
- This ensures more accurate results when users are looking for specific species

### Learnings
1. Special case handling in search can improve user experience by providing more intuitive results
2. Word detection in search queries can help infer user intent
3. Combining text search with specific filters can provide more relevant results
4. Explicit filters should take precedence over inferred filters from query text

## Gender Options Implementation
- Created a single source of truth for gender options using shared JSON
- Implemented TypeScript types and helpers for frontend validation
- Added Ruby concern for backend validation
- Follows the same pattern as breed lists for consistency

### Learnings
1. Sharing configuration between frontend and backend through JSON files reduces duplication and potential inconsistencies
2. Using TypeScript types generated from JSON ensures type safety when working with shared constants
3. Ruby concerns provide a clean way to share validation logic across models
