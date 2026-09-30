# Multi URL Redirect Manager — GitHub Pages

This is a static GitHub Pages redirect system. No PHP, database, Vercel or Supabase is required.

## 1. Upload
Upload all files to a GitHub repository and enable GitHub Pages.

## 2. Add multiple redirects
Edit `config.js`:

```js
window.REDIRECTS = {
  "offer1": "https://example.com/page1",
  "offer2": "https://example.com/page2",
  "promo": "https://example.com/promo"
};
```

You can add unlimited entries.

## 3. Your redirect URLs
If your GitHub Pages URL is:

https://username.github.io/redirect-manager/

Then:

- https://username.github.io/redirect-manager/go.html?id=offer1
- https://username.github.io/redirect-manager/go.html?id=offer2
- https://username.github.io/redirect-manager/go.html?id=promo

## 4. Change a destination
Change the URL in `config.js` and commit the change. The same redirect URL will then send visitors to the new destination.

## Important
The dashboard is a convenient editor/preview for a static GitHub Pages site. GitHub Pages cannot write files back to the repository from browser JavaScript. Therefore, changes made with the dashboard are local to that browser until you update `config.js` and commit it to GitHub.

For true online editing where one dashboard change immediately affects every visitor without a GitHub commit, a backend/database is required.
