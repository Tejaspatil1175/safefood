# SafeFood demo login and role portals

## User experience
- Preserve the existing SafeFood homepage exactly as it is.
- Add a matching email/password sign-in and registration experience, with clear demo entry points for citizen, officer, and administrator roles.
- Build navigable, populated sample screens for every portal page listed in the supplied SafeFood specification: dashboards, scanning, history/reports, grievances/investigations, and settings.
- Keep scans, records, sign-in, and registration as clearly labeled presentation demos only; do not imply real authentication, saved profile data, live OCR, or enforcement actions.

## Technical details
- Add top-level `/login` and `/register` routes and an `/app/*` catch-all route for the role portal screens, each with route-specific metadata.
- Keep routing and interactions within the existing TanStack Start stack, use the existing SafeFood design tokens and Button component, and place new visual styles after the existing styles without changing the home page rules.
- Use representative sample data only; do not enable Cloud or add database/auth code for this prototype.
