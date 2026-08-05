/**
 * bangjeje.dev — Production SEO, OpenGraph & JSON-LD Structured Data Engine (Sprint 6)
 * Generates standards-compliant metadata for Google Search, Facebook, LinkedIn, WhatsApp, X (Twitter), and Threads.
 * Zero SEO AI scoring or bloat — strictly focused on technical discovery, crawl efficiency, and rich social preview cards.
 */

class BangjejeSEOEngine {
    constructor() {
        this.defaultImage = 'https://cdn.bangjeje.dev/vault/COTIT_Enterprise_Hero_V2.webp';
        this.defaultImageAlt = 'bangjeje.dev Executive Systems Architecture & Editorial OS';
        this.canonicalDomain = 'https://bangjeje.dev';
        this.authorProfile = {
            name: 'bangjeje',
            title: 'Principal Architect & Founder',
            url: `${this.canonicalDomain}/pages/about.html`,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            sameAs: [
                'https://github.com/bangjeje-dev',
                'https://twitter.com/bangjeje',
                'https://linkedin.com/in/bangjeje'
            ]
        };
        this.orgProfile = {
            name: 'bangjeje.dev',
            url: this.canonicalDomain,
            logo: 'https://cdn.bangjeje.dev/bangjejedev.svg'
        };
        
        window.BangjejeSEO = this;
    }

    /**
     * Injects complete SEO, OpenGraph, Twitter Cards, and JSON-LD schema into document head.
     * @param {Object} article - Standard Studio V2 article payload
     */
    injectArticleSEO(article) {
        if (!article) return;

        const slug = article.slug || 'untitled-story';
        const title = article.title || 'Executive Architectural Article';
        const description = article.subtitle || article.seo?.description || 'Explore enterprise software architecture and composable edge systems.';
        const canonicalUrl = `${this.canonicalDomain}/articles/${slug}.html`;
        const imageUrl = article.cover?.url || article.featuredImage?.url || this.defaultImage;
        const imageAlt = article.cover?.alt || article.featuredImage?.alt || title || this.defaultImageAlt;
        const pubDate = article.publishedAt ? new Date(article.publishedAt).toISOString() : new Date().toISOString();
        const modDate = article.updatedAt ? new Date(article.updatedAt).toISOString() : pubDate;
        const primaryCategory = (article.categories && article.categories[0]) || 'Engineering';
        const tags = article.tags || ['Studio V2', 'Cloud Architecture'];

        // 1. STANDARD METADATA & ROBOTS DIRECTIVES
        document.title = `${title} | bangjeje.dev`;
        this.setMetaTag('name', 'description', description);
        this.setMetaTag('name', 'author', this.authorProfile.name);
        this.setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
        this.setLinkTag('canonical', canonicalUrl);

        // 2. OPEN GRAPH CARDS (Facebook, LinkedIn, WhatsApp)
        this.setMetaTag('property', 'og:site_name', 'bangjeje.dev');
        this.setMetaTag('property', 'og:type', 'article');
        this.setMetaTag('property', 'og:title', title);
        this.setMetaTag('property', 'og:description', description);
        this.setMetaTag('property', 'og:url', canonicalUrl);
        this.setMetaTag('property', 'og:image', imageUrl);
        this.setMetaTag('property', 'og:image:secure_url', imageUrl);
        this.setMetaTag('property', 'og:image:alt', imageAlt);
        this.setMetaTag('property', 'og:image:width', '1440');
        this.setMetaTag('property', 'og:image:height', '900');
        this.setMetaTag('property', 'article:published_time', pubDate);
        this.setMetaTag('property', 'article:modified_time', modDate);
        this.setMetaTag('property', 'article:author', this.authorProfile.url);
        this.setMetaTag('property', 'article:section', primaryCategory);
        
        // Remove existing article:tag duplicates then inject active tags
        document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());
        tags.forEach(t => {
            const tagEl = document.createElement('meta');
            tagEl.setAttribute('property', 'article:tag');
            tagEl.setAttribute('content', t);
            document.head.appendChild(tagEl);
        });

        // 3. X (TWITTER) & THREADS SOCIAL CARDS
        this.setMetaTag('name', 'twitter:card', 'summary_large_image');
        this.setMetaTag('name', 'twitter:site', '@bangjejedev');
        this.setMetaTag('name', 'twitter:creator', '@bangjeje');
        this.setMetaTag('name', 'twitter:title', title);
        this.setMetaTag('name', 'twitter:description', description);
        this.setMetaTag('name', 'twitter:image', imageUrl);
        this.setMetaTag('name', 'twitter:image:alt', imageAlt);

