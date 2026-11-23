# HomeBase Essentials 2.0 — Cloudflare Workers starter

This package preserves the existing navy/gold website and branding while moving hosting to Cloudflare Workers. It includes a read-only catalog proxy for Google Sheets. **No live payment, account, order, or inventory-write integration is enabled.** Sample products/prices are for demonstration only.

## Deploy a preview (without replacing your current website)
1. Create a free Cloudflare account. Keep the existing GitHub Pages site untouched.
2. Upload these files to a **new** GitHub repository (or a separate branch/repository); preserve `public/` and `src/` folders. Do not upload the ZIP itself.
3. In Cloudflare dashboard, open **Workers & Pages** > **Create** > **Import a repository** (wording can vary). Connect GitHub and select the new repository.
4. Choose a **Worker** project. Build command: `npm install` (or `npm ci` after a lockfile is committed). Deploy command: `npx wrangler deploy`. The `wrangler.jsonc` file defines the static assets and Worker API.
5. Open the Cloudflare `workers.dev` preview URL. Check mobile, language switch, cart, and product detail views. `/api/health` should return `{ "ok": true, ... }`.

Alternatively, on a computer with Node.js installed, run `npm install`, `npx wrangler login`, and `npm run deploy` from this folder.

## Connect Google Sheets catalog
1. Upload the included `.xlsx` to Drive and convert to native Google Sheets.
2. In Sheets, open Extensions > Apps Script and paste `GoogleAppsScript-Catalog.gs`.
3. Deploy as a Web app (execute as you; accessible to anyone). **The script is read-only and only publishes product catalog fields**. Never add customer data or secrets to its output.
4. In Cloudflare Worker settings, add environment variable `CATALOG_SCRIPT_URL` with the deployed Apps Script `/exec` URL. Prefer a Worker secret if you don't want the URL visible in dashboard configuration. Redeploy if required.
5. The website uses `/api/catalog`, so the browser never needs to fetch Google Apps Script directly. Public catalog changes refresh after caching delays.

## Not yet live
- Retail checkout **does not charge cards**. Delivery orders are **not** charged before your confirmation and final quote.
- Wholesale quotes and recurring requests are drafts only; they are not sent or stored.
- No accounts, reviews submission, automatic inventory deductions, paid invoices, or order confirmations.
- A production backend must authenticate Google Sheets writes, validate prices, reserve inventory, process verified payment webhooks, handle idempotency, and protect customer data. Never expose credentials in `public/` or GitHub.
- Review taxes, return policies, pickup arrangements, product photos, and real prices before launch.

## Files
- `public/`: storefront and assets
- `src/worker.js`: public catalog proxy and health endpoint
- `wrangler.jsonc`: Cloudflare Workers configuration
- `GoogleAppsScript-Catalog.gs`: read-only Apps Script for Google Sheets
- `.xlsx`: business management workbook
