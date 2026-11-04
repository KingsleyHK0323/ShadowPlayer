# ShadowPlayer website

The ShadowPlayer website is a static project introduction and guide. It describes the project's intended direction and current development status without presenting planned application features as completed.

## Local preview

Open `index.html` in a browser or serve this directory with a local HTTP server. No package installation or build step is required. The guide is available at `guide.html`.

The repository statistics on the home page request public GitHub API data when the page loads. The release field shows the latest stable release; prereleases are not included. Contributor avatars are loaded from GitHub. Requests may fail because of a network error, browser restrictions, or GitHub rate limits; the rest of the website remains available. The page discloses these requests to visitors.

The appearance selector supports the system color scheme, light mode, and dark mode. The selection is stored in the browser when storage is available. The guide search filters the topics on that page in the browser and does not send the search text to a server. Navigation wraps on narrow screens, and the page icon reuses the existing website header mark.

## Deployment

The existing GitHub Pages workflow checks and publishes this directory when the `Website` branch is pushed.

## Licenses

- Website code, including HTML structure, stylesheets, and JavaScript: [PolyForm Noncommercial License 1.0.0](LICENSE), reproduced from the [official text](https://polyformproject.org/licenses/noncommercial/1.0.0.txt).
- Original website content, including prose and original illustrations: [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International](LICENSE-CONTENT.txt), reproduced from the [official legal code](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.txt).

These licenses restrict commercial use. GitHub names, marks, contributor avatars, and other third-party material remain subject to their respective owners' terms.

Copyright © 2026 Kingsley.

<!-- Authored by: OpenAI-Codex_Responsible: Website -->
