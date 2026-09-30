# GitHub API Redirect Manager

This project lets you create separate redirect files directly from a GitHub Pages dashboard.

Example:
- enter Slug: `go1`
- destination: `https://example.com/page1`
- click Create / Update Redirect

The dashboard uses the GitHub Contents API to create/update:
- `go1.html`
- `config.json`

Then your URL is:
`https://USERNAME.github.io/REPOSITORY/go1.html`

## GitHub setup

1. Create a GitHub repository.
2. Upload all files from this folder.
3. Enable GitHub Pages from Settings → Pages → Deploy from branch → main.
4. Create a GitHub fine-grained Personal Access Token.
5. Give the token access to this repository and Contents permission: Read and write.
6. Open your GitHub Pages `index.html`.
7. Enter owner, repository and token.
8. Enter any Slug and destination URL.
9. Click Create / Update Redirect.

## Security note

Because this is a static GitHub Pages application, the GitHub token is entered in the browser and stored in that browser's localStorage. Do NOT use a broad/full-access token. Use a fine-grained token limited to this one repository with only the minimum Contents permission.

For a production/shared dashboard where the token should never be exposed to the browser, use a server-side backend or GitHub OAuth.

## Important

GitHub Pages deployment itself may take a short time after a repository change. The redirect file is created immediately in the repository, but the public Pages version updates after GitHub Pages publishes the commit.
