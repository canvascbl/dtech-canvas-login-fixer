# dtech-canvas-login-fixer

A simple Chrome extension that fixes signing into d.tech's Canvas.

See a 1-minute demo [here](https://go.canvascbl.com/canvas-fixer/demo).

## How does this work?

- When you install the app, the settings page is opened.
- There, you choose whether you log in via Google (students/staff) or via Canvas (parents).
  - This result is saved, via Chrome messaging to the background script, in Chrome Synced Extension Storage.

- When you visit the d.tech Family Portal, a `webRequest` lister is called, which then calls `performRedirect`.
- `performRedirect` figures out the URL to forward to.
  - If the requesting URL includes the `dtech_canvas_fixer_no_redirect` query param with a value of `true`, nothing happens.
  - If it's been more than 24 hours since the last URL map fetch, it fetches the URL map from [https://go.canvascbl.com/canvas-fixer/url-map](https://go.canvascbl.com/canvas-fixer/url-map) (this is hosted from the `gh-pages` branch on this repo!). This way, if the sign in URLs are updated later, an extension update isn't needed.
- `performRedirect` calls `chrome.tabs.update` to redirect the tab to the new URL.
- If an error occurred, the backend redirects the user to the no-redirect Family Portal URL.

## Building and running

This extension is written in TypeScript, and is compiled via Webpack.

1. `yarn install` | `npm i`
2. `yarn start` | `npm run start`
3. Go to chrome://extensions
4. Enable developer mode (top right)
5. Click 'Load unpacked'
6. Point to the `bin` folder in this repo
7. Edit some code!

If you want to compile a production release, just run `yarn build` or `npm run build` after completing the above steps. That will put compiled files into the `bin/` folder.

## Contributing

Contributions are welcome! Please note that this code is GPLv3 licensed, and uses yarn - PRs that include an NPM lockfile (`package-lock.json`) will need to be converted to yarn.