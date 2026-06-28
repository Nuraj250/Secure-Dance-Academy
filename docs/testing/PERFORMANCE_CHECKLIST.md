# Performance Checklist

This checklist validates the user-facing performance target for common pages and
record views. [NFR-01]

## Targets

- Common pages should become usable within 2 seconds under normal conditions.
- Search and pagination should remain responsive on seeded production-like data.
- Sensitive actions should remain snappy enough to avoid duplicate submissions.

## Page-Level Checks

- [ ] Login page renders without blocking on non-essential work.
- [ ] Dashboard shell appears quickly and defers non-critical widgets.
- [ ] Profile, users, audit, and settings pages load within the response target.
- [ ] Table-heavy views paginate instead of rendering all rows at once.
- [ ] Empty states and skeletons appear before data finishes loading.

## Interaction Checks

- [ ] Search input remains responsive while typing.
- [ ] Filters update without unnecessary full-page refreshes.
- [ ] Dialog open and close actions feel immediate.
- [ ] Submit buttons show loading state and prevent duplicate requests.

## Build and Bundle Checks

- [ ] `next build` completes without unexpected warnings.
- [ ] Client-side bundles remain scoped to the screens that need them.
- [ ] Shared UI components are reused instead of duplicated per feature.

## Measurement Notes

- Measure on the local production build, not the development server.
- Record cold-cache and warm-cache timings separately.
- Use the same test data profile for every run so comparisons stay meaningful.
- Keep the data volume high enough to exercise pagination, filtering, and audit
  lists without creating artificial bottlenecks.

## Regression Triggers

- Authentication logic changes.
- Dashboard layout changes.
- New table columns or filters.
- New form validation or submission flows.
- Any change touching shared server actions or route handlers. [SR-05, SR-06]

