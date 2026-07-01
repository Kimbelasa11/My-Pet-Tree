# My Pet Tree Website

A professional tree planting, landscaping, and environmental conservation business website built with plain HTML, CSS, and JavaScript (plus responsive grid utilities).

**Live site features:** Home, About Us, Products, and Services — all mobile-responsive with basic on-page SEO and branded asset placeholders for tree planting and green services.

## 📁 Project Structure

```
urban-roots-site/
├── index.html              # Home page
├── about.html              # About Us page
├── products.html           # Products showcase with filters
├── services.html           # Services and pricing packages
├── assets/
│   ├── styles.css          # Full design system (colors, typography, components)
│   └── main.js             # Navigation toggle, scroll reveal, gallery filters, form handling
└── README.md               # This file
```

## 🚀 Getting Started

### Option 1: Live Server (Recommended for Development)

1. **Open the folder in VS Code:**
   - `File → Open Folder…` and select the `urban-roots-site` folder

2. **Install Live Server extension:**
   - Open Extensions panel: `Ctrl/Cmd+Shift+X`
   - Search for "Live Server" (by Ritwick Dey)
   - Click Install

3. **Launch the site:**
   - Right-click `index.html` in the file explorer
   - Select "Open with Live Server"
   - Your browser will open the site with **auto-reload on save**

### Option 2: Simple File Open

- Double-click `index.html` to open it directly in your browser
- Note: Changes won't auto-reload; refresh the page manually after edits

### Option 3: Deploy to the Web

See **Deployment** section below.

---

## 🎨 Design System

### Color Palette

- **Pine Green** (`#2d5016`) — Primary heading color, navigation accents
- **Kraft Tan** (`#d4c5b0`) — Accent borders, backgrounds, signature hanging tag
- **Marigold Gold** (`#d4a234`) — Buttons, highlights, active states
- **Clay Terracotta** (`#a85e47`) — Secondary accents, tree trunks, labels
- **Light Background** (`#faf8f5`) — Off-white/cream sections

### Typography

All fonts are loaded from **Google Fonts** via CDN (no installation needed):

- **Space Grotesk** (headings, nav) — Modern, clean sans-serif
- **Source Serif 4** (body copy) — Professional serif for readability
- **Space Mono** (labels, data) — Monospace for tags and metadata

### Signature Component: Hanging Tags

Content is often presented on illustrated kraft-colored tags with a twine hole at the top, echoing literal plant tags used for tracking plantings. CSS handles the visual design; see `.tag` class in `styles.css`.

### Responsive Breakpoint

- **Below 780px:** Single-column layout, mobile navigation menu toggle
- **Above 780px:** Multi-column grids, full horizontal navigation

---

## 🛠️ Features & Interactivity

### Navigation Toggle (Mobile Menu)

- On small screens, a hamburger menu appears
- Click to toggle the navigation menu open/closed
- Menu closes automatically when a link is clicked
- Smooth animations via CSS transitions
- **Updated navigation structure:** Home, About Us, Products, Services

**Code:** `assets/main.js` — `DOMContentLoaded` event listener

### Scroll Reveal

- Elements with the `.reveal` class fade in and slide up as they scroll into view
- Improves perceived performance and engagement
- Uses `IntersectionObserver` for efficiency

**Code:** `assets/main.js` — `revealOnScroll()` function

### Gallery Filters

On the `products.html` page:
- Filter buttons: All Products, Food & Treats, Toys, Grooming, Health & Wellness
- Click a button to show only items in that category
- Uses `data-category` attributes on gallery items

**Code:** `assets/main.js` — Gallery filter event listeners

### Form Handling (Service Request)

On the `services.html` page:
- Form collects name, email, phone, pet name, service type, and message
- On submit: displays a success message and resets the form after 5 seconds
- Currently logs to browser console; see form code for integration instructions

**Status:** Form is **not yet wired to a backend**. To make it functional:

#### Option A: Formspree (Recommended for simple projects)

