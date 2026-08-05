/**
 * bangjeje.dev — Public Content System & Edge Publishing Engine (Sprint 5)
 * Powering static content delivery, live client-side index searching, categorization, tags, and reader rendering.
 * Bridges Studio V2 Editorial Operating System directly to public Cloudflare Pages infrastructure.
 */

class BangjejePublicArticlesEngine {
    constructor() {
        this.storageKey = 'bangjeje_public_articles_index';
        this.articles = [];
        this.activeCategory = 'All';
        this.activeTag = null;
        this.searchQuery = '';
        this.currentPage = 1;
        this.perPage = 4; // 1 Featured + grid layout paging

        this.init();
    }

    init() {
        this.loadOrSeedIndex();
        window.BangjejePublicArticles = this;
    }

    loadOrSeedIndex() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            try {
                this.articles = JSON.parse(stored);
            } catch (e) {
                console.error('Error parsing stored public articles index:', e);
            }
        }

        // If empty or missing primary benchmark articles, seed premium architectural publications
        if (!this.articles || this.articles.length === 0 || !this.articles.find(a => a.slug === 'why-simplicity-and-speed-always-win-building-studio-v2-with-tiptap')) {
            this.articles = this.getSeedEditorialArticles();
            this.saveIndexToStorage();
        }
    }

    saveIndexToStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.articles));
    }

    // --- SPRINT 5: PREMIUM ARCHITECTURAL SEED CONTENT ---
    getSeedEditorialArticles() {
        return [
            {
                id: 'prod-2026-001',
                title: 'Why Simplicity and Speed Always Win: Building Studio V2 with Tiptap',
                subtitle: 'How we eliminated heavy enterprise CMS bloat by building a custom lightweight Vanilla JavaScript editorial operating system directly integrated with Cloudflare R2 and Edge CDN.',
                slug: 'why-simplicity-and-speed-always-win-building-studio-v2-with-tiptap',
                cover: {
                    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1440&q=80',
                    alt: 'Studio V2 Editorial Workspace Interface Prototype'
                },
                author: {
                    name: 'bangjeje',
                    title: 'Principal Architect & Founder',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                },
                publishedAt: '2026-08-05T09:00:00Z',
                readingTime: '6 Min Read',
                wordCount: 1240,
                categories: ['Engineering', 'Editorial OS', 'Cloud Architecture'],
                tags: ['Tiptap', 'Cloudflare R2', 'TailAdmin', 'Vanilla JS'],
                isFeatured: true,
                content: `
                    <p>Modern enterprise content management systems have fallen into a dangerous trap: catastrophic software bloat. When professional editors and engineering authors assemble to write high-frequency systems documentation or architectural case studies, they are greeted by sluggish interfaces, nested administration forms, and frustrating loading states.</p>
                    <p>In designing <strong>bangjeje.dev Studio V2</strong>, we rejected traditional heavy CMS frameworks entirely. Instead, we turned to the foundational mathematics of modern web application architecture: zero-dependency Vanilla JavaScript ES Modules, a high-performance headless block engine driven by <strong>Tiptap</strong>, and instant global object storage via <strong>Cloudflare R2</strong>.</p>

                    <h2>The Architectural Fallacy of Heavyweight CMS Engines</h2>
                    <p>For over two decades, digital publishing architectures have prioritized administrative database management over the sanctity of the writing experience. When an author is forced to adapt their cognitive rhythm to complex multi-step form submissions just to format a blockquote or embed an architectural system diagram, creative momentum evaporates.</p>
                    <blockquote>
                        "The editor must adapt to the author. The author should never adapt to the editor. Writing always comes first."
                    </blockquote>
                    <p>By shifting from monolithic databases to atomic static content generation, we eliminate entire layers of backend latency. Each document transformation in Studio V2 is processed synchronously in browser runtime, writing directly to decentralized edge nodes.</p>

                    <h2>An Atomized Media Vault with Cloudflare R2</h2>
                    <p>Traditional image upload mechanics disrupt writing immersion. An author clicks an image button, waits for an OS dialog, uploads to a server, waits for image resize pipelines, and finally receives a fragile database reference.</p>
                    <p>In Studio V2 Sprint 2 and Sprint 3, we architected an immutable <strong>Reusable Media Library Vault</strong> linked directly to Cloudflare R2 Edge Buckets via Worker pipelines. Why is this superior?</p>
                    <ul>
                        <li><strong>Cryptographic Deduplication:</strong> Before transmission, client-side SHA-256 hash calculation verifies if an identical binary asset already exists in the R2 object vault, achieving instantaneous zero-byte uploads.</li>
                        <li><strong>Native WebP Transcode Sanctuary:</strong> Media files are automatically delivered as progressive WebP images with WCAG-compliant Alt Text and structured captions permanently bound to document metadata.</li>
                        <li><strong>Single Source of Truth:</strong> Media attachments exist independently of individual blog posts, enabling reusability across articles, enterprise case studies, and corporate capabilities presentations without redundancy.</li>
                    </ul>

                    <h2>The Mathematics of Editorial Typography</h2>
                    <p>Visual excellence is not mere decoration; it is engineered communication efficiency. To maximize reading comfort across multi-thousand-word architectural essays, Studio V2 implements strict ergonomic guidelines:</p>
                    <pre><code class="language-javascript">// Studio V2 Typography Tokens (TailAdmin Heritage)
const editorialTypography = {
    canvasMaxWidth: '768px',      // 65-75 characters per line for optimal scanning
    fontSizePrimary: '20px',      // Enhanced visual comfort on high-DPI displays
    lineHeightBody: '1.8',        // Generous vertical rhythm preventing ocular fatigue
    headingScale: '44px -> 30px'  // Distinct structural visual hierarchy
};</code></pre>
                    <p>When combined with our dark mode glassmorphic reader experience, the public website transforms from a passive blog into a responsive, highly engineered editorial publication.</p>

                    <h2>The Road to Cloudflare Pages Edge Distribution</h2>
                    <p>By pairing Tiptap's structured JSON/HTML output with static compilation, publishing in Studio V2 no longer requires expensive relational databases or PHP runtimes. An author clicks <em>Publish to Edge 🚀</em>, and within sub-second thresholds, Cloudflare Pages synchronizes the static representation globally across 300+ Edge locations.</p>
                `
            },
            {
                id: 'prod-2026-002',
                title: 'The Cost of Monolithic Architecture in 2026: Why Legacy Systems Bleed Revenue',
                subtitle: 'Legacy systems are quietly bleeding enterprise revenue through bloated maintenance cycles and agonizingly slow deployment times. We break down the ROI of migrating to composable edge infrastructure.',
                slug: 'the-cost-of-monolithic-architecture-in-2026',
                cover: {
                    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1440&q=80',
                    alt: 'Enterprise Server Node Architecture Map'
                },
                author: {
                    name: 'bangjeje',
                    title: 'Principal Architect & Founder',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                },
                publishedAt: '2026-07-20T14:30:00Z',
                readingTime: '8 Min Read',
                wordCount: 1620,
                categories: ['Cloud Architecture', 'Engineering'],
                tags: ['Microservices', 'Cloudflare', 'Serverless', 'Architecture'],
                isFeatured: false,
                content: `
                    <p>As enterprise engineering teams face tightening efficiency mandates in 2026, the real hidden cost of technology operations lies inside monolithic applications. What once seemed like a cohesive all-in-one platform inevitably curdles into an untestable, tightly-coupled structural hazard.</p>
                    <p>When a single frontend feature change requires rebuilding an entire monolithic codebase, testing thousands of unrelated integration suites, and orchestrating risky midnight deployment windows, your engineering throughput collapses.</p>

                    <h2>The Financial Decay of Coupling</h2>
                    <p>Consider an enterprise e-commerce or SaaS operation handling high-frequency transaction loads. In a monolithic architecture, a traffic spike on a secondary reporting dashboard can saturate CPU core limits and trigger memory exhaustion across mission-critical checkout pipelines.</p>
                    <blockquote>
                        "Scalability without isolation is merely an expensive illusion. Composable infrastructure ensures that individual system failures remain contained, predictable, and rapidly resolvable."
                    </blockquote>
                    <p>By decoupling core systems into stateless edge micro-workers and independent domain services, global enterprises reduce infrastructure compute bills by an average of 40% while simultaneously increasing release cadence tenfold.</p>
                `
            },
            {
                id: 'prod-2026-003',
                title: 'Designing High-Frequency Executive Dashboards with Glassmorphism and TailAdmin',
                subtitle: 'Discover the design mathematics behind high-contrast dark mode interfaces, HSL color harmony, and micro-animations that turn enterprise software into responsive visual ecosystems.',
                slug: 'designing-high-frequency-executive-dashboards-with-glassmorphism',
                cover: {
                    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1440&q=80',
                    alt: 'Executive Analytics Dashboard Screen with Vibrant Glowing Lime Accents'
                },
                author: {
                    name: 'bangjeje',
                    title: 'Principal Architect & Founder',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                },
                publishedAt: '2026-06-15T11:15:00Z',
                readingTime: '5 Min Read',
                wordCount: 980,
                categories: ['Design Systems', 'Engineering'],
                tags: ['UI/UX', 'TailAdmin', 'Glassmorphism', 'Tailwind'],
                isFeatured: false,
                content: `
                    <p>When executive decision-makers monitor global logistics chains or multi-cloud telemetry networks, visual cognitive clarity directly influences operational reaction time. Traditional enterprise software suffers from flat, generic grey palettes and static table layouts that induce severe mental fatigue.</p>
                    <p>In developing our <strong>TailAdmin-inspired Design System</strong>, we applied advanced color mathematics and layered glassmorphism to generate interfaces that feel immediately alive, highly intuitive, and deeply premium.</p>

                    <h2>The Anatomy of High-Contrast Dark Mode</h2>
                    <p>True dark mode is never simply black text inverted onto a white screen. Using pure `#000000` against pure `#FFFFFF` creates harsh astigmatism glare. Instead, our design architecture implements structured tonal elevation:</p>
                    <ul>
                        <li><strong>Deep Void Background (`#050505`):</strong> Establishes infinite visual depth without optical screen glare.</li>
                        <li><strong>Surface Elevation (`#0D1117` to `#111827`):</strong> Delineates functional card boundaries using subtle translucent backdrop-blur layers (`rgba(255, 255, 255, 0.06)` border strokes).</li>
                        <li><strong>Electric Lime Callouts (`#C3FF00`):</strong> High-visibility focal signaling reserved strictly for interactive execution triggers, active system states, and critical performance indicators.</li>
                    </ul>
                `
            }
        ];
    }

    // --- STATIC CONTENT REGISTER & SPRINT 6 SEO SYNC ---
    registerPublishedArticle(newArticle) {
        this.loadOrSeedIndex();
        
        // Check if updating existing slug
        const existingIdx = this.articles.findIndex(a => a.slug === newArticle.slug);
        if (existingIdx >= 0) {
            this.articles[existingIdx] = { ...this.articles[existingIdx], ...newArticle, publishedAt: new Date().toISOString() };
        } else {
            this.articles.unshift({
                id: `prod-${Date.now()}`,
                publishedAt: new Date().toISOString(),
                ...newArticle
            });
        }

        this.saveIndexToStorage();
        this.generateAndStoreFeeds();
        console.log(`🚀 Successfully published "${newArticle.title}" to Public Static Index & SEO Feeds!`);
    }

    // --- CLIENT-SIDE SEARCH, FILTERS & PAGINATION ---
    setSearchQuery(query) {
        this.searchQuery = (query || '').toLowerCase().trim();
        this.currentPage = 1;
        this.renderArticlesIndex();
    }

    setCategoryFilter(cat) {
        this.activeCategory = cat;
        this.activeTag = null; // Clear active tag when changing primary category
        this.currentPage = 1;
        this.renderArticlesIndex();
    }

    setTagFilter(tag) {
        this.activeTag = this.activeTag === tag ? null : tag; // Toggle tag
        this.currentPage = 1;
        this.renderArticlesIndex();
    }

    getFilteredArticles() {
        return this.articles.filter(article => {
            // Category matches
            const matchCat = this.activeCategory === 'All' || (article.categories && article.categories.includes(this.activeCategory));
            // Tag matches
            const matchTag = !this.activeTag || (article.tags && article.tags.includes(this.activeTag));
            // Search keyword matches
            let matchSearch = true;
            if (this.searchQuery) {
                const searchStr = `${article.title} ${article.subtitle} ${article.categories.join(' ')} ${article.tags.join(' ')} ${article.content}`.toLowerCase();
                matchSearch = searchStr.includes(this.searchQuery);
            }
            return matchCat && matchTag && matchSearch;
        });
    }

    getBySlug(slug) {
        this.loadOrSeedIndex();
        return this.articles.find(a => a.slug === slug) || null;
    }

    getRelatedArticles(currentSlug, maxCount = 3) {
        const current = this.getBySlug(currentSlug);
        if (!current) return [];

        // Score other articles by number of matching categories and tags
        const scored = this.articles
            .filter(a => a.slug !== currentSlug)
            .map(a => {
                let score = 0;
                if (a.categories && current.categories) {
                    a.categories.forEach(c => { if (current.categories.includes(c)) score += 2; });
                }
                if (a.tags && current.tags) {
                    a.tags.forEach(t => { if (current.tags.includes(t)) score += 1; });
                }
                return { article: a, score };
            });

        scored.sort((x, y) => y.score - x.score);
        return scored.slice(0, maxCount).map(item => item.article);
    }

    // --- ARTICLES INDEX UI RENDERER (FOR /articles & /articles.html) ---
    renderArticlesIndex() {
        const container = document.getElementById('articles-index-container');
        if (!container) return;

        const filtered = this.getFilteredArticles();
        const featured = filtered.find(a => a.isFeatured) || filtered[0];
        const nonFeatured = filtered.filter(a => a !== featured);

        // Calculate pagination for non-featured items
        const totalPages = Math.max(1, Math.ceil(nonFeatured.length / (this.perPage - 1)));
        if (this.currentPage > totalPages) this.currentPage = totalPages;
        const startIndex = (this.currentPage - 1) * (this.perPage - 1);
        const paginatedItems = nonFeatured.slice(startIndex, startIndex + (this.perPage - 1));

        // Render Categories Header & Tag Pills
        const catContainer = document.getElementById('categories-tab-bar');
        if (catContainer) {
            const allCats = ['All', ...new Set(this.articles.flatMap(a => a.categories || []))];
            catContainer.innerHTML = allCats.map(cat => {
                const isActive = this.activeCategory === cat;
                return `
                    <button onclick="BangjejePublicArticles.setCategoryFilter('${cat}')" 
                            class="px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all cursor-pointer border ${isActive ? 'bg-[#C3FF00] text-[#050505] border-[#C3FF00] shadow-[0_0_20px_rgba(195,255,0,0.3)]' : 'bg-surface/60 text-textSecondary border-white/10 hover:border-white/30 hover:text-white'}">
                        ${cat}
                    </button>
                `;
            }).join('');
        }

        const tagsContainer = document.getElementById('popular-tags-bar');
        if (tagsContainer) {
            const allTags = [...new Set(this.articles.flatMap(a => a.tags || []))].slice(0, 8);
            tagsContainer.innerHTML = `
                <span class="text-xs font-mono font-bold text-textSecondary uppercase tracking-widest mr-2 flex items-center gap-1.5"><i class="ph ph-tag text-[#C3FF00]"></i> Trending Topics:</span>
                ${allTags.map(tag => {
                    const isActive = this.activeTag === tag;
                    return `
                        <button onclick="BangjejePublicArticles.setTagFilter('${tag}')" 
                                class="px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer border ${isActive ? 'bg-[#C3FF00] text-dark border-[#C3FF00] shadow-[0_0_15px_rgba(195,255,0,0.3)]' : 'bg-black/30 text-textSecondary border-white/10 hover:border-[#C3FF00]/50 hover:text-white'}">
                            #${tag}
                        </button>
                    `;
                }).join('')}
                ${this.activeTag ? `<button onclick="BangjejePublicArticles.setTagFilter(null)" class="text-xs font-mono text-rose-400 hover:text-rose-300 underline ml-2 cursor-pointer">Clear Filter</button>` : ''}
            `;
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="py-24 text-center border border-glass rounded-3xl bg-surface/40 backdrop-blur-md max-w-2xl mx-auto my-12 p-8">
                    <i class="ph ph-magnifying-glass-slash text-6xl text-[#C3FF00]/40 mx-auto mb-4 block"></i>
                    <h3 class="text-2xl font-bold text-white mb-2">No articles matched your criteria</h3>
                    <p class="text-textSecondary text-base mb-6 font-light">We couldn't locate architectural insights matching "${this.searchQuery || this.activeTag || this.activeCategory}". Try clearing your search parameters.</p>
                    <button onclick="BangjejePublicArticles.setSearchQuery(''); BangjejePublicArticles.setCategoryFilter('All'); document.getElementById('article-search-input').value = '';" 
                            class="btn-primary px-6 py-3 text-sm inline-flex items-center gap-2 cursor-pointer">
                        <i class="ph ph-arrow-counter-clockwise font-bold"></i> <span>Reset All Filters</span>
                    </button>
                </div>
            `;
            const pagContainer = document.getElementById('articles-pagination');
            if (pagContainer) pagContainer.innerHTML = '';
            return;
        }

        // Generate Editorial Layout (Featured Marquee + Grid Stack)
        let html = '';

        // Render Featured Article on page 1 only (or when searching)
        if (featured && this.currentPage === 1) {
            const dateStr = new Date(featured.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            html += `
                <!-- FEATURED ARCHITECTURAL ARTICLE -->
                <div class="mb-16">
                    <a href="/articles/view.html?slug=${featured.slug}" class="block glass-card overflow-hidden group cursor-pointer border border-white/10 hover:border-[#C3FF00]/40 transition-all duration-500 rounded-3xl">
                        <div class="grid grid-cols-1 lg:grid-cols-12">
                            <div class="lg:col-span-7 relative min-h-[360px] md:min-h-[460px] overflow-hidden bg-dark">
                                <img src="${featured.cover.url}" alt="${featured.cover.alt}" class="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000">
                                <div class="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/30 to-transparent lg:hidden"></div>
                                <div class="absolute top-6 left-6 flex flex-wrap gap-2 z-10">
                                    <span class="bg-[#C3FF00] text-dark font-mono font-black text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                                        <i class="ph ph-star-fill text-dark font-bold"></i> Featured Story
                                    </span>
                                    ${featured.categories.map(c => `<span class="bg-dark/80 backdrop-blur text-white text-xs font-mono font-bold tracking-wider uppercase px-3 py-1.5 rounded-full border border-white/10">${c}</span>`).join('')}
                                </div>
                            </div>
                            <div class="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between bg-surface/90 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-white/10">
                                <div>
                                    <div class="flex items-center gap-3 text-xs font-mono font-medium text-textSecondary tracking-widest uppercase mb-5">
                                        <span class="text-[#C3FF00] font-bold">${dateStr}</span>
                                        <span class="w-1.5 h-1.5 bg-[#C3FF00] rounded-full animate-pulse"></span>
                                        <span>${featured.readingTime}</span>
                                    </div>
                                    <h2 class="text-3xl sm:text-4xl font-extrabold text-white mb-6 tracking-tight leading-[1.18] group-hover:text-[#C3FF00] transition-colors font-sans">
                                        ${featured.title}
                                    </h2>
                                    <p class="text-base sm:text-lg text-textSecondary font-light leading-relaxed mb-8 line-clamp-4">
                                        ${featured.subtitle}
                                    </p>
                                </div>
                                <div class="pt-6 border-t border-white/10 flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <img src="${featured.author.avatar}" alt="${featured.author.name}" class="w-10 h-10 rounded-full object-cover border border-white/20">
                                        <div>
                                            <div class="text-white text-sm font-bold">${featured.author.name}</div>
                                            <div class="text-textSecondary text-xs font-mono">${featured.author.title}</div>
                                        </div>
                                    </div>
                                    <span class="w-11 h-11 rounded-full bg-white/5 group-hover:bg-[#C3FF00] group-hover:text-dark text-white flex items-center justify-center border border-white/10 group-hover:border-[#C3FF00] transition-all font-bold text-lg shrink-0">
                                        <i class="ph ph-arrow-up-right"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            `;
        }

        // Render Secondary Grid for Remaining Articles
        if (paginatedItems.length > 0) {
            html += `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">`;
            html += paginatedItems.map(art => {
                const dStr = new Date(art.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                return `
                    <a href="/articles/view.html?slug=${art.slug}" class="glass-card overflow-hidden group cursor-pointer flex flex-col h-full border border-white/10 hover:border-[#C3FF00]/40 transition-all duration-500 rounded-3xl">
                        <div class="aspect-[16/10] relative overflow-hidden bg-dark">
                            <img src="${art.cover.url}" alt="${art.cover.alt}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000">
                            <div class="absolute top-4 left-4 z-10 flex flex-wrap gap-1.5">
                                ${art.categories.slice(0, 2).map(c => `<span class="bg-dark/90 backdrop-blur-md text-white text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-white/10">${c}</span>`).join('')}
                            </div>
                        </div>
                        <div class="p-7 sm:p-8 flex flex-col flex-grow bg-surface/60 backdrop-blur-md justify-between">
                            <div>
                                <div class="flex items-center gap-3 text-xs font-mono font-semibold text-textSecondary tracking-widest uppercase mb-3.5">
                                    <span>${dStr}</span>
                                    <span class="w-1 h-1 bg-[#C3FF00] rounded-full"></span>
                                    <span class="text-[#C3FF00] font-medium">${art.readingTime}</span>
                                </div>
                                <h3 class="text-2xl font-bold text-white mb-4 tracking-tight leading-snug group-hover:text-[#C3FF00] transition-colors font-sans">
                                    ${art.title}
                                </h3>
                                <p class="text-sm sm:text-base text-textSecondary font-light leading-relaxed mb-6 line-clamp-3">
                                    ${art.subtitle}
                                </p>
                            </div>
                            <div class="pt-5 border-t border-white/10 flex items-center justify-between text-xs font-mono text-textSecondary">
                                <span class="flex items-center gap-2 font-medium text-white group-hover:text-[#C3FF00] transition-colors uppercase tracking-widest">
                                    Read Insights <i class="ph ph-arrow-right font-bold"></i>
                                </span>
                                <span class="text-textSecondary/70">${art.wordCount || 1000} Words</span>
                            </div>
                        </div>
                    </a>
                `;
            }).join('');
            html += `</div>`;
        }

        container.innerHTML = html;
        this.renderPagination(totalPages);
    }

    renderPagination(totalPages) {
        const pagContainer = document.getElementById('articles-pagination');
        if (!pagContainer) return;

        if (totalPages <= 1) {
            pagContainer.innerHTML = '';
            return;
        }

        let buttons = '';
        buttons += `
            <button onclick="BangjejePublicArticles.setPage(${this.currentPage - 1})" 
                    class="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-surface/80 text-white hover:border-[#C3FF00] hover:text-[#C3FF00] transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer font-bold" 
                    ${this.currentPage === 1 ? 'disabled' : ''}>
                <i class="ph ph-caret-left"></i>
            </button>
        `;

        for (let i = 1; i <= totalPages; i++) {
            const isCur = i === this.currentPage;
            buttons += `
                <button onclick="BangjejePublicArticles.setPage(${i})" 
                        class="w-10 h-10 rounded-full flex items-center justify-center border font-mono font-bold text-sm transition-all cursor-pointer ${isCur ? 'bg-[#C3FF00] text-dark border-[#C3FF00] shadow-[0_0_15px_rgba(195,255,0,0.4)] font-black' : 'bg-surface/80 border-white/10 text-white hover:border-[#C3FF00] hover:text-[#C3FF00]'}">
                    ${i}
                </button>
            `;
        }

        buttons += `
            <button onclick="BangjejePublicArticles.setPage(${this.currentPage + 1})" 
                    class="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-surface/80 text-white hover:border-[#C3FF00] hover:text-[#C3FF00] transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer font-bold" 
                    ${this.currentPage === totalPages ? 'disabled' : ''}>
                <i class="ph ph-caret-right"></i>
            </button>
        `;

        pagContainer.innerHTML = `
            <div class="flex items-center justify-center gap-2 pt-8 border-t border-white/10">
                ${buttons}
            </div>
        `;
    }

    setPage(p) {
        if (p < 1) return;
        this.currentPage = p;
        this.renderArticlesIndex();
        // Scroll smoothly to top of index
        const navbar = document.getElementById('navbar');
        const scrollTarget = navbar ? navbar.offsetHeight + 300 : 400;
        window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
    }

    // --- ARTICLE DETAIL & SANCTUARY READER RENDERER (FOR /articles/view.html) ---
    renderArticleDetail() {
        const titleEl = document.getElementById('detail-title');
        if (!titleEl) return; // Not on article detail page

        // Extract slug from URL parameter or current path
        const urlParams = new URLSearchParams(window.location.search);
        let slug = urlParams.get('slug');
        
        // If no slug parameter, inspect path name (e.g., /articles/why-simplicity.html)
        if (!slug && window.location.pathname.includes('/articles/')) {
            const parts = window.location.pathname.split('/');
            const last = parts[parts.length - 1];
            slug = last.replace(/\.html$/, '');
        }

        // Fallback to featured seed story if slug not found
        if (!slug || slug === 'view' || slug === 'index') {
            slug = 'why-simplicity-and-speed-always-win-building-studio-v2-with-tiptap';
        }

        const article = this.getBySlug(slug);
        if (!article) {
            document.getElementById('article-main-container').innerHTML = `
                <div class="py-32 text-center max-w-xl mx-auto px-6">
                    <i class="ph ph-warning-circle text-7xl text-[#C3FF00] mb-6 inline-block animate-pulse"></i>
                    <h1 class="text-4xl font-bold text-white mb-4">Article Not Found</h1>
                    <p class="text-textSecondary text-lg mb-8 leading-relaxed font-light">The story titled "<strong>${slug}</strong>" may have been archived or moved to a new canonical Cloudflare edge route.</p>
                    <a href="../articles.html" class="btn-primary px-8 py-3.5 text-sm inline-flex items-center gap-2">
                        <i class="ph ph-arrow-left font-bold"></i> <span>Return to Knowledge Hub</span>
                    </a>
                </div>
            `;
            return;
        }

        // Set document SEO tags & Google JSON-LD structured data dynamically (Sprint 6)
        if (window.BangjejeSEO) {
            window.BangjejeSEO.injectArticleSEO(article);
        } else {
            document.title = `${article.title} | bangjeje.dev`;
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.content = article.subtitle || '';
        }

        // Populate article header sanctuary & Breadcrumb Navigation (Sprint 6)
        const breadcrumbEl = document.getElementById('detail-breadcrumb-nav');
        if (breadcrumbEl) {
            const primaryCat = (article.categories && article.categories[0]) || 'Insights';
            breadcrumbEl.innerHTML = `
                <a href="../index.html" class="hover:text-white transition-colors flex items-center gap-1.5 font-sans"><i class="ph ph-house text-[#C3FF00]"></i> Home</a>
                <span class="text-white/20">/</span>
                <a href="../articles.html" class="hover:text-white transition-colors">Knowledge Hub</a>
                <span class="text-white/20">/</span>
                <a href="../articles.html?category=${encodeURIComponent(primaryCat)}" class="hover:text-[#C3FF00] transition-colors font-bold text-[#C3FF00]">${primaryCat}</a>
                <span class="text-white/20">/</span>
                <span class="text-white font-semibold truncate max-w-[240px] sm:max-w-md font-sans">${article.title}</span>
            `;
        }

        document.getElementById('detail-title').textContent = article.title;
        document.getElementById('detail-subtitle').textContent = article.subtitle;
        document.getElementById('detail-categories').innerHTML = article.categories.map(c => `<a href="../articles.html?category=${encodeURIComponent(c)}" class="bg-surface border border-white/10 hover:border-[#C3FF00] px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-[#C3FF00] tracking-widest uppercase transition-colors inline-block">${c}</a>`).join('');
        
        const dStr = new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        document.getElementById('detail-date').textContent = dStr;
        document.getElementById('detail-reading-time').textContent = article.readingTime;
        document.getElementById('detail-author-name').textContent = article.author.name;
        document.getElementById('detail-author-title').textContent = article.author.title;
        document.getElementById('detail-author-avatar').src = article.author.avatar;
        document.getElementById('detail-author-avatar').alt = article.author.name;

        // Cover photography
        const coverImg = document.getElementById('detail-cover-image');
        if (coverImg && article.cover) {
            coverImg.src = article.cover.url;
            coverImg.alt = article.cover.alt || article.title;
        }

        // Tiptap Content Output Sanctuary
        const contentEl = document.getElementById('detail-content-body');
            contentEl.innerHTML = article.content;
            
            // Sprint 7 Universal Block System: Clean editorial handlebars, drag triggers, and force expanded read state in public view
            contentEl.querySelectorAll('.block-toolbar, .block-collapsed-summary, button[onclick*="triggerMediaReplace"]').forEach(el => el.remove());
            contentEl.querySelectorAll('.studio-block, .block-content-body').forEach(el => {
                el.classList.remove('is-collapsed', 'hidden');
                el.removeAttribute('draggable');
            });
            contentEl.querySelectorAll('[contenteditable="true"], [contenteditable="false"]').forEach(el => el.removeAttribute('contenteditable'));
        }

        // Render Footer Tags
        const tagsEl = document.getElementById('detail-tags');
        if (tagsEl) {
            tagsEl.innerHTML = article.tags.map(t => `<a href="../articles.html?tag=${encodeURIComponent(t)}" class="bg-surface/80 border border-white/10 hover:border-[#C3FF00]/60 text-white hover:text-[#C3FF00] font-mono text-xs px-4 py-1.5 rounded-xl transition-all block font-bold">#${t}</a>`).join('');
        }

        // Automatically Generate Sticky Table of Contents (TOC) with Valid SEO Keyword Slugs (Sprint 6)
        this.generateTableOfContents(contentEl);

        // Render Related Articles Cards
        this.renderRelatedArticles(slug);
    }

    generateTableOfContents(contentEl) {
        const tocList = document.getElementById('sticky-toc-list');
        const tocContainer = document.getElementById('sticky-toc-sidebar');
        if (!tocList || !contentEl) return;

        const headings = contentEl.querySelectorAll('h2, h3');
        if (headings.length === 0) {
            if (tocContainer) tocContainer.classList.add('hidden');
            return;
        }

        let tocHTML = '';
        headings.forEach((heading, idx) => {
            // Sprint 6: Ensure generated headings create clean, SEO-friendly keyword anchors rather than numeric indexes
            let anchorId = heading.textContent
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');
            if (!anchorId) anchorId = `section-${idx + 1}`;
            
            heading.id = anchorId;
            const isH3 = heading.tagName.toLowerCase() === 'h3';
            tocHTML += `
                <li>
                    <a href="#${anchorId}" class="block py-1.5 px-3 rounded-lg text-xs font-sans transition-all text-textSecondary hover:text-[#C3FF00] hover:bg-white/5 truncate ${isH3 ? 'pl-6 font-normal border-l border-white/10 ml-2' : 'font-semibold font-mono border-l-2 border-transparent hover:border-[#C3FF00]'}">
                        ${heading.textContent}
                    </a>
                </li>
            `;
        });

        tocList.innerHTML = tocHTML;
        if (tocContainer) tocContainer.classList.remove('hidden');
    }

    renderRelatedArticles(currentSlug) {
        const container = document.getElementById('related-articles-grid');
        if (!container) return;

        const related = this.getRelatedArticles(currentSlug, 2);
        if (related.length === 0) {
            document.getElementById('related-articles-section')?.classList.add('hidden');
            return;
        }

        container.innerHTML = related.map(art => {
            const dStr = new Date(art.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            return `
                <a href="/articles/view.html?slug=${art.slug}" class="glass-card overflow-hidden group cursor-pointer flex flex-col h-full border border-white/10 hover:border-[#C3FF00]/40 transition-all duration-500 rounded-3xl">
                    <div class="aspect-[16/9] relative overflow-hidden bg-dark">
                        <img src="${art.cover.url}" alt="${art.cover.alt}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000">
                        <div class="absolute top-4 left-4 z-10">
                            <span class="bg-dark/90 backdrop-blur-md text-white text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-white/10">${art.categories[0] || 'Insights'}</span>
                        </div>
                    </div>
                    <div class="p-7 flex flex-col flex-grow bg-surface/60 backdrop-blur-md justify-between">
                        <div>
                            <div class="flex items-center gap-3 text-xs font-mono font-semibold text-textSecondary tracking-widest uppercase mb-3">
                                <span>${dStr}</span>
                                <span class="w-1 h-1 bg-[#C3FF00] rounded-full"></span>
                                <span class="text-[#C3FF00]">${art.readingTime}</span>
                            </div>
                            <h3 class="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-[#C3FF00] transition-colors font-sans">
                                ${art.title}
                            </h3>
                            <p class="text-sm text-textSecondary font-light leading-relaxed mb-6 line-clamp-2">
                                ${art.subtitle}
                            </p>
                        </div>
                        <div class="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-textSecondary">
                            <span class="font-bold text-white group-hover:text-[#C3FF00] transition-colors uppercase tracking-widest flex items-center gap-1.5">
                                Read Article <i class="ph ph-arrow-right font-bold"></i>
                            </span>
                        </div>
                    </div>
                </a>
            `;
        }).join('');
    }

    // --- SPRINT 6: AUTOMATED SITEMAP & RSS FEED GENERATION ENGINE ---
    generateAndStoreFeeds() {
        try {
            const sitemapXml = this.generateSitemapXML();
            const rssXml = this.generateRSSFeed();
            localStorage.setItem('bangjeje_sitemap_xml', sitemapXml);
            localStorage.setItem('bangjeje_rss_xml', rssXml);
            console.log('📡 Sprint 6: Automatically refreshed sitemap.xml and rss.xml manifests for Cloudflare Edge static indexing.');
        } catch (e) {
            console.error('Failed to generate SEO XML manifests:', e);
        }
    }

    generateSitemapXML() {
        const domain = 'https://bangjeje.dev';
        const now = new Date().toISOString().split('T')[0];
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
        
        // Static routes
        const pages = ['/', '/index.html', '/articles.html', '/pages/about.html', '/pages/services.html', '/pages/case-studies.html', '/pages/industries.html', '/pages/contact.html'];
        pages.forEach(p => {
            xml += `  <url>\n    <loc>${domain}${p}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${p === '/articles.html' ? 'daily' : 'weekly'}</changefreq>\n    <priority>${p === '/' || p === '/index.html' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
        });

        // Published Article slug routes
        this.articles.forEach(art => {
            const modDate = (art.updatedAt || art.publishedAt || now).split('T')[0];
            xml += `  <url>\n    <loc>${domain}/articles/${art.slug}.html</loc>\n    <lastmod>${modDate}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
        });

        xml += `</urlset>`;
        return xml;
    }

    generateRSSFeed() {
        const domain = 'https://bangjeje.dev';
        const now = new Date().toUTCString();
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n`;
        xml += `    <title>bangjeje.dev &bull; Executive Systems Intelligence &amp; Cloud Architecture</title>\n`;
        xml += `    <link>${domain}/articles.html</link>\n`;
        xml += `    <description>Dissecting modern enterprise software architecture, composable edge computing, and high-frequency digital product design.</description>\n`;
        xml += `    <language>en-us</language>\n`;
        xml += `    <lastBuildDate>${now}</lastBuildDate>\n`;
        xml += `    <atom:link href="${domain}/rss.xml" rel="self" type="application/rss+xml"/>\n\n`;

        this.articles.slice(0, 20).forEach(art => {
            const artDate = art.publishedAt ? new Date(art.publishedAt).toUTCString() : now;
            const link = `${domain}/articles/${art.slug}.html`;
            const coverUrl = art.cover?.url || 'https://cdn.bangjeje.dev/vault/COTIT_Enterprise_Hero_V2.webp';
            xml += `    <item>\n`;
            xml += `      <title><![CDATA[${art.title}]]></title>\n`;
            xml += `      <link>${link}</link>\n`;
            xml += `      <guid isPermaLink="true">${link}</guid>\n`;
            xml += `      <pubDate>${artDate}</pubDate>\n`;
            xml += `      <author><![CDATA[bangjeje@bangjeje.dev (${art.author?.name || 'bangjeje'})]]></author>\n`;
            xml += `      <description><![CDATA[${art.subtitle || 'Executive architecture study.'}]]></description>\n`;
            xml += `      <enclosure url="${coverUrl}" length="102400" type="image/webp"/>\n`;
            xml += `    </item>\n`;
        });

        xml += `  </channel>\n</rss>`;
        return xml;
    }

    // --- SHARE BUTTONS INTERACTION ---
    shareArticle(platform) {
        const url = window.location.href;
        const title = document.title;

        if (platform === 'copy') {
            navigator.clipboard.writeText(url);
            alert('🔗 Copied permanent Cloudflare Edge article permalink to clipboard!');
        } else if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        } else if (platform === 'linkedin') {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        } else if (platform === 'threads') {
            window.open(`https://www.threads.net/intent/post?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
        }
    }
}

// Initialize immediately upon document ready
document.addEventListener('DOMContentLoaded', () => {
    const engine = new BangjejePublicArticlesEngine();
    
    // Check URL parameters for initial search, category, or tag filtering
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('category')) {
        engine.activeCategory = urlParams.get('category');
    }
    if (urlParams.get('tag')) {
        engine.activeTag = urlParams.get('tag');
    }

    // Attempt index rendering or detail reading
    engine.renderArticlesIndex();
    engine.renderArticleDetail();
});
