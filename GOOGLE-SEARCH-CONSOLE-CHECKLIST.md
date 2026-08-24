# Google Search Console — Checklist (www.nexyyra.com)

1. Add property `https://www.nexyyra.com` (URL-prefix) — verify via HTML meta tag: set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel env, redeploy (the site renders the tag automatically). A Domain property (DNS TXT) additionally covers apex + subdomains — preferred if you control DNS.
2. Submit sitemap: `https://www.nexyyra.com/sitemap.xml` (index — child sitemaps are discovered from it).
3. URL-inspect and Request Indexing, in this order: `/` → `/about` → `/company` → `/services` → `/contact` → `/locations/pune` → `/testimonials`.
4. Pages report: confirm no unexpected "noindex", "Duplicate without user-selected canonical", or "Crawled — currently not indexed" on key pages.
5. Confirm canonical Google selects = `https://www.nexyyra.com/...` (www, https) for each inspected page.
6. Enhancements: check Structured data (Organization/LocalBusiness/FAQ/Breadcrumb should validate; zero errors expected).
7. Core Web Vitals: watch mobile LCP/INP after each deploy.
8. Weekly for the first month: Performance report → filter query contains "nexyyra" → track impressions/clicks and whether "nexura" substitution appears in queries.

Do not mark any of this complete until done in the actual GSC account.
