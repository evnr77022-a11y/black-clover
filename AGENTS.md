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

## Application rules
- Keep episode metadata and supplied embed URLs in browser-safe static data modules; never resolve or proxy third-party protected streams.
- Store viewing progress and favorites locally through the shared progress provider because this experience explicitly requests device-local ranks; embedded players cannot report completion, so users mark watched episodes themselves.
- Use CSS perspective for the stylized grimoire and a lightweight 2D canvas for embers; avoid a heavyweight 3D renderer for a decorative book transition.
- Keep season-local episode numbers and progress separate, migrating legacy season-one data; restore browsing preferences only after local storage hydration.
- Accept player timeUpdate messages only from the mounted iframe window and its exact source origin; reject invalid times and never invent unsupported seek/capture commands.
