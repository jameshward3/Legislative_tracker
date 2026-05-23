# Squarespace Export Package

This package is set up for GitHub Pages hosting from:

`https://github.com/jameshward3/Legislative_tracker.git`

Expected public URL after GitHub Pages is enabled:

`https://jameshward3.github.io/Legislative_tracker/`

## Files

- `docs/` contains the static tracker app and assets for GitHub Pages.
- `squarespace-iframe-embed.html` is the Squarespace Code Block snippet.
- `squarespace-fullscreen-link.html` is an optional fallback link.

## Publish To GitHub

1. Create or open the GitHub repository `jameshward3/Legislative_tracker`.
2. Upload the contents of this package to the repository root, keeping the `docs/` folder intact.
3. In GitHub, go to `Settings > Pages`.
4. Set source to `Deploy from a branch`.
5. Select branch `main` and folder `/docs`.
6. Save and wait for GitHub Pages to publish.

## If GitHub Shows 404

- Confirm the repository is public, or that GitHub Pages is available for the repo plan.
- Confirm `docs/index.html` exists in the repository, not just on your computer.
- Confirm Pages is set to `main` branch and `/docs` folder.
- Wait 2-5 minutes after changing Pages settings.
- Use the exact URL casing: `https://jameshward3.github.io/Legislative_tracker/`.
- If Pages is set to repository root instead of `/docs`, the included root `index.html` redirects to `docs/`.

## Add To Squarespace

1. Edit the Squarespace page.
2. Add a Code Block where the tracker should appear.
3. Paste the contents of `squarespace-iframe-embed.html`.
4. Save the page.

The iframe approach keeps the tracker CSS and JavaScript isolated from Squarespace theme styles.
