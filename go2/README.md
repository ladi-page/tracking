# RedirectPro — GitHub Pages Dashboard

A modern dashboard for creating and editing separate `.html` redirect URLs directly in a GitHub repository.

### Example
Slug: `offer1`
Destination: `https://example.com/page`

Click **Create redirect** and the dashboard creates:

`offer1.html`

Your public redirect becomes:

`https://USERNAME.github.io/REPOSITORY/offer1.html`

Edit `offer1` later and the same file is updated.

## Setup

1. Create a GitHub repository.
2. Upload all project files.
3. Enable GitHub Pages from Settings → Pages → Deploy from branch → main.
4. Create a GitHub fine-grained Personal Access Token.
5. Restrict the token to this repository.
6. Give **Contents: Read and write** permission.
7. Open your GitHub Pages dashboard.
8. Go to Settings and enter owner, repository and token.
9. Create redirects from the dashboard.

## Security

The token is stored in browser localStorage because this is a static GitHub Pages application. Use a fine-grained token restricted to only this repository and only the required Contents permission. Do not use a classic full-access token.

For a production dashboard shared with multiple users, use a server-side backend/OAuth instead of exposing a GitHub token in the browser.

## Notes

GitHub Pages can take a little time to publish a newly committed HTML file. The dashboard writes directly to the repository using the GitHub Contents API.
