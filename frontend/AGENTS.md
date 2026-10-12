<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the SafeFood presentation at the index route and use shared semantic CSS tokens and Button variants for its controls, so the reference design stays consistent.
- Treat scanning and download dialogs as presentation previews until real scanning services and store links are supplied; do not imply live verification.
- Keep demo portal pages under a single `/app/*` wildcard route, with role-specific screens selected from their path, so the supplied role URLs work without duplicate protected-home routes.
