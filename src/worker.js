// Public read-only catalog proxy. Never expose a private workbook or write credentials.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/health') {
      return Response.json({ ok: true, service: 'Texas Home & Business Essentials 2.0' }, { headers: { 'Cache-Control': 'no-store' } });
    }
    if (url.pathname === '/api/catalog') {
      if (request.method !== 'GET') return new Response('Method not allowed', { status: 405 });
      if (!env.CATALOG_SCRIPT_URL || !/^https:\/\/script\.google\.com\/macros\/s\//.test(env.CATALOG_SCRIPT_URL)) {
        return Response.json({ error: 'Catalog not connected' }, { status: 503 });
      }
      try {
        const upstream = await fetch(env.CATALOG_SCRIPT_URL, { redirect: 'follow', cf: { cacheTtl: 60, cacheEverything: true } });
        if (!upstream.ok) throw new Error('Catalog source unavailable');
        const payload = await upstream.json();
        if (!Array.isArray(payload.products) || !Array.isArray(payload.variants)) throw new Error('Invalid catalog data');
        // Whitelist public fields: never proxy arbitrary sheet data.
        const products = payload.products.map(p => ({
          sku: String(p.sku ?? ''), name: String(p.name ?? ''), nameEs: String(p.nameEs ?? ''),
          category: String(p.category ?? ''), description: String(p.description ?? ''),
          descriptionEs: String(p.descriptionEs ?? ''), active: p.active,
          images: Array.isArray(p.images) ? p.images.filter(v => typeof v === 'string' && /^https:\/\//.test(v)).slice(0, 5) : [],
          related: Array.isArray(p.related) ? p.related.slice(0, 12) : []
        }));
        const variants = payload.variants.map(v => ({
          sku: String(v.sku ?? ''), productSku: String(v.productSku ?? ''), label: String(v.label ?? ''),
          units: Number(v.units) || 1, unitType: String(v.unitType ?? 'units'),
          price: Number(v.price) || 0, stock: v.stock ?? null, active: v.active,
          tier1Qty: v.tier1Qty ?? null, tier1Price: v.tier1Price ?? null,
          tier2Qty: v.tier2Qty ?? null, tier2Price: v.tier2Price ?? null
        }));
        return Response.json({ products, variants }, { headers: { 'Cache-Control': 'public, max-age=60' } });
      } catch (_) {
        return Response.json({ error: 'Catalog temporarily unavailable' }, { status: 502 });
      }
    }
    return env.ASSETS.fetch(request);
  }
};
