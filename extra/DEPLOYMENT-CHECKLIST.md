# Easy Connect Malaysia Deployment Checklist

Upload these public website items to Hostinger `public_html`:

- `.htaccess`
- `index.html`
- `css/`
- `js/`
- `images/`
- `contact/`
- `products/`
- `solutions/`
- `resources/`
- `privacy-policy/`
- `terms-and-conditions/`
- `refurbishment-policy/`
- `sitemap.xml`
- `robots.txt`
- `llm.txt`

Do not upload these internal development and review files:

- `audit-render/`
- `confirmations-render/`
- `site-qa/`
- `audit-comments.json`
- `audit-comments-summary.txt`
- `audit-document-text.txt`
- `content-update-audit.docx`
- `EasyConnect-Pending-Confirmations.docx`
- `build-confirmations-doc.py`
- `node_modules/`
- `.agents/`
- `.claude/`

After upload:

1. Confirm `.htaccess` is visible in Hostinger File Manager and was uploaded.
2. Purge Hostinger/LiteSpeed cache.
3. Open the website in a private browser window.
4. Test `/`, `/about`, `/products`, `/solutions`, `/resources` and `/contact` directly.
5. Submit one contact-form test and confirm it reaches `info@easyconnect.my`.
6. Verify `https://easyconnect.my/sitemap.xml`, `robots.txt` and `llm.txt` load successfully.