1. Go to [formspree.io](https://formspree.io)
2. Create a free account and set up a form
3. Copy your form endpoint ID
4. In `assets/main.js`, uncomment the fetch code and replace `YOUR_FORM_ID`

#### Option B: Netlify Forms

If hosting on Netlify:
1. Add `netlify` attribute to the form
2. Deploy to Netlify; form submissions auto-go to your dashboard

#### Option C: Custom Backend

Wire to your own email service or CMS endpoint using the fetch example in the code.

---

## 📝 Content: Real vs. Placeholder

### What's Ready to Use

- **Page structure & layout** — Fully functional, mobile-responsive
- **Copy & messaging** — Mission, values, services designed as editable first draft
- **Navigation & interactivity** — All working (nav toggle, scroll reveal, form submit, product filters)
- **Design system** — Color palette, typography, components all functional

### What Needs Client Input

- **Branding assets** — Company logo, background images, brand colors, and typography
- **Product information** — Product names, descriptions, images, pricing, and specifications
- **Service details** — Service names, descriptions, pricing, and benefits
- **Company copy** — Mission statement, About Us content, testimonials, and descriptions
- **Contact information** — Company email, phone, address, and social media links
- **Statistics** — Customer numbers, product inventory, satisfaction ratings (placeholders provided)

### **IMPORTANT: Branding Asset Placeholders**

Throughout the website, you'll find clearly marked placeholders for branding assets:

```html
<!-- BRANDING PLACEHOLDER: Replace SVG with company logo -->
<!-- BRANDING PLACEHOLDER: Update meta description and keywords -->
<!-- BRANDING PLACEHOLDER: Replace with actual contact info -->
<!-- BRANDING PLACEHOLDER: Update company tagline -->
<!-- BRANDING PLACEHOLDER: Update page headline and description -->
```

**To customize your site:**

1. **Search for `BRANDING PLACEHOLDER`** in any `.html` file to find all customization points
2. **Update company logos** — Replace SVG placeholders with your actual logo
3. **Update colors** — Modify CSS variables in `assets/styles.css` under `:root`
4. **Update typography** — Change font imports in `assets/styles.css`
5. **Update copy** — Replace all placeholder text with your actual content
6. **Add images** — Replace SVG placeholders with real photography

### Images & Media

Currently:
- All visuals are **inline SVG placeholders** (product icons, service illustrations, etc.)
- No image files shipped with the site

**To add real photography:**

1. Save your photos to `assets/images/` (create the folder)
2. In HTML files, replace SVG with `<img>` tags:
   ```html
   <!-- Before (placeholder SVG) -->
   <div class="gallery-media">
     <svg>...</svg>
   </div>
   
   <!-- After (real image) -->
   <div class="gallery-media">
     <img src="assets/images/product-photo.jpg" alt="Product name">
   </div>
   ```

3. Recommend image sizes:
   - Product gallery: **400 × 250px** or similar 16:9 aspect ratio
   - Hero banners: **1200 × 600px** or wider
   - Compressed/optimized for web (use [tinypng.com](https://tinypng.com) or similar)

---

## 🔍 SEO Basics

Each page includes:

- **Page title** (unique per page, in `<title>` tag)
- **Meta description** (in `<meta name="description">`)
- **Semantic HTML** (`<header>`, `<nav>`, `<section>`, `<h1>`, etc.)
- **Heading hierarchy** (only one `<h1>` per page, then `<h2>`, `<h3>`, etc.)
- **Alt text** (ready for you to add to images)

**To improve further:**

- Add `<meta name="keywords">` if targeting specific search terms
- Ensure all images have descriptive `alt` attributes
- Use descriptive link text (avoid "click here")
- Keep page titles under 60 characters
- Keep meta descriptions 150–160 characters

---

## 📦 No Build Step Required

This is **static HTML/CSS/JavaScript** — no npm, no build tools, no dependencies. It works:
- ✅ Opened directly in a browser
- ✅ On Live Server for development
- ✅ On any static web host (Netlify, Vercel, GitHub Pages, shared hosting, etc.)

---

## 🌐 Deployment Options

### Option 1: Netlify (Recommended)

1. Push your files to a GitHub repo
2. Go to [netlify.com](https://netlify.com), click "New site from Git"
3. Select your repo, click Deploy
4. Site goes live at a Netlify URL (or connect your custom domain)

**Bonus:** Netlify Forms support (if you set up form handling)

### Option 2: Vercel

Similar to Netlify:
1. Push to GitHub
2. Import at [vercel.com](https://vercel.com)
3. Deploy instantly

### Option 3: GitHub Pages

1. Push to a GitHub repo named `your-username.github.io` (or any repo)
2. Go to repo Settings → Pages
3. Select "Deploy from a branch" and choose main/master
4. Site goes live at `your-username.github.io`

### Option 4: Traditional Shared Hosting

As mentioned in the proposal, if using a shared hosting plan:
1. Use FTP/SFTP to upload all files to your web root
2. Ensure `index.html` is in the root directory
3. Site is live at your domain

---

## ✏️ Editing the Site

### Quick Edits

**Update contact info:**
- Search for `info@urbanroots.ca` and `(416) 555-0123` throughout HTML files
- Replace with real contact details

**Update stats:**
- Search for numbers like `4,850+`, `127`, `8,400+` in HTML files
- Replace with verified figures

**Change copy:**
- Edit any `<h1>`, `<h2>`, `<p>` text directly in the HTML files
- Save and refresh (or Live Server auto-reloads)

**Add/remove pages:**
- Duplicate an existing `.html` file
- Update the `<title>`, content, and navigation links
- Add to the `<nav>` in header/footer of all pages

### Styling Changes

- Edit `assets/styles.css` for color, typography, layout adjustments
- CSS variables at the top (`:root`) control the color palette — change one value to update site-wide
- Live Server will auto-reload with changes

### Functionality Changes

- Edit `assets/main.js` for navigation, form, gallery, scroll behavior
- See comments in the code for each feature's section

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Live Server not working" | Make sure the extension is installed. In VS Code: `Ctrl/Cmd+Shift+X` → search "Live Server" → Install |
| "Forms not submitting" | Forms currently don't send anywhere. Follow **Form Handling** section above to wire to Formspree or your backend |
| "Mobile menu not closing" | Clear browser cache, reload. If persists, check `assets/main.js` for JavaScript errors in the console |
| "Images show as broken X" | Ensure image files are in the correct path (e.g., `assets/images/filename.jpg`), and the `src` attribute matches exactly |
| "Fonts look wrong" | Google Fonts loads via CDN. Check internet connection, or download fonts locally and update `@import` in CSS |

---

## 📋 Next Steps (Before Launch)

1. **Update branding assets:**
   - [ ] Replace company logo (search for `BRANDING PLACEHOLDER: Replace SVG with company logo`)
   - [ ] Update color palette in `assets/styles.css` (`:root` CSS variables)
   - [ ] Update typography / fonts as needed
   - [ ] Set background colors and images

2. **Finalize content:**
   - [ ] Replace all placeholder company copy with real content
   - [ ] Add real company mission, values, and About Us information
   - [ ] Replace placeholder product names, descriptions, and pricing
   - [ ] Replace placeholder service details and pricing packages
   - [ ] Update contact info (email, phone, address, social media)
   - [ ] Add real testimonials and customer quotes
   - [ ] Replace placeholder statistics with real data

3. **Add photography:**
   - [ ] Collect photos of products, services, team, or company locations
   - [ ] Optimize images for web (compress, resize to appropriate dimensions)
   - [ ] Replace SVG placeholders with real images

4. **Customize forms:**
   - [ ] Update form fields as needed
   - [ ] Choose form service (Formspree, Netlify, custom backend)
   - [ ] Update form endpoint in `assets/main.js`
   - [ ] Test form submission end-to-end

5. **SEO & Analytics:**
   - [ ] Update all page titles and meta descriptions
   - [ ] Add Google Analytics snippet (if tracking desired)
   - [ ] Update sitemap and robots.txt if needed
   - [ ] Test page titles and meta descriptions in search preview

6. **Testing:**
   - [ ] Test on mobile devices (iPhone, Android)
   - [ ] Test on different browsers (Chrome, Firefox, Safari)
   - [ ] Test all forms and interactive features
   - [ ] Check all links navigate correctly

7. **Deploy:**
   - [ ] Choose hosting (Netlify, Vercel, shared host, etc.)
   - [ ] Configure custom domain if needed
   - [ ] Set up SSL certificate
   - [ ] Go live!

---

## 📞 Support

For questions or updates to this template, refer to the proposal documentation or contact your web developer.

---

**Version:** 1.0  
**Last Updated:** 2026-07-01  
**License:** © 2026 My Pet Tree. All rights reserved.
#   M y - P e t - T r e e  
 