        // 4. GOOGLE JSON-LD STRUCTURED DATA SCHEMA
        const wordCount = article.wordCount || 1000;
        const readMinNum = parseInt((article.readingTime || '5').replace(/\D/g, ''), 10) || 5;
        const isoDuration = `PT${readMinNum}M`; // e.g., PT6M for 6 minutes

        const jsonLdPayload = {
            "@context": "https://schema.org",
            "@graph": [
                // (A) Organization Schema
                {
                    "@type": "Organization",
                    "@id": `${this.canonicalDomain}/#organization`,
                    "name": this.orgProfile.name,
                    "url": this.orgProfile.url,
                    "logo": {
                        "@type": "ImageObject",
                        "url": this.orgProfile.logo
                    },
                    "sameAs": this.authorProfile.sameAs
                },
                // (B) Author / Person Schema
                {
                    "@type": "Person",
                    "@id": `${this.canonicalDomain}/#author`,
                    "name": this.authorProfile.name,
                    "jobTitle": this.authorProfile.title,
                    "url": this.authorProfile.url,
                    "image": {
                        "@type": "ImageObject",
                        "url": this.authorProfile.avatar
                    },
                    "sameAs": this.authorProfile.sameAs
                },
                // (C) Article Schema (NewsArticle & TechArticle compliance)
                {
                    "@type": "Article",
                    "@id": `${canonicalUrl}#article`,
                    "isPartOf": {
                        "@type": "WebPage",
                        "@id": canonicalUrl
                    },
                    "headline": title,
                    "description": description,
                    "inLanguage": "en-US",
                    "mainEntityOfPage": canonicalUrl,
                    "image": [imageUrl],
                    "datePublished": pubDate,
                    "dateModified": modDate,
                    "wordCount": wordCount,
                    "timeRequired": isoDuration,
                    "keywords": tags.join(', '),
                    "articleSection": primaryCategory,
                    "author": {
                        "@id": `${this.canonicalDomain}/#author`
                    },
                    "publisher": {
                        "@id": `${this.canonicalDomain}/#organization`
                    }
                },
                // (D) Breadcrumb Navigation Schema
                {
                    "@type": "BreadcrumbList",
                    "@id": `${canonicalUrl}#breadcrumb`,
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": `${this.canonicalDomain}/index.html`
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Knowledge Hub",
                            "item": `${this.canonicalDomain}/articles.html`
                        },
                        {
                            "@type": "ListItem",
                            "position": 3,
                            "name": primaryCategory,
                            "item": `${this.canonicalDomain}/articles.html?category=${encodeURIComponent(primaryCategory)}`
                        },
                        {
                            "@type": "ListItem",
                            "position": 4,
                            "name": title,
                            "item": canonicalUrl
                        }
                    ]
                }
            ]
        };

        this.injectJSONLD(jsonLdPayload);
        console.log(`📡 Sprint 6 SEO Foundation: Metadata, OpenGraph cards, and JSON-LD schema injected for "${slug}"`);
    }

    /**
     * Helper to set or create meta tags cleanly
     */
    setMetaTag(attrName, attrValue, content) {
        if (!content) return;
        let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
        if (!el) {
            el = document.createElement('meta');
            el.setAttribute(attrName, attrValue);
            document.head.appendChild(el);
        }
        el.setAttribute('content', content);
    }

    /**
     * Helper to set or create link tags (canonical, alternate)
     */
    setLinkTag(rel, href) {
        if (!href) return;
        let el = document.querySelector(`link[rel="${rel}"]`);
        if (!el) {
            el = document.createElement('link');
            el.setAttribute('rel', rel);
            document.head.appendChild(el);
        }
        el.setAttribute('href', href);
    }

    /**
     * Injects formatted JSON-LD `<script type="application/ld+json">` tag into document head
     */
    injectJSONLD(payload) {
        const id = 'bangjeje-seo-jsonld';
        let scriptEl = document.getElementById(id);
        if (!scriptEl) {
            scriptEl = document.createElement('script');
            scriptEl.setAttribute('type', 'application/ld+json');
            scriptEl.setAttribute('id', id);
            document.head.appendChild(scriptEl);
        }
        scriptEl.textContent = JSON.stringify(payload, null, 2);
    }
}

// Initialize SEO singleton immediately
new BangjejeSEOEngine();
