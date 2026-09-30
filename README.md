# GitHub Pages Redirect Manager

A simple static redirect page that works on GitHub Pages.

## Important limitation
GitHub Pages has no server-side database. The Dashboard's **Save locally** button stores an override in the current browser only. It does NOT change the destination for other visitors.

For a global change, edit `config.js`:

```js
window.REDIRECT_CONFIG = {
  destination: 'https://example.com/'
};
```

Commit/push the change to GitHub. The permanent redirect URL remains `go.html`.

## GitHub Pages setup
1. Create a GitHub repository.
2. Upload `index.html`, `go.html`, `config.js`, `script.js`, `style.css` and `README.md`.
3. Open **Settings → Pages**.
4. Select **Deploy from a branch**, choose `main` and `/root`, then Save.
5. Open your GitHub Pages URL.
6. Use `https://YOUR-USERNAME.github.io/YOUR-REPO/go.html` as the permanent redirect URL.

## Change destination globally
Edit only `config.js`, replace the destination URL, commit the change and wait for GitHub Pages to deploy.
