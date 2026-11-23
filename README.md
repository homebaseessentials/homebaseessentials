# HomeBase Essentials — Website

Static bilingual storefront for GitHub Pages.

## Publish
1. Create a PUBLIC GitHub repository named `homebase-essentials`.
2. Upload `index.html` and the entire `assets` folder to the repository root.
3. Commit changes.
4. Settings → Pages → Build and deployment → Deploy from a branch → `main` → `/ (root)` → Save.
5. Visit `https://YOUR-USERNAME.github.io/homebase-essentials/` after deployment.

## Important before launch
- Product listings and prices are SAMPLE placeholders. Update inventory, prices and availability in the `items` array inside `index.html`.
- The cart is local to the customer's browser and does NOT place an order. The Copy order request button generates text for manual sharing.
- The quote form prepares text but does NOT transmit it. Set up a real inbox/form service before advertising that submissions are received.
- Delivery, service area, minimum order and delivery fees need confirmation.
- No payment processing is configured. Do not request payment-card details via the static website.
- Site includes English/Spanish, consumer/business tabs, cart with local storage, pickup/delivery selection and business inquiry form.
