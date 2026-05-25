# First 100 Days GitHub/Squarespace Export

This folder is the manual GitHub upload package. It is static, so it works on GitHub Pages and can be embedded in Squarespace.

## Upload These Files

Upload the contents of this folder to the root of a GitHub repository:

- `index.html`
- `embed.js`
- `admin.html`
- `admin.js`
- `metrics-data.js`
- `metrics.json`
- `widget.html`
- `micro-widget.html`
- `micro-widget.js`
- `squarespace-micro-iframe-snippet.html`
- `squarespace-iframe-snippet.html`
- `squarespace-embed-snippet.html`

## Turn On GitHub Pages

1. Open the GitHub repository.
2. Go to `Settings`.
3. Go to `Pages`.
4. Set the source to the main branch root.
5. Save and wait for GitHub to publish.

Your preview page will be:

```text
https://YOUR-USERNAME.github.io/YOUR-REPO/
```

Your static admin/export page will be:

```text
https://YOUR-USERNAME.github.io/YOUR-REPO/admin.html
```

The admin page can edit the dashboard and download updated `metrics-data.js` and `metrics.json`. Upload those downloaded files back to GitHub to publish changes.

The admin page calculates overall progress from the average progress of all commitments. Completed key actions and key-action percent complete are then calculated from that overall progress and the total key actions value.

## Squarespace Code Block

Paste this into Squarespace, replacing `YOUR-USERNAME` and `YOUR-REPO`:

```html
<div id="first-100-days-metrics"></div>
<script src="https://YOUR-USERNAME.github.io/YOUR-REPO/metrics-data.js?v=1"></script>
<script
  src="https://YOUR-USERNAME.github.io/YOUR-REPO/embed.js?v=1"
  data-target="#first-100-days-metrics">
</script>
```

This version uses `metrics-data.js` instead of fetching JSON from Squarespace. That makes the embed more reliable because cross-site script loading is broadly supported.

## If Squarespace Says "Script Disabled"

Use the iframe method instead. Paste this into a Squarespace Embed Block or Code Block:

```html
<iframe
  src="https://YOUR-USERNAME.github.io/YOUR-REPO/widget.html?v=1"
  title="First 100 Days Metrics"
  style="width:100%; height:1100px; border:0; overflow:hidden;"
  loading="lazy">
</iframe>
```

If the bottom of the widget is cut off, increase `height:1100px` to `1200px` or `1300px`.

## Home Page Micro Widget

Use this smaller iframe on the home page:

```html
<iframe
  src="https://YOUR-USERNAME.github.io/YOUR-REPO/micro-widget.html?v=1"
  title="First 100 Days Dashboard Summary"
  style="width:100%; height:190px; border:0; overflow:hidden;"
  loading="lazy">
</iframe>
```

For your `Progress` repo, the URL should be:

```text
https://jameshward3.github.io/Progress/micro-widget.html?v=1
```

## Editing Metrics

Edit both:

- `metrics.json`, for a human-readable data copy
- `metrics-data.js`, for the Squarespace embed

In `metrics-data.js`, only edit the object after:

```js
window.First100DaysMetricsData =
```

Keep the final event-dispatch lines at the bottom.

## Adding Documents

Each commitment has a `documents` array:

```json
"documents": [
  {
    "title": "Draft legislation",
    "url": "https://YOUR-USERNAME.github.io/YOUR-REPO/files/draft-legislation.pdf"
  }
]
```

If you upload PDFs or Word docs to GitHub, put them in a `files` folder and link to their GitHub Pages URL.

## Updating Squarespace Cache

If Squarespace keeps showing an old version, increase the version numbers:

```html
metrics-data.js?v=2
embed.js?v=2
```
