# Plaza Real Silao - Architecture Documentation

## Current Architecture Status

The Plaza Real Silao website is currently undergoing a strategic refactoring from a single-page application to a properly structured multi-page architecture.

### Transition Timeline
- **Phase 1 (Completed)**: Initial single-page website
- **Phase 2 (Completed)**: Multi-page structure with dynamic content
- **Phase 3 (In Progress)**: Code optimization and component reusability
- **Phase 4 (Planned)**: Build process and performance optimization

## Project Structure

```
/Plaza-Real-Silao/
├── index.html                 # Homepage
├── 404.html                   # Error page
├── manifest.json              # PWA manifest
├── sw.js                      # Service Worker
├── sitemap.xml               # SEO sitemap
├── robots.txt                # Crawler rules
│
├── /css/                     # Stylesheets
│   ├── styles.css           # Main styles (1,828 lines - to be split)
│   ├── critical.css         # Critical above-fold CSS
│   ├── espacios.css         # Spaces page styles
│   ├── eventos.css          # Events page styles
│   └── faq.css              # FAQ page styles
│
├── /js/                      # JavaScript files
│   ├── components.js        # Shared navigation/footer components
│   ├── script.js            # Core functionality
│   ├── home.js              # Homepage specific
│   ├── stores.js            # Store listing functionality
│   ├── store-detail.js     # Individual store pages
│   ├── espacios.js          # Spaces functionality
│   ├── eventos.js           # Events functionality
│   └── faq.js               # FAQ functionality
│
├── /data/                    # Data files
│   └── stores.json          # Store information database
│
├── /images/                  # Image assets
│   └── /stores/             # Store images (to be added)
│
├── /tiendas/                # Stores section
│   ├── index.html           # Store listing page
│   └── detalle.html         # Store detail template
│
├── /espacios/               # Available spaces section
│   └── index.html
│
├── /eventos/                # Events section
│   └── index.html
│
└── /faq/                    # FAQ section
    └── index.html
```

## Technical Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript (no frameworks)
- **Hosting**: GitHub Pages (static hosting)
- **PWA**: Service Worker with offline capability
- **Forms**: FormSubmit integration (no backend required)
- **SEO**: Structured data, XML sitemap, meta tags
- **Analytics**: Ready for Google Analytics integration

## Key Features

### Current Implementation
- ✅ Multi-page architecture
- ✅ Dynamic store listings from JSON
- ✅ Progressive Web App capabilities
- ✅ SEO optimization
- ✅ Responsive design
- ✅ Contact forms
- ✅ Event calendar
- ✅ FAQ system

### Refactoring in Progress
- 🔄 Component-based architecture
- 🔄 Code deduplication (85% redundancy identified)
- 🔄 Performance optimization
- 🔄 Build process setup

## Known Issues & Technical Debt

### Critical (Fixed)
- ✅ ~~Duplicate service worker registration~~
- ✅ ~~Navigation path inconsistencies~~

### High Priority (In Progress)
- 🔄 HTML duplication across pages (header/footer in 6 files)
- 🔄 Monolithic CSS file (1,828 lines)
- 🔄 Performance bottlenecks from DOM queries

### Medium Priority
- ⏳ No build process for minification
- ⏳ Missing image lazy loading
- ⏳ Unoptimized font loading

## Refactoring Strategy

### Phase 1: Foundation (Current)
1. Remove duplicate code
2. Create shared components
3. Fix navigation consistency
4. Implement critical CSS

### Phase 2: Architecture (Next)
1. Implement static site generator
2. Split CSS into modules
3. Optimize JavaScript bundles
4. Add build process

### Phase 3: Enhancement (Future)
1. Add content management system
2. Implement advanced caching
3. Add performance monitoring
4. Create design system

## Performance Metrics

### Current Performance
- **Lighthouse Score**: ~75/100
- **First Contentful Paint**: ~2.1s
- **Time to Interactive**: ~3.5s
- **Bundle Size**: ~450KB (uncompressed)

### Target Performance
- **Lighthouse Score**: >90/100
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <2.5s
- **Bundle Size**: <200KB (compressed)

## Development Guidelines

### Code Standards
- Use semantic HTML5 elements
- Follow BEM naming convention for CSS
- Keep JavaScript modular and reusable
- Maintain accessibility (WCAG 2.1 AA)

### Git Workflow
1. Create feature branch from main
2. Make incremental commits
3. Test on all target browsers
4. Create pull request with description
5. Merge after review

### Testing Checklist
- [ ] Desktop browsers (Chrome, Firefox, Safari, Edge)
- [ ] Mobile browsers (iOS Safari, Chrome Android)
- [ ] Lighthouse audit >90
- [ ] Forms submission working
- [ ] PWA installation working
- [ ] Offline functionality

## Deployment

### GitHub Pages Setup
1. Push to main branch
2. GitHub Actions automatically deploys
3. Available at: https://antonio-ms-coder.github.io/Silao/

### Environment Variables
- No environment variables required
- All configuration in manifest.json and data files

## Future Enhancements

### Short Term (1-2 months)
- Implement build process with webpack/vite
- Add image optimization pipeline
- Create component library
- Add unit tests

### Long Term (3-6 months)
- Migrate to Next.js or Astro for better DX
- Implement CMS (Strapi/Contentful)
- Add e-commerce capabilities
- Create mobile app with React Native

## Contact & Support

**Repository**: https://github.com/Antonio-MS-Coder/Silao
**Live Site**: https://antonio-ms-coder.github.io/Silao/

For questions or contributions, please open an issue on GitHub.

---

*Last Updated: December 2024*
*Version: 2.0.0 (Post-refactoring)*