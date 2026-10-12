# Frontend Architecture Guidelines

- Keep the SafeFood presentation at the index route and use shared semantic CSS tokens and Button variants for its controls, so the reference design stays consistent.
- Treat scanning and download dialogs as presentation previews until real scanning services and store links are supplied; do not imply live verification.
- Keep demo portal pages under a single `/app/*` wildcard route, with role-specific screens selected from their path, so the supplied role URLs work without duplicate protected-home routes.
