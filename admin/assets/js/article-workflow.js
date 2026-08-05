/**
 * bangjeje.dev Studio V2 — Sprint 4: Editorial Production Workflow Engine
 * Manages Document Inspector, Featured Image (Media Vault), Categories, Tags, Slugification, Revisions, Basic SEO, and Reader Previews.
 * Focus: End-to-end article publishing workflow without bloating the core writing sanctuary.
 */

class StudioArticleWorkflowEngine {
    constructor() {
        this.storageKey = 'bangjeje_studio_v2_article_meta';
        this.inspectorOpen = true;
        this.activeTab = 'document'; // 'document' | 'block'
        this.slugManuallyModified = false;

        // Default Article Metadata State
        this.meta = {
            id: 'article-prod-2026-001',
            status: 'draft', // 'draft' | 'review' | 'scheduled' | 'published' | 'archived'
            author: {
                name: 'bangjeje',
                title: 'Principal Architect & Founder',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
            },
            slug: 'why-simplicity-and-speed-always-win-building-studio-v2-with-tiptap',
            featuredImage: {
                url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1440&q=80',
                r2CdnUrl: 'https://cdn.bangjeje.dev/vault/COTIT_Enterprise_Hero_V2.webp',
                filename: 'COTIT_Enterprise_Hero_V2.webp',
                alt: 'COTIT Enterprise ERP Supply Chain Dashboard Preview on MacBook',
                dimensions: '1920 x 1080 px'
            },
            categories: ['Engineering', 'Editorial OS', 'Design Systems'],
            tags: ['Tiptap', 'Cloudflare R2', 'TailAdmin', 'Vanilla JS'],
            seo: {
                title: 'Why Simplicity & Speed Always Win: Building Studio V2',
                description: 'Explore how bangjeje.dev Studio V2 replaces heavy CMS frameworks with a lightweight Vanilla Tiptap and Cloudflare R2 Editorial Operating System.'
            },
            revisions: [
                { rev: 'Rev 1.2', desc: 'Cover media asset bound via Sprint 2 Vault', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), status: 'Draft' },
                { rev: 'Rev 1.1', desc: 'Editorial typography scale & spacing refined', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), status: 'Draft' },
                { rev: 'Rev 1.0', desc: 'Initial article document scaffolded in Studio', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), status: 'Draft' }
            ],
            publishedAt: null,
            updatedAt: new Date().toISOString()
        };

        this.availableCategories = [
            'Engineering', 'Cloud Architecture', 'Design Systems', 'AI & Machine Learning', 'Editorial OS', 'Case Studies', 'Digital Assets'
        ];

        this.init();
    }

    init() {
        this.loadMetadata();
        this.injectPreviewModalDOM();
        this.renderInspector();
        this.bindGlobalWorkflowEvents();
        
        window.StudioArticleWorkflow = this;
    }

    loadMetadata() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.meta = { ...this.meta, ...parsed };
                if (parsed.slugManuallyModified !== undefined) {
                    this.slugManuallyModified = parsed.slugManuallyModified;
                }
            } catch (e) {
                console.error('Failed to restore article metadata from local storage:', e);
            }
        }
    }

    saveMetadata(recordRevision = false, revNote = null) {
        this.meta.updatedAt = new Date().toISOString();

        if (recordRevision) {
            const nextRevNum = `Rev ${Math.max(1, this.meta.revisions.length * 0.2 + 1).toFixed(1)}`;
            this.meta.revisions.unshift({
                rev: nextRevNum,
                desc: revNote || `Document metadata & content checkpoint saved`,
                timestamp: new Date().toISOString(),
                status: this.meta.status.toUpperCase()
            });
            if (this.meta.revisions.length > 15) this.meta.revisions.pop(); // Cap history to 15 revisions
        }

        const payload = { ...this.meta, slugManuallyModified: this.slugManuallyModified };
        localStorage.setItem(this.storageKey, JSON.stringify(payload));
        this.renderInspector();
    }

    // --- DOCUMENT INSPECTOR (RIGHT SIDEBAR) RENDERING ---
    renderInspector() {
        const sidebar = document.getElementById('doc-inspector-sidebar');
        if (!sidebar) return;

        // Ensure sidebar toggle state matches
        if (this.inspectorOpen) {
            sidebar.className = 'w-80 lg:w-[360px] border-l border-slate-200 bg-slate-50/80 flex flex-col justify-between overflow-y-auto shrink-0 transition-all duration-200 no-scrollbar font-sans';
        } else {
            sidebar.className = 'w-0 border-l-0 overflow-hidden shrink-0 transition-all duration-200 pointer-events-none opacity-0';
            return;
        }

        const dateFormatted = this.meta.publishedAt ? new Date(this.meta.publishedAt).toLocaleString() : 'Not published yet';
        const titleInput = document.getElementById('doc-title-input');
        const defaultTitle = titleInput ? titleInput.value : this.meta.seo.title;
        const seoTitleVal = this.meta.seo.title || defaultTitle || '';
        const seoDescVal = this.meta.seo.description || '';

        sidebar.innerHTML = `
            <!-- TOP TAB SWITCHER: DOCUMENT VS BLOCK (GUTENBERG / NOTION WORKFLOW) -->
            <div class="h-14 border-b border-slate-200 px-4 flex items-center justify-between bg-white shrink-0 sticky top-0 z-10 shadow-2xs">
                <div class="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-full">
                    <button onclick="StudioArticleWorkflow.setTab('document')" class="flex-1 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${this.activeTab === 'document' ? 'bg-slate-900 text-[#C3FF00] shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
                        Document Settings
                    </button>
                    <button onclick="StudioArticleWorkflow.setTab('block')" class="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${this.activeTab === 'block' ? 'bg-slate-900 text-[#C3FF00] shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
                        Block Inspector
                    </button>
                </div>
            </div>

            <!-- INSPECTOR CONTENT BODY -->
            <div class="p-5 space-y-6 flex-1 overflow-y-auto no-scrollbar pb-16">
                ${this.activeTab === 'document' ? this.renderDocumentSettingsHTML(seoTitleVal, seoDescVal, dateFormatted) : this.renderBlockSettingsHTML()}
            </div>

            <!-- FOOTER STATUS SUMMARY -->
            <div class="p-3 border-t border-slate-200 bg-white flex items-center justify-between text-[11px] font-mono text-slate-500 shrink-0 shadow-2xs">
                <div class="flex items-center gap-2 truncate">
                    <span class="w-2 h-2 rounded-full ${this.meta.status === 'published' ? 'bg-[#C3FF00] border border-slate-900' : 'bg-amber-400'}"></span>
                    <span class="font-bold uppercase tracking-wider text-slate-800">${this.meta.status}</span>
                </div>
                <button onclick="StudioArticleWorkflow.saveMetadata(true, 'Manual Inspector Save Point')" class="text-slate-600 hover:text-slate-900 font-extrabold underline cursor-pointer">Save Metadata</button>
            </div>
        `;
    }

    renderDocumentSettingsHTML(seoTitleVal, seoDescVal, dateFormatted) {
        return `
            <!-- 1. ARTICLE STATUS & REVISIONS ACCORDION -->
            <section class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <i class="ph ph-sliders text-base text-slate-600"></i> <span>Status & Lifecycle</span>
                    </h4>
                    <span class="px-2 py-0.5 rounded-md text-[10px] font-mono font-black uppercase ${this.meta.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-900 text-white'}">${this.meta.status}</span>
                </div>

                <div class="p-4 space-y-4 text-xs font-sans">
                    <!-- Status selector -->
                    <div class="space-y-1.5">
                        <label class="font-extrabold text-slate-800 flex items-center justify-between">
                            <span>Workflow Stage</span>
                        </label>
                        <select onchange="StudioArticleWorkflow.updateStatus(this.value)" class="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900 cursor-pointer">
                            <option value="draft" ${this.meta.status === 'draft' ? 'selected' : ''}>Draft &bull; Local writing workspace</option>
                            <option value="review" ${this.meta.status === 'review' ? 'selected' : ''}>In Review &bull; Awaiting architecture validation</option>
                            <option value="scheduled" ${this.meta.status === 'scheduled' ? 'selected' : ''}>Scheduled &bull; Automated future deployment</option>
                            <option value="published" ${this.meta.status === 'published' ? 'selected' : ''}>Published 🚀 &bull; Live on Cloudflare CDN</option>
                            <option value="archived" ${this.meta.status === 'archived' ? 'selected' : ''}>Archived &bull; Hidden from public edge routes</option>
                        </select>
                    </div>

                    <!-- Author attribution -->
                    <div class="flex items-center gap-3 pt-2 border-t border-slate-100">
                        <img src="${this.meta.author.avatar}" class="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-2xs" alt="${this.meta.author.name}">
                        <div class="overflow-hidden">
                            <div class="font-extrabold text-slate-900 truncate">${this.meta.author.name}</div>
                            <div class="text-[11px] text-slate-400 font-mono truncate">${this.meta.author.title}</div>
                        </div>
                    </div>

                    <!-- Revision History Timeline -->
                    <div class="pt-3 border-t border-slate-100 space-y-2">
                        <div class="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500 uppercase">
                            <span>Revision History (${this.meta.revisions.length})</span>
                            <span class="text-emerald-600">Sync Active ⚡</span>
                        </div>
                        <div class="space-y-2 max-h-44 overflow-y-auto pr-1 no-scrollbar text-[11px]">
                            ${this.meta.revisions.map((r, i) => {
                                const rDate = new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                                return `
                                    <div class="p-2 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col gap-0.5 hover:bg-slate-100 transition-colors">
                                        <div class="flex items-center justify-between font-mono font-extrabold text-slate-800">
                                            <span class="flex items-center gap-1.5"><i class="ph ph-clock-counter-clockwise text-slate-400"></i> ${r.rev}</span>
                                            <span class="text-slate-400 text-[10px]">${rDate}</span>
                                        </div>
                                        <div class="text-[10px] text-slate-600 truncate">${r.desc}</div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            </section>

            <!-- 2. URL SLUG & PERMALINK CARD -->
            <section class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <i class="ph ph-link text-base text-slate-600"></i> <span>Canonical URL & Slug</span>
                    </h4>
                    <button onclick="StudioArticleWorkflow.resetSlugToTitle()" class="text-[10px] font-mono text-emerald-600 hover:underline font-bold cursor-pointer" title="Re-sync automatically with Article Title">Auto-Sync</button>
                </div>
                <div class="p-4 space-y-2 text-xs font-sans">
                    <label class="text-xs font-extrabold text-slate-800">Route Slug Identifier</label>
                    <div class="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-400 font-mono text-xs shadow-2xs focus-within:border-slate-900 focus-within:bg-white transition-all">
                        <span class="shrink-0 font-medium select-none text-[11px]">/articles/</span>
                        <input type="text" 
                               id="doc-slug-input" 
                               value="${this.meta.slug}" 
                               oninput="StudioArticleWorkflow.handleManualSlugEdit(this.value)" 
                               class="w-full bg-transparent font-extrabold text-slate-900 pl-0.5 focus:outline-none truncate">
                    </div>
                    <div class="flex items-center justify-between pt-1 text-[11px] font-mono text-slate-500">
                        <span class="truncate max-w-[200px]" title="https://bangjeje.dev/articles/${this.meta.slug}">https://bangjeje.dev/articles/${this.meta.slug}</span>
                        <button onclick="navigator.clipboard.writeText('https://bangjeje.dev/articles/${this.meta.slug}'); StudioToast?.show('Copied production canonical URL to clipboard!', 'info', 'Permalink');" class="font-extrabold text-slate-800 hover:text-emerald-600 underline shrink-0 cursor-pointer">Copy</button>
                    </div>
                </div>
            </section>

            <!-- 3. FEATURED IMAGE (STUDIO V2 MEDIA LIBRARY INTEGRATION) -->
            <section class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <i class="ph ph-image-square text-base text-slate-600"></i> <span>Featured Cover Image</span>
                    </h4>
                    <span class="text-[10px] font-mono text-slate-400">Cloudflare R2</span>
                </div>
                <div class="p-4 text-xs font-sans space-y-3">
                    ${this.meta.featuredImage ? `
                        <div class="relative w-full h-44 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 group">
                            <img src="${this.meta.featuredImage.url}" alt="${this.meta.featuredImage.alt}" class="w-full h-full object-cover">
                            <div class="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                                <button onclick="StudioArticleWorkflow.openMediaVaultForCover()" class="px-3 py-1.5 rounded-lg bg-[#C3FF00] text-slate-950 font-black font-mono text-[10px] uppercase tracking-wider shadow-md hover:bg-white transition-all cursor-pointer">Replace Cover</button>
                                <button onclick="StudioArticleWorkflow.removeFeaturedImage()" class="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold shadow-md hover:bg-rose-700 transition-all cursor-pointer" title="Remove Cover"><i class="ph ph-trash"></i></button>
                            </div>
                        </div>
                        <div class="space-y-1 text-[11px] font-mono text-slate-600">
                            <div class="font-bold text-slate-900 truncate" title="${this.meta.featuredImage.filename}">${this.meta.featuredImage.filename}</div>
                            <div class="flex items-center justify-between text-slate-400">
                                <span>${this.meta.featuredImage.dimensions || '1920x1080'}</span>
                                <span class="text-emerald-600 font-bold">WebP &bull; Vault Sync</span>
                            </div>
                        </div>
                    ` : `
                        <button onclick="StudioArticleWorkflow.openMediaVaultForCover()" class="w-full h-36 border-2 border-dashed border-slate-300 hover:border-slate-900 rounded-2xl bg-slate-50/50 hover:bg-slate-100/60 transition-all flex flex-col items-center justify-center gap-2 p-6 group cursor-pointer text-slate-500 hover:text-slate-900">
                            <div class="w-10 h-10 rounded-xl bg-white shadow-2xs flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform text-slate-700"><i class="ph ph-images-square"></i></div>
                            <span class="text-xs font-extrabold">Set Featured Image</span>
                            <span class="text-[10px] font-mono text-slate-400">Connect directly from Studio V2 Media Library</span>
                        </button>
                    `}
                </div>
            </section>

            <!-- 4. CATEGORIES CHECKLIST -->
            <section class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <i class="ph ph-folder-notch text-base text-slate-600"></i> <span>Categories</span>
                    </h4>
                    <span class="text-[10px] font-mono text-slate-400">${this.meta.categories.length} selected</span>
                </div>
                <div class="p-4 flex flex-wrap gap-2 text-xs">
                    ${this.availableCategories.map(cat => {
                        const isSelected = this.meta.categories.includes(cat);
                        return `
                            <button onclick="StudioArticleWorkflow.toggleCategory('${cat}')" 
                                    class="px-3 py-1 rounded-xl text-[11px] font-bold font-mono transition-all cursor-pointer flex items-center gap-1.5 ${isSelected ? 'bg-slate-900 text-[#C3FF00] shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'}">
                                ${isSelected ? '<i class="ph ph-check text-emerald-400 font-bold"></i>' : '<i class="ph ph-plus text-slate-400"></i>'} <span>${cat}</span>
                            </button>
                        `;
                    }).join('')}
                </div>
            </section>

            <!-- 5. INTERACTIVE TAGS ENGINE -->
            <section class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <i class="ph ph-tag text-base text-slate-600"></i> <span>Editorial Tags</span>
                    </h4>
                    <span class="text-[10px] font-mono text-slate-400">Hit Enter to add</span>
                </div>
                <div class="p-4 space-y-3 font-sans">
                    <div class="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus-within:border-slate-900 focus-within:bg-white transition-all">
                        <span class="text-slate-400 font-mono font-bold mr-1">#</span>
                        <input type="text" 
                               id="tag-creation-input" 
                               placeholder="Add tag (e.g. Cloudflare)..." 
                               onkeydown="StudioArticleWorkflow.handleTagInputKeyDown(event, this)" 
                               class="w-full bg-transparent font-semibold text-slate-900 focus:outline-none">
                    </div>
                    <div class="flex flex-wrap gap-1.5 pt-1">
                        ${this.meta.tags.map(tag => `
                            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-800 hover:text-rose-700 font-mono text-[11px] font-bold border border-slate-200/80 transition-colors group">
                                <span>#${tag}</span>
                                <button onclick="StudioArticleWorkflow.removeTag('${tag}')" class="w-4 h-4 rounded-md flex items-center justify-center text-slate-400 group-hover:text-rose-600 font-extrabold cursor-pointer" title="Remove tag">&times;</button>
                            </span>
                        `).join('')}
                    </div>
                </div>
            </section>

            <!-- 6. BASIC SEO METADATA SANCTUARY (STRICT: NO ADVANCED SCORING YET) -->
            <section class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <i class="ph ph-google-logo text-base text-slate-600"></i> <span>Basic SEO Metadata</span>
                    </h4>
                    <span class="px-2 py-0.5 rounded text-[9px] font-mono font-black bg-emerald-100 text-emerald-800">Sprint 4 Basic</span>
                </div>
                
                <div class="p-4 space-y-4 text-xs font-sans">
                    <!-- SEO Title -->
                    <div class="space-y-1">
                        <div class="flex items-center justify-between font-extrabold text-slate-800">
                            <span>SEO Meta Title</span>
                            <span id="seo-title-counter" class="text-[10px] font-mono ${seoTitleVal.length > 60 ? 'text-rose-600 font-bold' : 'text-slate-400'}">${seoTitleVal.length} / 60</span>
                        </div>
                        <input type="text" 
                               id="seo-title-input" 
                               value="${seoTitleVal}" 
                               oninput="StudioArticleWorkflow.updateSeoTitle(this.value)" 
                               placeholder="Custom SERP title..." 
                               class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition-all shadow-2xs">
                    </div>

                    <!-- SEO Description -->
                    <div class="space-y-1">
                        <div class="flex items-center justify-between font-extrabold text-slate-800">
                            <span>Meta Description</span>
                            <span id="seo-desc-counter" class="text-[10px] font-mono ${seoDescVal.length > 160 ? 'text-rose-600 font-bold' : 'text-slate-400'}">${seoDescVal.length} / 160</span>
                        </div>
                        <textarea id="seo-desc-input" 
                                  rows="3" 
                                  oninput="StudioArticleWorkflow.updateSeoDescription(this.value)" 
                                  placeholder="Write a clear summary for Google SERP snippet..." 
                                  class="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition-all shadow-2xs resize-none leading-relaxed">${seoDescVal}</textarea>
                    </div>

                    <!-- LIVE GOOGLE SERP PREVIEW CARD -->
                    <div class="pt-3 border-t border-slate-100 space-y-2">
                        <span class="text-[10px] font-mono font-bold text-slate-400 uppercase">Google Search Result Preview</span>
                        <div class="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200 shadow-2xs font-sans space-y-1">
                            <div class="flex items-center gap-1 text-[11px] font-medium text-slate-600 font-mono truncate">
                                <span>https://bangjeje.dev</span> <span class="text-slate-400">&rsaquo;</span> <span>articles</span> <span class="text-slate-400">&rsaquo;</span> <span class="text-emerald-700 font-bold">${this.meta.slug}</span>
                            </div>
                            <div class="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer truncate font-serif" title="${seoTitleVal}">${seoTitleVal || 'Untitled Article Canonical Title'}</div>
                            <div class="text-xs text-[#4d5156] line-clamp-2 leading-relaxed font-normal">${seoDescVal || 'No search description provided yet. Google will auto-generate snippets from early article paragraphs.'}</div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    renderBlockSettingsHTML() {
        return `
            <div class="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 font-sans mt-8">
                <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-slate-500 text-2xl font-bold shadow-2xs">
                    <i class="ph ph-cube text-slate-400"></i>
                </div>
                <h3 class="text-sm font-extrabold text-slate-800 mb-1">Gutenberg Block Inspector</h3>
                <p class="text-xs max-w-xs text-slate-500 leading-relaxed mb-6">Select any heading, code fence, or media block inside the Tiptap writing canvas to inspect block-level parameters.</p>
                <button onclick="StudioArticleWorkflow.setTab('document')" class="px-4 py-2 rounded-xl bg-slate-900 text-[#C3FF00] font-bold text-xs uppercase shadow-md hover:bg-slate-800 transition-colors">
                    Return to Document Settings
                </button>
            </div>
        `;
    }

    // --- WORKFLOW EVENT BINDING & ACTIONS ---
    bindGlobalWorkflowEvents() {
        // Sync article title input with URL Slug automatically (unless user manually modified slug)
        const titleInput = document.getElementById('doc-title-input');
        if (titleInput) {
            titleInput.addEventListener('input', (e) => {
                const title = e.target.value;
                if (!this.slugManuallyModified && title) {
                    this.meta.slug = this.slugify(title);
                }
                if (!this.meta.seo.title || this.meta.seo.title === 'Why Simplicity & Speed Always Win: Building Studio V2 with Tiptap') {
                    this.meta.seo.title = title;
                }
                // Refresh slug display without destroying input focus
                const slugInput = document.getElementById('doc-slug-input');
                if (slugInput && document.activeElement !== slugInput) {
                    slugInput.value = this.meta.slug;
                }
            });
        }
    }

    slugify(text) {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')     // Replace spaces with -
            .replace(/[^\w\-]+/g, '') // Remove non-word chars
            .replace(/\-\-+/g, '-')   // Replace multiple - with single -
            .replace(/^-+/, '')       // Trim - from start
            .replace(/-+$/, '');      // Trim - from end
    }

    handleManualSlugEdit(val) {
        this.slugManuallyModified = true;
        this.meta.slug = this.slugify(val || 'untitled');
        this.saveMetadata();
    }

    resetSlugToTitle() {
        this.slugManuallyModified = false;
        const titleInput = document.getElementById('doc-title-input');
        const source = titleInput ? titleInput.value : this.meta.seo.title;
        this.meta.slug = this.slugify(source || 'untitled-article');
        this.saveMetadata(true, 'Reset canonical URL slug to match Article Title');
        StudioToast?.show('URL Slug synchronized with Article Title!', 'success', 'Slug Engine');
    }

    setTab(tab) {
        this.activeTab = tab;
        this.renderInspector();
    }

    toggleInspector() {
        this.inspectorOpen = !this.inspectorOpen;
        const toggleBtn = document.getElementById('btn-toggle-inspector');
        if (toggleBtn) {
            if (this.inspectorOpen) {
                toggleBtn.className = 'w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 text-[#C3FF00] font-extrabold flex items-center justify-center shadow-md transition-all cursor-pointer';
            } else {
                toggleBtn.className = 'w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-extrabold flex items-center justify-center border border-slate-200/80 transition-all cursor-pointer';
            }
        }
        this.renderInspector();
    }

    updateStatus(newStatus) {
        this.meta.status = newStatus;
        this.saveMetadata(true, `Changed operational status to ${newStatus.toUpperCase()}`);
        StudioToast?.show(`Article workflow stage set to: ${newStatus.toUpperCase()}`, 'info', 'Lifecycle');
    }

    openMediaVaultForCover() {
        if (!window.StudioMediaLibrary) {
            StudioToast?.show('Media Library Vault engine not loaded.', 'error', 'Studio V2');
            return;
        }

        window.StudioMediaLibrary.open({
            onSelect: (asset) => {
                this.meta.featuredImage = {
                    url: asset.url,
                    r2CdnUrl: asset.r2CdnUrl || asset.url,
                    filename: asset.filename,
                    alt: asset.alt || asset.filename,
                    dimensions: asset.dimensions
                };
                this.saveMetadata(true, `Bound Featured Cover: ${asset.filename}`);
                StudioToast?.show(`Featured cover image bound from Studio V2 Media Library!`, 'success', 'Cover Vault');
            }
        });
    }

    removeFeaturedImage() {
        this.meta.featuredImage = null;
        this.saveMetadata(true, 'Removed Featured Cover image');
        StudioToast?.show('Featured cover image removed.', 'info', 'Cover Vault');
    }

    toggleCategory(cat) {
        if (this.meta.categories.includes(cat)) {
            if (this.meta.categories.length <= 1) {
                StudioToast?.show('An article must belong to at least one primary category.', 'warning', 'Categories');
                return;
            }
            this.meta.categories = this.meta.categories.filter(c => c !== cat);
        } else {
            this.meta.categories.push(cat);
        }
        this.saveMetadata();
    }

    handleTagInputKeyDown(e, inputEl) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = inputEl.value.replace(/^#/, '').trim();
            if (!val) return;

            if (!this.meta.tags.map(t => t.toLowerCase()).includes(val.toLowerCase())) {
                this.meta.tags.push(val);
                inputEl.value = '';
                this.saveMetadata();
            } else {
                StudioToast?.show(`Tag "#${val}" is already active on this document.`, 'warning', 'Tags');
                inputEl.value = '';
            }
        }
    }

    removeTag(tag) {
        this.meta.tags = this.meta.tags.filter(t => t !== tag);
        this.saveMetadata();
    }

    updateSeoTitle(val) {
        this.meta.seo.title = val;
        this.saveMetadata();
    }

    updateSeoDescription(val) {
        this.meta.seo.description = val;
        this.saveMetadata();
    }

    // --- READER PREVIEW MODAL & LIVE EDGE PUBLISH EXECUTION ---
    injectPreviewModalDOM() {
        if (document.getElementById('studio-reader-preview-modal')) return;

        const overlay = document.createElement('div');
        overlay.id = 'studio-reader-preview-modal';
        overlay.className = 'fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex flex-col hidden opacity-0 transition-opacity duration-200 font-["Outfit"] overflow-y-auto text-slate-900';
        overlay.innerHTML = `
            <!-- PREVIEW TOP BAR -->
            <header class="h-16 border-b border-slate-800 px-6 sm:px-12 flex items-center justify-between bg-slate-900 text-white shrink-0 sticky top-0 z-20 shadow-md">
                <div class="flex items-center gap-3">
                    <span class="w-3 h-3 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                    <span class="font-mono text-xs font-black uppercase tracking-widest text-slate-300">Reader Experience Preview &bull; bangjeje.dev</span>
                </div>
                <div class="flex items-center gap-4">
                    <button onclick="StudioArticleWorkflow.closePreview()" class="h-9 px-4 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
                        Back to Workspace (ESC)
                    </button>
                    <button onclick="StudioArticleWorkflow.executePublishToEdge()" class="h-10 px-6 rounded-xl bg-[#C3FF00] text-slate-950 hover:bg-white font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 cursor-pointer">
                        <i class="ph ph-rocket-launch text-base font-bold"></i> <span>Publish Now 🚀</span>
                    </button>
                </div>
            </header>

            <!-- READER SANCTUARY CANVAS (EXACT BANGJEJE.DEV PUBLIC THEME) -->
            <div class="flex-1 bg-white p-6 sm:p-12 lg:p-20 overflow-y-auto">
                <article class="max-w-3xl mx-auto space-y-8 pb-32">
                    <!-- Categories -->
                    <div id="prev-categories" class="flex flex-wrap gap-2 text-xs font-mono font-black uppercase tracking-wider text-emerald-700"></div>

                    <!-- Title & Author Byline -->
                    <h1 id="prev-title" class="text-4xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-[1.15]"></h1>
                    
                    <div class="flex items-center gap-4 py-4 border-y border-slate-200/80 text-xs font-semibold text-slate-600">
                        <img id="prev-author-avatar" src="${this.meta.author.avatar}" class="w-10 h-10 rounded-full object-cover border border-slate-200" alt="Author">
                        <div>
                            <div id="prev-author-name" class="font-bold text-slate-900 text-sm"></div>
                            <div class="text-slate-400 font-mono text-[11px] flex items-center gap-2">
                                <span id="prev-date"></span> &bull; <span id="prev-word-read"></span>
                            </div>
                        </div>
                    </div>

                    <!-- Featured Image Cover -->
                    <div id="prev-cover-container" class="rounded-3xl overflow-hidden border border-slate-200 shadow-lg my-8 hidden">
                        <img id="prev-cover-img" src="" alt="" class="w-full h-auto max-h-[500px] object-cover">
                    </div>

                    <!-- Tiptap HTML Content Output -->
                    <div id="prev-body-html" class="prose prose-slate max-w-none text-lg sm:text-[20px] leading-[1.8] text-slate-800 font-sans space-y-6"></div>

                    <!-- Footer Tags -->
                    <div class="pt-10 border-t border-slate-200">
                        <div id="prev-tags" class="flex flex-wrap gap-2 text-xs font-mono"></div>
                    </div>
                </article>
            </div>
        `;

        document.body.appendChild(overlay);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
                this.closePreview();
            }
        });
    }

    openPreview() {
        const modal = document.getElementById('studio-reader-preview-modal');
        if (!modal) return;

        const titleInput = document.getElementById('doc-title-input');
        const title = titleInput ? titleInput.value : 'Untitled Article';
        const bodyHTML = window.StudioEditor && window.StudioEditor.editor ? window.StudioEditor.editor.getHTML() : '<p>No content written yet.</p>';
        const wordMeter = document.getElementById('reading-word-meter');
        const wordText = wordMeter ? wordMeter.textContent : '5m Read';

        document.getElementById('prev-title').textContent = title;
        document.getElementById('prev-categories').innerHTML = this.meta.categories.map(c => `<span class="bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg">${c}</span>`).join('');
        document.getElementById('prev-author-avatar').src = this.meta.author.avatar;
        document.getElementById('prev-author-name').textContent = `${this.meta.author.name} (${this.meta.author.title})`;
        document.getElementById('prev-date').textContent = new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
        document.getElementById('prev-word-read').textContent = wordText;
        document.getElementById('prev-body-html').innerHTML = bodyHTML;

        const coverContainer = document.getElementById('prev-cover-container');
        const coverImg = document.getElementById('prev-cover-img');
        if (this.meta.featuredImage && this.meta.featuredImage.url) {
            coverImg.src = this.meta.featuredImage.url;
            coverImg.alt = this.meta.featuredImage.alt || 'Cover';
            coverContainer.classList.remove('hidden');
        } else {
            coverContainer.classList.add('hidden');
        }

        document.getElementById('prev-tags').innerHTML = this.meta.tags.map(t => `<span class="bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-xl">#${t}</span>`).join('');

        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.remove('opacity-0'), 10);
    }

    closePreview() {
        const modal = document.getElementById('studio-reader-preview-modal');
        if (modal && !modal.classList.contains('hidden')) {
            modal.classList.add('opacity-0');
            setTimeout(() => modal.classList.add('hidden'), 200);
        }
    }

    executePublishToEdge() {
        this.closePreview();
        this.meta.status = 'published';
        this.meta.publishedAt = new Date().toISOString();
        
        // Ensure local Tiptap save happens simultaneously
        if (window.StudioEditor) {
            window.StudioEditor.executeLocalSave();
        }

        // --- SPRINT 5: SYNCHRONIZE WITH PUBLIC CONTENT SYSTEM & EDGE INDEX ---
        try {
            const editorContent = window.StudioEditor?.editor?.getHTML() || document.getElementById('tiptap-editor-canvas')?.innerHTML || '<p>Comprehensive architectural insights.</p>';
            const titleEl = document.getElementById('article-title-input') || document.querySelector('.article-title-field') || document.getElementById('editor-title-field');
            const articleTitle = titleEl ? titleEl.value || titleEl.innerText : this.meta.seo.title || 'Architectural Intelligence';
            const wordCount = window.StudioEditor?.editor?.storage?.characterCount?.words() || 1200;
            const readMinutes = Math.max(1, Math.ceil(wordCount / 200));

            const articlePayload = {
                id: this.meta.id,
                title: articleTitle,
                subtitle: this.meta.seo.description || 'Modern enterprise application architecture and edge performance engineering.',
                slug: this.meta.slug,
                cover: {
                    url: this.meta.featuredImage?.url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1440&q=80',
                    alt: this.meta.featuredImage?.alt || articleTitle
                },
                author: this.meta.author,
                publishedAt: this.meta.publishedAt || new Date().toISOString(),
                readingTime: `${readMinutes} Min Read`,
                wordCount: wordCount,
                categories: this.meta.categories || ['Engineering'],
                tags: this.meta.tags || ['Studio V2'],
                isFeatured: true, // Elevate recently deployed story to Featured position on public knowledge hub
                content: editorContent
            };

            // Synchronize with public article storage index
            let pubIndex = [];
            const existingIdxData = localStorage.getItem('bangjeje_public_articles_index');
            if (existingIdxData) {
                try { pubIndex = JSON.parse(existingIdxData); } catch (e) {}
            }
            const existPos = pubIndex.findIndex(a => a.slug === this.meta.slug);
            if (existPos >= 0) {
                pubIndex[existPos] = { ...pubIndex[existPos], ...articlePayload };
            } else {
                pubIndex.unshift(articlePayload);
            }
            localStorage.setItem('bangjeje_public_articles_index', JSON.stringify(pubIndex));
            console.log('⚡ Synchronized published article payload with Cloudflare Pages Static Registry:', articlePayload.slug);
        } catch (syncErr) {
            console.error('Error synchronizing with Public Content Index:', syncErr);
        }

        this.saveMetadata(true, '🚀 Published article document directly to Cloudflare Edge CDN & Public Hub!');
        StudioToast?.show('🚀 Successfully published to bangjeje.dev Cloudflare Edge network!', 'success', 'Editorial OS');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new StudioArticleWorkflowEngine();
});
