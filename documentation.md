## New Learnings

- RTK Query cache invalidation requires careful configuration of provideTags and invalidatesTags to ensure proper cache updates
- When dealing with image updates, it's important to properly invalidate both individual item caches and list caches
- Using refetchOnMountOrArgChange can help ensure data freshness when navigating between pages
