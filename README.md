# Iron Key website

Standalone client-ready source for the Iron Key website.

## Requirements

- Node.js 20 or newer
- npm 10 or newer

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

The development server prints its local URL in the terminal.

## Form configuration

Set `VITE_APPLICATION_ENDPOINT` in `.env` to the HTTPS endpoint that receives Start a Conversation submissions. The endpoint must accept a JSON `POST` request and return a successful HTTP response.

Do not put private API keys or service credentials in any `VITE_` variable. Vite exposes those values to the browser.

## Production build

```bash
npm run build
npm run preview
```

The deployable static site is generated in `dist/`. Configure the host to serve `index.html` for application routes. `public/_redirects` contains the required SPA fallback and retired-page redirects for hosts that support Netlify-style rules.

## Included media

The New York hero footage is derived from Joe Valdes’s “The New York City Skyline” video on Pexels: https://www.pexels.com/video/the-new-york-city-skyline-4003960/

The vendored Hairline geometry and motion code retains its MIT license in `src/vendor/hairline/LICENSE`.
