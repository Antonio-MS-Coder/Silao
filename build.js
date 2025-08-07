/**
 * Plaza Real Silao - Build Script
 * This script helps automate the refactoring process
 * Run with: node build.js
 */

const fs = require('fs').promises;

// Configuration
const config = {
    htmlFiles: [
        'index.html',
        'tiendas/index.html',
        'tiendas/detalle.html',
        'espacios/index.html',
        'eventos/index.html',
        'faq/index.html',
        '404.html'
    ],
    componentsScript: '<script src="/js/components.js"></script>',
    baseUrl: 'https://antonio-ms-coder.github.io/Silao'
};

// Template for simplified HTML structure
const htmlTemplate = (title, description, content, pageSpecificScripts = '') => `<!DOCTYPE html>
<html lang="es-MX">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    
    <!-- SEO Meta Tags -->
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${config.baseUrl}/">
    <meta property="og:type" content="website">
    
    <!-- Preconnect for Performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@600;700&display=swap" rel="stylesheet">
    
    <!-- Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    <!-- Styles -->
    <link rel="stylesheet" href="/css/styles.css">
    
    <!-- PWA -->
    <link rel="manifest" href="/manifest.json">
</head>
<body>
    <!-- Navigation (injected by components.js) -->
    <header class="header" id="header"></header>
    
    <!-- Main Content -->
    <main id="main">
        ${content}
    </main>
    
    <!-- Footer (injected by components.js) -->
    <footer class="footer"></footer>
    
    <!-- Back to Top Button -->
    <button id="backToTop" class="back-to-top" aria-label="Volver arriba">
        <i class="fas fa-chevron-up"></i>
    </button>
    
    <!-- Scripts -->
    <script src="/js/components.js"></script>
    <script src="/js/script.js"></script>
    ${pageSpecificScripts}
</body>
</html>`;

// Extract main content from existing HTML files
async function extractMainContent(filePath) {
    try {
        const html = await fs.readFile(filePath, 'utf-8');
        
        // Extract content between <main> tags
        const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
        if (mainMatch) {
            return mainMatch[1].trim();
        }
        
        return null;
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error.message);
        return null;
    }
}

// Extract metadata from existing HTML
async function extractMetadata(filePath) {
    try {
        const html = await fs.readFile(filePath, 'utf-8');
        
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        const descMatch = html.match(/<meta name="description" content="(.*?)"/i);
        
        return {
            title: titleMatch ? titleMatch[1] : 'Plaza Real Silao',
            description: descMatch ? descMatch[1] : 'Centro comercial en Silao de la Victoria'
        };
    } catch (error) {
        console.error(`Error extracting metadata from ${filePath}:`, error.message);
        return {
            title: 'Plaza Real Silao',
            description: 'Centro comercial en Silao de la Victoria'
        };
    }
}

// Get page-specific scripts
function getPageScripts(filePath) {
    const scripts = {
        'index.html': '<script src="/js/home.js"></script>',
        'tiendas/index.html': '<script src="/js/stores.js"></script>',
        'tiendas/detalle.html': '<script src="/js/store-detail.js"></script>',
        'espacios/index.html': '<script src="/js/espacios.js"></script>',
        'eventos/index.html': '<script src="/js/eventos.js"></script>',
        'faq/index.html': '<script src="/js/faq.js"></script>'
    };
    
    return scripts[filePath] || '';
}

// Create backup of original files
async function createBackup(filePath) {
    try {
        const backupPath = filePath.replace('.html', '.backup.html');
        const content = await fs.readFile(filePath, 'utf-8');
        await fs.writeFile(backupPath, content);
        console.log(`✓ Backup created: ${backupPath}`);
    } catch (error) {
        console.error(`✗ Backup failed for ${filePath}:`, error.message);
    }
}

// Refactor HTML file to use components
async function refactorHTMLFile(filePath) {
    console.log(`Processing ${filePath}...`);
    
    // Create backup first
    await createBackup(filePath);
    
    // Extract content and metadata
    const mainContent = await extractMainContent(filePath);
    const metadata = await extractMetadata(filePath);
    const pageScripts = getPageScripts(filePath);
    
    if (!mainContent) {
        console.log(`✗ Could not extract main content from ${filePath}`);
        return;
    }
    
    // Generate new HTML
    const newHTML = htmlTemplate(
        metadata.title,
        metadata.description,
        mainContent,
        pageScripts
    );
    
    // Write refactored file
    try {
        await fs.writeFile(filePath, newHTML);
        console.log(`✓ Refactored: ${filePath}`);
    } catch (error) {
        console.error(`✗ Failed to write ${filePath}:`, error.message);
    }
}

// Main build process
async function build() {
    console.log('Starting Plaza Real Silao Build Process...\n');
    console.log('This will refactor all HTML files to use shared components.\n');
    
    // Process each HTML file
    for (const file of config.htmlFiles) {
        await refactorHTMLFile(file);
    }
    
    console.log('\n✓ Build process complete!');
    console.log('\nNext steps:');
    console.log('1. Test all pages to ensure functionality');
    console.log('2. Remove backup files once verified');
    console.log('3. Commit changes to git');
}

// Run build if executed directly
if (require.main === module) {
    build().catch(console.error);
}

module.exports = { build, refactorHTMLFile };