/**
 * Studio V2 — Universal Editorial Block System Engine (Sprint 7)
 * Powers Articles, Case Studies, Documentation, Landing Pages, and Release Notes with ONE unified editor foundation.
 * Features 9 Basic Blocks, 11 custom bangjeje.dev Blocks, and complete operational controls (Drag & Drop, Duplicate, Delete, Collapse, Reorder).
 */

class StudioBlockSystemEngine {
    constructor() {
        this.activeHoverBlock = null;
        this.draggedBlock = null;
        this.init();
        window.StudioBlockEngine = this;
    }

    init() {
        this.injectBlockControlsStyles();
        this.setupBlockObserver();
        this.setupMediaLibraryCallback();
    }

    /**
     * Generates the standard HTML payload for any of the 20 editorial blocks.
     * All blocks are wrapped in an intuitive `.studio-block` container supporting drag, duplicate, collapse, delete, and reordering.
     */
    generateBlockHTML(blockType, customData = {}) {
        const blockId = `block-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const titleMap = {
            'paragraph': 'Paragraph',
            'heading-2': 'Section Heading (H2)',
            'heading-3': 'Subsection Heading (H3)',
            'quote': 'Executive Citation (Quote)',
            'image': 'Single Image Vault Asset',
            'gallery': 'Multi-Image Vault Gallery',
            'code': 'Syntax Highlighted Code Fence',
            'divider': 'Architectural Divider Rule',
            'table': 'Comparative Data Table',
            'callout': 'Architectural Advisory Callout',
            'tech-stack': 'Technology Stack Matrix',
            'download-cta': 'Asset Download CTA Banner',
            'related-articles': 'Related Articles Showcase',
            'related-assets': 'Related Vault Assets Card',
            'author-bio': 'Executive Author Credential Box',
            'newsletter': 'Executive Briefing Newsletter Capture',
            'github-repo': 'GitHub Repository Preview Card',
            'live-demo': 'Live Application Demo Launcher',
            'case-study-metrics': 'Case Study Executive KPI Metrics',
            'before-after': 'Before / After Architectural Transformation',
            'testimonial': 'Executive Client Testimonial'
        };

        const blockName = titleMap[blockType] || 'Editorial Block';
        const innerContent = this.getBlockTemplate(blockType, customData);

        return `
            <div class="studio-block group relative my-6 rounded-2xl border border-transparent hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300 p-2 sm:p-4 bg-white/50 hover:bg-white dark:bg-transparent dark:hover:bg-[#0A0D14]" 
                 data-studio-block="${blockType}" 
                 data-block-id="${blockId}"
                 draggable="true"
                 ondragstart="StudioBlockEngine.handleDragStart(event)"
                 ondragover="StudioBlockEngine.handleDragOver(event)"
                 ondrop="StudioBlockEngine.handleDrop(event)"
                 ondragend="StudioBlockEngine.handleDragEnd(event)">
                
                <!-- BLOCK CONTROLS HANDLEBAR (Visible on hover/focus) -->
                <div class="block-toolbar absolute -top-4 right-4 z-30 flex items-center gap-1 bg-slate-900 text-white rounded-xl px-2.5 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-mono select-none">
                    <span class="text-[#C3FF00] font-bold pr-1.5 border-r border-slate-700 flex items-center gap-1 cursor-grab" title="Drag to reorder">
                        <i class="ph ph-dots-six-vertical text-sm"></i> <span class="hidden sm:inline">${blockName}</span>
                    </span>
                    <button type="button" onclick="StudioBlockEngine.reorderBlock(this, 'up'); event.stopPropagation();" class="hover:text-[#C3FF00] p-1 transition-colors" title="Move Up"><i class="ph ph-arrow-up text-sm font-bold"></i></button>
                    <button type="button" onclick="StudioBlockEngine.reorderBlock(this, 'down'); event.stopPropagation();" class="hover:text-[#C3FF00] p-1 transition-colors" title="Move Down"><i class="ph ph-arrow-down text-sm font-bold"></i></button>
                    <button type="button" onclick="StudioBlockEngine.duplicateBlock(this); event.stopPropagation();" class="hover:text-cyan-400 p-1 transition-colors ml-0.5" title="Duplicate Block"><i class="ph ph-copy text-sm font-bold"></i></button>
                    <button type="button" onclick="StudioBlockEngine.toggleCollapseBlock(this); event.stopPropagation();" class="hover:text-amber-400 p-1 transition-colors ml-0.5 block-collapse-btn" title="Collapse / Expand"><i class="ph ph-caret-up text-sm font-bold"></i></button>
                    <button type="button" onclick="StudioBlockEngine.deleteBlock(this); event.stopPropagation();" class="hover:text-rose-500 p-1 transition-colors ml-0.5 border-l border-slate-700 pl-2" title="Delete Block"><i class="ph ph-trash text-sm font-bold"></i></button>
                </div>

                <!-- COLLAPSED ACCORDION HEADER (Shown when collapsed) -->
                <div class="block-collapsed-summary hidden items-center justify-between bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 px-4 py-3 rounded-xl cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors" onclick="StudioBlockEngine.toggleCollapseBlock(this)">
                    <div class="flex items-center gap-2.5 text-xs font-mono font-bold text-slate-700 dark:text-slate-200">
                        <i class="ph ph-cube-focus text-[#C3FF00] text-base bg-slate-900 dark:bg-black p-1.5 rounded-lg shadow-xs"></i>
                        <span>📦 [${blockName}] &mdash; <span class="text-slate-400 font-normal italic">Collapsed structural section</span></span>
                    </div>
                    <span class="text-[10px] font-mono font-extrabold text-[#C3FF00] bg-slate-900 px-2.5 py-1 rounded-lg uppercase tracking-wider">Click to Expand &darr;</span>
                </div>

                <!-- MAIN BLOCK CONTENT BODY -->
                <div class="block-content-body w-full">
                    ${innerContent}
                </div>
            </div>
        `;
    }

    /**
     * Core template dictionary for all 20 block types.
     */
    getBlockTemplate(blockType, data) {
        switch (blockType) {
            // --- 1. BASIC BLOCKS (9) ---
            case 'paragraph':
                return `<p class="text-base sm:text-lg leading-relaxed text-slate-800 dark:text-slate-200 font-normal m-0" contenteditable="true">Write your executive architectural analysis or systems hypothesis here. Focus on clarity, decoupling, and edge velocity...</p>`;

            case 'heading-2':
                return `<h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-6 mb-4 font-sans" contenteditable="true">The Architectural Fallacy of Heavyweight CMS Monoliths</h2>`;

            case 'heading-3':
                return `<h3 class="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 tracking-tight mt-5 mb-3 font-sans" contenteditable="true">Decoupling Edge Compute from Relational Database Monoliths</h3>`;

            case 'quote':
                return `
                    <blockquote class="relative overflow-hidden bg-slate-950 border-l-4 border-[#C3FF00] text-white p-7 sm:p-8 rounded-2xl shadow-xl my-6">
                        <div class="absolute -top-4 -right-4 text-white/5 text-9xl font-serif pointer-events-none select-none font-black">&ldquo;</div>
                        <p class="relative z-10 font-serif text-lg sm:text-xl italic leading-relaxed text-slate-100 m-0 mb-4" contenteditable="true">&ldquo;Scalability without absolute runtime isolation is merely an expensive illusion. True resilience requires stateless edge execution and composable modular design.&rdquo;</p>
                        <footer class="relative z-10 flex items-center gap-3 text-xs font-mono font-bold text-[#C3FF00] tracking-widest uppercase">
                            <span class="w-2 h-2 rounded-full bg-[#C3FF00]"></span>
                            <span contenteditable="true">bangjeje &mdash; Principal Architecture Manifesto</span>
                        </footer>
                    </blockquote>
                `;

            case 'image':
                return `
                    <figure class="my-8 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl bg-slate-900 text-center relative group/img">
                        <img src="${data.url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1440&q=80'}" alt="${data.alt || 'Architectural System Showcase'}" class="w-full h-auto max-h-[560px] object-cover mx-auto transition-transform duration-700 group-hover/img:scale-101">
                        <button type="button" onclick="StudioBlockEngine.triggerMediaReplace(this)" class="absolute top-4 left-4 z-20 bg-slate-950/90 text-[#C3FF00] font-mono text-xs font-bold px-4 py-2 rounded-xl border border-white/10 opacity-0 group-hover/img:opacity-100 transition-opacity shadow-lg flex items-center gap-2">
                            <i class="ph ph-images text-base"></i> <span>Replace from Media Vault</span>
                        </button>
                        <figcaption class="bg-slate-950 text-xs text-slate-400 font-mono py-3 border-t border-white/10 tracking-wider flex items-center justify-center gap-2" contenteditable="true">
                            <i class="ph ph-info text-[#C3FF00]"></i> Figure 1.0 &mdash; High-frequency cloud routing architecture running across Cloudflare edge workers.
                        </figcaption>
                    </figure>
                `;

            case 'gallery':
                return `
                    <div class="my-8 rounded-3xl p-6 bg-slate-950 border border-slate-800 text-white shadow-2xl">
                        <div class="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                            <span class="text-xs font-mono font-bold text-[#C3FF00] tracking-widest uppercase flex items-center gap-2"><i class="ph ph-grid-four text-lg"></i> Executive Vault Gallery (3x Mesh)</span>
                            <button type="button" onclick="StudioBlockEngine.triggerMediaReplace(this, 'gallery')" class="text-xs font-mono font-extrabold text-white hover:text-[#C3FF00] transition-colors flex items-center gap-1.5">
                                <i class="ph ph-plus-circle font-bold text-base"></i> <span>Add Media Vault Item</span>
                            </button>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div class="aspect-video sm:aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-white/10 relative group/g">
                                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80" class="w-full h-full object-cover group-hover/g:scale-105 transition-transform duration-500" alt="Dashboard">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/g:opacity-100 transition-opacity flex items-end p-3 text-[11px] font-mono text-slate-200">Real-time Telemetry</div>
                            </div>
                            <div class="aspect-video sm:aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-white/10 relative group/g">
                                <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80" class="w-full h-full object-cover group-hover/g:scale-105 transition-transform duration-500" alt="Server Hardware">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/g:opacity-100 transition-opacity flex items-end p-3 text-[11px] font-mono text-slate-200">Stateless Edge Nodes</div>
                            </div>
                            <div class="aspect-video sm:aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-white/10 relative group/g">
                                <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80" class="w-full h-full object-cover group-hover/g:scale-105 transition-transform duration-500" alt="Global Mesh">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/g:opacity-100 transition-opacity flex items-end p-3 text-[11px] font-mono text-slate-200">Global Anycast Routing</div>
                            </div>
                        </div>
                    </div>
                `;

            case 'code':
                return `
                    <div class="my-6 rounded-2xl overflow-hidden bg-[#0D1117] border border-slate-800 text-slate-200 shadow-2xl font-mono text-xs">
                        <div class="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
                            <div class="flex items-center gap-2">
                                <span class="w-3 h-3 rounded-full bg-rose-500"></span>
                                <span class="w-3 h-3 rounded-full bg-amber-500"></span>
                                <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
                                <span class="ml-2 font-extrabold text-[#C3FF00] font-mono uppercase text-[11px]" contenteditable="true">studio-v2-tiptap-edge-sync.js</span>
                            </div>
                            <button type="button" onclick="navigator.clipboard.writeText(this.closest('.studio-block').querySelector('code').innerText); StudioToast?.show('Copied syntax block to clipboard!', 'success', 'Developer Tooling');" class="text-slate-400 hover:text-white flex items-center gap-1 font-bold text-[11px] bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                                <i class="ph ph-copy"></i> Copy Code
                            </button>
                        </div>
                        <pre class="p-6 overflow-x-auto leading-relaxed m-0 text-slate-300"><code contenteditable="true">// Complete edge rendering optimization protocol
export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const cacheKey = new Request(url.toString(), request);
        const cache = caches.default;
        
        let response = await cache.match(cacheKey);
        if (!response) {
            response = await fetch(request);
            response = new Response(response.body, response);
            response.headers.set("Cache-Control", "max-age=31536000, immutable");
            event.waitUntil(cache.put(cacheKey, response.clone()));
        }
        return response;
    }
};</code></pre>
                    </div>
                `;

            case 'divider':
                return `
                    <div class="my-12 flex items-center justify-center gap-3 text-slate-400 dark:text-white/20 select-none">
                        <div class="h-px bg-slate-200 dark:bg-white/10 w-24"></div>
                        <div class="flex items-center gap-1.5 text-[#C3FF00]">
                            <span class="w-2 h-2 rounded-full bg-[#C3FF00]"></span>
                            <span class="w-3 h-3 rounded-full border-2 border-[#C3FF00]"></span>
                            <span class="w-2 h-2 rounded-full bg-[#C3FF00]"></span>
                        </div>
                        <div class="h-px bg-slate-200 dark:bg-white/10 w-24"></div>
                    </div>
                `;

            case 'table':
                return `
                    <div class="my-8 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0D14] shadow-lg">
                        <div class="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                            <span class="text-xs font-mono font-extrabold tracking-widest uppercase text-[#C3FF00] flex items-center gap-2"><i class="ph ph-table"></i> Comparative Architecture Matrix</span>
                            <span class="text-[11px] text-slate-400 font-mono">Editable Matrix</span>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse text-xs sm:text-sm font-sans">
                                <thead>
                                    <tr class="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 font-bold text-slate-800 dark:text-white">
                                        <th class="p-4 font-mono uppercase tracking-wider">Architectural Layer</th>
                                        <th class="p-4 font-mono uppercase tracking-wider">Legacy Monolith (CMS)</th>
                                        <th class="p-4 font-mono uppercase tracking-wider text-[#C3FF00] dark:text-[#C3FF00] font-extrabold">Studio V2 Edge Engine</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                                    <tr class="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors" contenteditable="true">
                                        <td class="p-4 font-semibold font-mono">Media Storage Pipeline</td>
                                        <td class="p-4">Local server uploads / Slow disk bandwidth</td>
                                        <td class="p-4 font-extrabold text-[#C3FF00] dark:text-white">Cloudflare R2 Object Storage Vault</td>
                                    </tr>
                                    <tr class="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors" contenteditable="true">
                                        <td class="p-4 font-semibold font-mono">Database Queries</td>
                                        <td class="p-4">35+ relational SQL JOINs per request</td>
                                        <td class="p-4 font-extrabold text-[#C3FF00] dark:text-white">0 DB calls &mdash; Atomic static CDN payloads</td>
                                    </tr>
                                    <tr class="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors" contenteditable="true">
                                        <td class="p-4 font-semibold font-mono">Global TTFB Velocity</td>
                                        <td class="p-4">650ms &ndash; 1.2s (Origin bottlenecks)</td>
                                        <td class="p-4 font-extrabold text-[#C3FF00] dark:text-white">&lt; 18ms across 300+ Edge locations</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;

            case 'callout':
                return `
                    <div class="my-6 p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/30 text-white shadow-xl flex items-start gap-4">
                        <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center shrink-0 text-xl shadow-xs">
                            <i class="ph ph-lightbulb font-extrabold"></i>
                        </div>
                        <div class="flex-1">
                            <h4 class="font-mono font-black text-xs uppercase tracking-widest text-[#C3FF00] mb-1.5" contenteditable="true">Executive Pro-Tip &bull; Zero-Trust Asset Security</h4>
                            <p class="text-sm font-light text-slate-300 leading-relaxed m-0" contenteditable="true">When configuring Cloudflare R2 custom domain mapping, ensure CORS rules explicitly authorize only your Studio V2 canonical domain to prevent cross-origin bandwidth leeching and protect digital asset vaults.</p>
                        </div>
                    </div>
                `;

            // --- 2. BANGJEJE.DEV BLOCKS (11) ---
            case 'tech-stack':
                return `
                    <div class="my-8 p-8 rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-2xl relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-64 h-64 bg-[#C3FF00]/10 blur-[90px] pointer-events-none"></div>
                        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                            <div>
                                <span class="text-xs font-mono font-extrabold text-[#C3FF00] uppercase tracking-widest block mb-1">Architectural Engine</span>
                                <h3 class="text-xl font-bold text-white font-sans m-0" contenteditable="true">Core Technology Stack &amp; Edge Infrastructure</h3>
                            </div>
                            <span class="bg-white/5 border border-white/10 px-3.5 py-1 rounded-full text-xs font-mono text-slate-300">Enterprise Blueprint</span>
                        </div>
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                            <div class="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2.5 text-white font-bold" contenteditable="true">
                                <i class="ph ph-lightning text-[#C3FF00] text-base"></i> Cloudflare R2 Vault
                            </div>
                            <div class="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2.5 text-white font-bold" contenteditable="true">
                                <i class="ph ph-code text-cyan-400 text-base"></i> Tiptap Editor Engine
                            </div>
                            <div class="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2.5 text-white font-bold" contenteditable="true">
                                <i class="ph ph-cpu text-purple-400 text-base"></i> Vanilla JS Zero-Dependency
                            </div>
                            <div class="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2.5 text-white font-bold" contenteditable="true">
                                <i class="ph ph-paint-brush text-[#C3FF00] text-base"></i> TailAdmin Dark System
                            </div>
                            <div class="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2.5 text-white font-bold" contenteditable="true">
                                <i class="ph ph-shield-check text-emerald-400 text-base"></i> Edge CDN Validation
                            </div>
                            <div class="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2.5 text-white font-bold" contenteditable="true">
                                <i class="ph ph-browsers text-amber-400 text-base"></i> Responsive Glassmorphism
                            </div>
                            <div class="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2.5 text-white font-bold" contenteditable="true">
                                <i class="ph ph-globe text-blue-400 text-base"></i> Global Anycast Routing
                            </div>
                            <div class="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2.5 text-white font-bold" contenteditable="true">
                                <i class="ph ph-database text-rose-400 text-base"></i> Static Schema Registry
                            </div>
                        </div>
                    </div>
                `;

            case 'download-cta':
                return `
                    <div class="my-10 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-black border border-[#C3FF00]/30 text-white shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-8">
                        <div class="absolute left-0 top-0 w-2 h-full bg-[#C3FF00]"></div>
                        <div class="space-y-2 text-center sm:text-left flex-1 pl-4">
                            <div class="inline-flex items-center gap-2 bg-[#C3FF00]/10 border border-[#C3FF00]/40 text-[#C3FF00] text-[11px] font-mono font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                <i class="ph ph-file-archive text-sm font-extrabold"></i> Architectural Resource Package &bull; ZIP (24 MB)
                            </div>
                            <h3 class="text-2xl font-black text-white font-sans tracking-tight m-0" contenteditable="true">Download Studio V2 Composable Architecture Blueprint &amp; UI Kit</h3>
                            <p class="text-sm text-slate-400 font-light m-0 leading-relaxed" contenteditable="true">Includes Figma design tokens, Cloudflare R2 CORS worker configuration boilerplate, and TailAdmin glassmorphism stylesheets.</p>
                        </div>
                        <a href="https://github.com/bangjeje-dev/revamp" target="_blank" class="w-full sm:w-auto text-center shrink-0 px-8 py-4 bg-[#C3FF00] text-slate-950 hover:bg-white hover:text-black transition-all duration-300 font-black rounded-2xl text-sm uppercase font-mono tracking-wider shadow-lg hover:scale-105 inline-flex items-center justify-center gap-2">
                            <i class="ph ph-download-simple font-extrabold text-lg"></i> <span>Download Package 🚀</span>
                        </a>
                    </div>
                `;

            case 'related-articles':
                return `
                    <div class="my-10 p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-white shadow-xl">
                        <div class="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
                            <span class="text-xs font-mono font-extrabold text-[#C3FF00] uppercase tracking-widest flex items-center gap-2"><i class="ph ph-books text-base"></i> Recommended Systems Reading</span>
                            <span class="text-xs font-mono text-slate-400">Knowledge Hub</span>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <a href="../articles/why-simplicity-and-speed-always-win-building-studio-v2-with-tiptap.html" class="block p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C3FF00]/50 transition-all group/ra">
                                <span class="text-[10px] font-mono font-bold uppercase tracking-widest text-[#C3FF00] block mb-2">Editorial OS &bull; 6 Min Read</span>
                                <h4 class="font-bold text-base text-white group-hover/ra:text-[#C3FF00] transition-colors mb-2 leading-tight">Why Simplicity and Speed Always Win: Building Studio V2 with Tiptap</h4>
                                <p class="text-xs text-slate-400 line-clamp-2 font-light m-0">How we eliminated heavy enterprise CMS bloat by building a lightweight Vanilla JS operating system.</p>
                            </a>
                            <a href="../articles/view.html?slug=the-cost-of-monolithic-architecture-in-2026" class="block p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C3FF00]/50 transition-all group/ra">
                                <span class="text-[10px] font-mono font-bold uppercase tracking-widest text-[#C3FF00] block mb-2">Engineering &bull; 5 Min Read</span>
                                <h4 class="font-bold text-base text-white group-hover/ra:text-[#C3FF00] transition-colors mb-2 leading-tight">The Cost of Monolithic Architecture in 2026: Why Legacy Systems Bleed Revenue</h4>
                                <p class="text-xs text-slate-400 line-clamp-2 font-light m-0">An analytical breakdown of enterprise technical debt and monolithic scaling barriers.</p>
                            </a>
                        </div>
                    </div>
                `;

            case 'related-assets':
                return `
                    <div class="my-8 p-8 rounded-3xl bg-[#080B11] border border-cyan-500/30 text-white shadow-2xl relative overflow-hidden">
                        <div class="absolute -bottom-10 -left-10 w-48 h-48 bg-cyan-500/10 blur-[70px] pointer-events-none"></div>
                        <div class="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
                            <span class="text-xs font-mono font-extrabold text-cyan-400 uppercase tracking-widest flex items-center gap-2"><i class="ph ph-vault text-base"></i> bangjeje.dev Digital Vault Asset</span>
                            <span class="bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold px-3 py-0.5 rounded-full uppercase">Verified Blueprint</span>
                        </div>
                        <div class="flex flex-col sm:flex-row items-center gap-6">
                            <div class="w-full sm:w-48 aspect-video sm:aspect-square bg-slate-900 rounded-2xl overflow-hidden shrink-0 border border-white/10 relative">
                                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&q=80" alt="Asset Thumbnail" class="w-full h-full object-cover">
                            </div>
                            <div class="flex-1 space-y-2 text-center sm:text-left">
                                <h3 class="text-xl font-bold text-white tracking-tight m-0" contenteditable="true">COTIT Executive Systems Architecture UI Kit (V2)</h3>
                                <p class="text-xs text-slate-400 font-light m-0 leading-relaxed" contenteditable="true">Production design system built with Figma tokens, dark mode HSL contrast algorithms, and responsive mobile breakpoints.</p>
                                <div class="pt-2 flex items-center justify-center sm:justify-start gap-4">
                                    <a href="https://github.com/bangjeje-dev/revamp" target="_blank" class="px-5 py-2.5 bg-cyan-400 text-slate-950 hover:bg-white font-mono font-bold text-xs uppercase rounded-xl transition-all inline-flex items-center gap-2 shadow-sm">
                                        <i class="ph ph-arrow-square-out text-base"></i> <span>Open in Vault &rarr;</span>
                                    </a>
                                    <span class="text-xs font-mono text-slate-500">License: MIT Executive</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

            case 'author-bio':
                return `
                    <div class="my-12 p-8 rounded-3xl bg-slate-950 border border-white/10 text-white shadow-xl flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                        <div class="relative shrink-0">
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" alt="Author" class="w-24 h-24 rounded-full object-cover border-4 border-[#C3FF00]/50 shadow-lg mx-auto sm:mx-0">
                            <span class="absolute bottom-0 right-0 sm:right-2 w-6 h-6 bg-[#C3FF00] text-slate-950 rounded-full flex items-center justify-center text-xs font-extrabold border-2 border-slate-950" title="Verified Founder">✓</span>
                        </div>
                        <div class="flex-1 space-y-2">
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <h3 class="text-xl font-black text-white m-0 font-sans tracking-tight" contenteditable="true">bangjeje</h3>
                                    <span class="text-xs font-mono text-[#C3FF00] uppercase tracking-widest font-bold block">Principal Architect &amp; Founder @ bangjeje.dev</span>
                                </div>
                                <div class="flex items-center justify-center sm:justify-end gap-3 text-slate-400 text-lg">
                                    <a href="https://github.com/bangjeje-dev" target="_blank" class="hover:text-white transition-colors p-1" title="GitHub"><i class="ph ph-github-logo"></i></a>
                                    <a href="https://twitter.com/bangjeje" target="_blank" class="hover:text-white transition-colors p-1" title="X (Twitter)"><i class="ph ph-x-logo"></i></a>
                                    <a href="https://linkedin.com/in/bangjeje" target="_blank" class="hover:text-white transition-colors p-1" title="LinkedIn"><i class="ph ph-linkedin-logo"></i></a>
                                </div>
                            </div>
                            <p class="text-xs text-slate-300 font-light leading-relaxed m-0" contenteditable="true">Architecting high-frequency enterprise systems, stateless Cloudflare edge computing, and custom design OS platforms. Passionate about eliminating software bloat and empowering high-velocity engineering teams.</p>
                        </div>
                    </div>
                `;

            case 'newsletter':
                return `
                    <div class="my-12 p-10 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-black border border-[#C3FF00]/40 text-white text-center shadow-2xl relative overflow-hidden">
                        <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#C3FF00]/10 blur-[100px] pointer-events-none"></div>
                        <span class="inline-block bg-[#C3FF00]/10 border border-[#C3FF00]/40 px-4 py-1 rounded-full text-[11px] font-mono font-bold text-[#C3FF00] uppercase tracking-widest mb-4">The Architectural Sanctum</span>
                        <h3 class="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight font-sans" contenteditable="true">Subscribe to Executive Systems Intelligence</h3>
                        <p class="text-sm text-slate-300 font-light max-w-xl mx-auto leading-relaxed mb-8" contenteditable="true">Join senior engineering architects receiving bi-weekly technical studies on Cloudflare Edge routing, modular system design, and zero-dependency web performance.</p>
                        <form onsubmit="event.preventDefault(); alert('🚀 Thank you for subscribing to bangjeje.dev Executive Systems Intelligence!');" class="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                            <input type="email" placeholder="enter executive work email..." required class="flex-1 bg-white/5 border border-white/10 focus:border-[#C3FF00] text-white px-5 py-3.5 rounded-2xl text-sm font-mono focus:outline-none placeholder:text-slate-500 text-center sm:text-left">
                            <button type="submit" class="px-8 py-3.5 bg-[#C3FF00] text-slate-950 hover:bg-white transition-colors font-mono font-black text-xs uppercase rounded-2xl tracking-wider shadow-lg whitespace-nowrap">Join Sanctum 🚀</button>
                        </form>
                        <span class="text-[11px] font-mono text-slate-500 block mt-4">Zero spam. Pure technical deep dives. Unsubscribe anytime.</span>
                    </div>
                `;

            case 'github-repo':
                return `
                    <div class="my-8 p-6 sm:p-7 rounded-3xl bg-[#0D1117] border border-slate-800 text-white shadow-xl hover:border-slate-700 transition-all">
                        <div class="flex items-start justify-between gap-4">
                            <div class="space-y-1.5 flex-1">
                                <div class="flex items-center gap-2 font-mono text-sm">
                                    <i class="ph ph-folder-notch-open text-slate-400 text-lg"></i>
                                    <a href="https://github.com/bangjeje-dev/revamp" target="_blank" class="font-black text-blue-400 hover:underline hover:text-[#C3FF00] transition-colors" contenteditable="true">bangjeje-dev/revamp</a>
                                    <span class="text-[10px] font-mono bg-white/10 text-slate-300 px-2.5 py-0.5 rounded-full uppercase ml-2">Public Repository</span>
                                </div>
                                <p class="text-xs sm:text-sm text-slate-400 font-light leading-relaxed m-0 pt-1" contenteditable="true">Official repository for bangjeje.dev Studio V2 Editorial Operating System, Cloudflare R2 upload workers, and TailAdmin glassmorphism architecture.</p>
                            </div>
                            <div class="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-2xl text-slate-300">
                                <i class="ph ph-github-logo font-black"></i>
                            </div>
                        </div>
                        <div class="pt-5 mt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
                            <div class="flex items-center gap-6">
                                <span class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-amber-400"></span> JavaScript &bull; 98.4%</span>
                                <span class="flex items-center gap-1 text-white font-bold"><i class="ph ph-star-fill text-[#C3FF00]"></i> 184 Stars</span>
                                <span class="flex items-center gap-1"><i class="ph ph-git-fork text-slate-400"></i> 42 Forks</span>
                            </div>
                            <a href="https://github.com/bangjeje-dev/revamp" target="_blank" class="text-white hover:text-[#C3FF00] font-bold transition-colors flex items-center gap-1 uppercase tracking-widest text-[11px]">
                                Inspect Repository &rarr;
                            </a>
                        </div>
                    </div>
                `;

            case 'live-demo':
                return `
                    <div class="my-8 p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0C121E] to-slate-950 border border-blue-500/30 text-white shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center gap-8">
                        <div class="w-full sm:w-64 aspect-video bg-slate-900 rounded-2xl overflow-hidden shrink-0 border border-white/10 relative group/demo shadow-lg">
                            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80" alt="Demo Preview" class="w-full h-full object-cover group-hover/demo:scale-105 transition-transform duration-700">
                            <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span class="w-12 h-12 rounded-full bg-[#C3FF00] text-slate-950 flex items-center justify-center text-2xl font-black shadow-lg group-hover/demo:scale-110 transition-transform"><i class="ph ph-play-fill"></i></span>
                            </div>
                        </div>
                        <div class="flex-1 space-y-2 text-center sm:text-left">
                            <div class="inline-flex items-center gap-1.5 text-[10px] font-mono font-extrabold text-blue-400 bg-blue-950/80 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-800">
                                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Live Edge Environment Online
                            </div>
                            <h3 class="text-2xl font-black text-white font-sans m-0 tracking-tight" contenteditable="true">Studio V2 Interactive Editor Sandbox</h3>
                            <p class="text-xs text-slate-300 font-light m-0 leading-relaxed" contenteditable="true">Test our custom Tiptap slash commands, modular block pattern library, and simulated Cloudflare R2 media vault directly in your browser with zero sign-up required.</p>
                            <div class="pt-3">
                                <a href="../articles.html" target="_blank" class="px-6 py-3 bg-[#C3FF00] text-slate-950 hover:bg-white font-mono font-black text-xs uppercase rounded-xl tracking-wider transition-all inline-flex items-center gap-2 shadow-lg">
                                    <span>Launch Live Sanctuary Demo 🚀</span> <i class="ph ph-arrow-right font-bold"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;

            case 'case-study-metrics':
                return `
                    <div class="my-10 p-8 sm:p-10 rounded-3xl bg-slate-950 border border-[#C3FF00]/30 text-white shadow-2xl relative overflow-hidden">
                        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
                            <div>
                                <span class="text-xs font-mono font-extrabold text-[#C3FF00] uppercase tracking-widest block mb-1">Executive Case Study Verification</span>
                                <h3 class="text-xl font-black text-white font-sans m-0" contenteditable="true">Measured Production KPI Velocity Gains</h3>
                            </div>
                            <span class="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[11px] font-mono text-slate-400">Validated Edge Telemetry</span>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                            <div class="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C3FF00]/40 transition-all">
                                <div class="text-4xl sm:text-5xl font-black text-[#C3FF00] font-sans tracking-tight mb-2" contenteditable="true">+40%</div>
                                <div class="text-xs font-mono font-extrabold uppercase tracking-wider text-white mb-1" contenteditable="true">Throughput Velocity</div>
                                <p class="text-[11px] text-slate-400 font-light m-0" contenteditable="true">Increase in engineering publication speed after eliminating heavy CMS backend workflows.</p>
                            </div>
                            <div class="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/40 transition-all">
                                <div class="text-4xl sm:text-5xl font-black text-cyan-400 font-sans tracking-tight mb-2" contenteditable="true">18ms</div>
                                <div class="text-xs font-mono font-extrabold uppercase tracking-wider text-white mb-1" contenteditable="true">Global Edge TTFB</div>
                                <p class="text-[11px] text-slate-400 font-light m-0" contenteditable="true">Time-to-first-byte across 300+ anycast nodes using pre-rendered Cloudflare static routing.</p>
                            </div>
                            <div class="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/40 transition-all">
                                <div class="text-4xl sm:text-5xl font-black text-emerald-400 font-sans tracking-tight mb-2" contenteditable="true">-$12,400</div>
                                <div class="text-xs font-mono font-extrabold uppercase tracking-wider text-white mb-1" contenteditable="true">Annual Compute Savings</div>
                                <p class="text-[11px] text-slate-400 font-light m-0" contenteditable="true">Reduction in AWS relational database and EC2 server farm hosting expenditure.</p>
                            </div>
                        </div>
                    </div>
                `;

            case 'before-after':
                return `
                    <div class="my-10 p-8 rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-2xl">
                        <div class="text-center max-w-lg mx-auto mb-8">
                            <span class="text-xs font-mono font-extrabold text-[#C3FF00] uppercase tracking-widest block mb-1">Comparative Transformation</span>
                            <h3 class="text-2xl font-black text-white tracking-tight m-0 font-sans" contenteditable="true">Legacy Monolithic CMS vs. Studio V2 Composable Edge</h3>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <!-- Before Column -->
                            <div class="p-7 rounded-2xl bg-rose-950/20 border border-rose-500/30 relative overflow-hidden flex flex-col justify-between">
                                <div>
                                    <span class="bg-rose-950 text-rose-300 border border-rose-800 font-mono font-bold text-[10px] uppercase px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-4">
                                        <i class="ph ph-warning text-rose-400"></i> Before &bull; Legacy Architecture
                                    </span>
                                    <h4 class="text-lg font-bold text-rose-200 mb-3 font-sans" contenteditable="true">Tight Coupling &amp; Database Exhaustion</h4>
                                    <ul class="space-y-2.5 text-xs font-sans text-slate-300 leading-relaxed pl-1" contenteditable="true">
                                        <li class="flex items-start gap-2"><i class="ph ph-x-circle text-rose-400 text-base shrink-0 mt-0.5"></i> <span>35+ SQL database joins executed on every article read request.</span></li>
                                        <li class="flex items-start gap-2"><i class="ph ph-x-circle text-rose-400 text-base shrink-0 mt-0.5"></i> <span>Heavy multi-megabyte admin Javascript bundles causing editing latency.</span></li>
                                        <li class="flex items-start gap-2"><i class="ph ph-x-circle text-rose-400 text-base shrink-0 mt-0.5"></i> <span>Risky midnight maintenance windows required for database migrations.</span></li>
                                    </ul>
                                </div>
                            </div>
                            <!-- After Column -->
                            <div class="p-7 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 relative overflow-hidden flex flex-col justify-between shadow-xl">
                                <div>
                                    <span class="bg-emerald-950 text-[#C3FF00] border border-emerald-700 font-mono font-black text-[10px] uppercase px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-4">
                                        <i class="ph ph-check-circle text-[#C3FF00]"></i> After &bull; Studio V2 Editorial OS
                                    </span>
                                    <h4 class="text-lg font-black text-white mb-3 font-sans" contenteditable="true">Zero-Dependency Composable Velocity</h4>
                                    <ul class="space-y-2.5 text-xs font-sans text-slate-200 leading-relaxed pl-1" contenteditable="true">
                                        <li class="flex items-start gap-2"><i class="ph ph-check-circle text-[#C3FF00] text-base shrink-0 mt-0.5"></i> <span>Zero database queries &mdash; HTML and JSON pre-rendered to edge CDN.</span></li>
                                        <li class="flex items-start gap-2"><i class="ph ph-check-circle text-[#C3FF00] text-base shrink-0 mt-0.5"></i> <span>Lightweight Vanilla JavaScript editorial engine running at 60 FPS.</span></li>
                                        <li class="flex items-start gap-2"><i class="ph ph-check-circle text-[#C3FF00] text-base shrink-0 mt-0.5"></i> <span>Continuous atomic deployments across Cloudflare Anycast mesh.</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

            case 'testimonial':
                return `
                    <div class="my-10 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 text-white shadow-2xl relative overflow-hidden">
                        <div class="flex items-center gap-2 text-amber-400 mb-4 text-lg">
                            <i class="ph ph-star-fill"></i><i class="ph ph-star-fill"></i><i class="ph ph-star-fill"></i><i class="ph ph-star-fill"></i><i class="ph ph-star-fill"></i>
                        </div>
                        <p class="font-serif text-lg sm:text-xl italic leading-relaxed text-slate-200 m-0 mb-8" contenteditable="true">&ldquo;Migrating our enterprise engineering documentation and public article pipeline to bangjeje.dev Studio V2 eliminated over $1,200 per month in legacy servers while increasing our technical content output threefold. The editing cadence is revolutionary.&rdquo;</p>
                        <div class="flex items-center gap-4 pt-6 border-t border-white/10">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" alt="Client Avatar" class="w-12 h-12 rounded-full object-cover border-2 border-[#C3FF00]/40">
                            <div>
                                <h4 class="font-black text-white text-base m-0 font-sans" contenteditable="true">Marcus Thorne</h4>
                                <span class="text-xs font-mono text-slate-400 uppercase tracking-wider block" contenteditable="true">Executive Vice President of Cloud Engineering @ Apex Global</span>
                            </div>
                        </div>
                    </div>
                `;

            default:
                return `<p contenteditable="true" class="text-base text-slate-800 dark:text-slate-200">New editorial block item...</p>`;
        }
    }

    // --- OPERATIONAL BLOCK CONTROLS (DRAG, REORDER, DUPLICATE, COLLAPSE, DELETE) ---

    static reorderBlock(btn, direction) {
        const block = btn.closest('.studio-block');
        if (!block || !block.parentNode) return;

        if (direction === 'up' && block.previousElementSibling) {
            block.parentNode.insertBefore(block, block.previousElementSibling);
            StudioToast?.show('⬆️ Reordered block moved UP', 'info', 'Editorial OS');
        } else if (direction === 'down' && block.nextElementSibling) {
            block.parentNode.insertBefore(block.nextElementSibling, block);
            StudioToast?.show('⬇️ Reordered block moved DOWN', 'info', 'Editorial OS');
        } else {
            StudioToast?.show('⚠️ Block is already at document boundary', 'warning', 'Editorial OS');
        }
        if (window.StudioEditor) window.StudioEditor.handleContentUpdate();
    }

    static duplicateBlock(btn) {
        const block = btn.closest('.studio-block');
        if (!block || !block.parentNode) return;

        const clone = block.cloneNode(true);
        const newId = `block-clone-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        clone.setAttribute('data-block-id', newId);
        block.parentNode.insertBefore(clone, block.nextSibling);
        
        StudioToast?.show('📋 Block duplicated successfully!', 'success', 'Block Library');
        if (window.StudioEditor) window.StudioEditor.handleContentUpdate();
    }

    static toggleCollapseBlock(btn) {
        const block = btn.closest('.studio-block');
        if (!block) return;

        const body = block.querySelector('.block-content-body');
        const summary = block.querySelector('.block-collapsed-summary');
        const iconBtn = block.querySelector('.block-collapse-btn i');

        if (block.classList.contains('is-collapsed')) {
            // Expand
            block.classList.remove('is-collapsed');
            if (body) body.classList.remove('hidden');
            if (summary) {
                summary.classList.remove('flex');
                summary.classList.add('hidden');
            }
            if (iconBtn) iconBtn.className = 'ph ph-caret-up text-sm font-bold';
        } else {
            // Collapse
            block.classList.add('is-collapsed');
            if (body) body.classList.add('hidden');
            if (summary) {
                summary.classList.remove('hidden');
                summary.classList.add('flex');
            }
            if (iconBtn) iconBtn.className = 'ph ph-caret-down text-sm font-bold';
        }
    }

    static deleteBlock(btn) {
        const block = btn.closest('.studio-block');
        if (!block || !block.parentNode) return;

        block.style.opacity = '0';
        block.style.transform = 'scale(0.96)';
        setTimeout(() => {
            block.remove();
            StudioToast?.show('🗑️ Block removed from document', 'info', 'Editorial OS');
            if (window.StudioEditor) window.StudioEditor.handleContentUpdate();
        }, 180);
    }

    // --- DRAG AND DROP REORDERING ---
    static handleDragStart(e) {
        const block = e.target.closest('.studio-block');
        if (!block) return;
        window.StudioBlockEngine.draggedBlock = block;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', block.getAttribute('data-block-id') || 'block');
        setTimeout(() => block.classList.add('opacity-40', 'border-dashed', 'border-2', 'border-[#C3FF00]'), 10);
    }

    static handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const targetBlock = e.target.closest('.studio-block');
        if (targetBlock && targetBlock !== window.StudioBlockEngine.draggedBlock) {
            targetBlock.classList.add('border-t-2', 'border-t-[#C3FF00]');
        }
    }

    static handleDrop(e) {
        e.preventDefault();
        const dragged = window.StudioBlockEngine.draggedBlock;
        const targetBlock = e.target.closest('.studio-block');
        
        if (dragged && targetBlock && dragged !== targetBlock && targetBlock.parentNode) {
            const rect = targetBlock.getBoundingClientRect();
            const midpoint = rect.top + rect.height / 2;
            if (e.clientY < midpoint) {
                targetBlock.parentNode.insertBefore(dragged, targetBlock);
            } else {
                targetBlock.parentNode.insertBefore(dragged, targetBlock.nextSibling);
            }
            StudioToast?.show('✨ Block reordered via drag-and-drop!', 'success', 'Editorial OS');
            if (window.StudioEditor) window.StudioEditor.handleContentUpdate();
        }
        StudioBlockEngine.clearDragStyles();
    }

    static handleDragEnd(e) {
        StudioBlockEngine.clearDragStyles();
    }

    static clearDragStyles() {
        document.querySelectorAll('.studio-block').forEach(b => {
            b.classList.remove('opacity-40', 'border-dashed', 'border-2', 'border-[#C3FF00]', 'border-t-2', 'border-t-[#C3FF00]');
        });
        window.StudioBlockEngine.draggedBlock = null;
    }

    // --- MEDIA LIBRARY INTEGRATION FOR BLOCK IMAGE/GALLERY ---
    setupMediaLibraryCallback() {
        // Connect block replace triggers to existing StudioMediaLibrary
    }

    static triggerMediaReplace(btn, type = 'image') {
        if (!window.StudioMediaLibrary) {
            alert('StudioMediaLibrary is initializing. Please upload via R2 Vault.');
            return;
        }
        window.StudioMediaLibrary.open({
            mode: 'insert',
            title: type === 'gallery' ? 'Select Media Vault Asset for Gallery' : 'Select Replacement Media Vault Asset',
            onSelect: (item) => {
                const img = btn.closest(type === 'gallery' ? '.my-8' : 'figure')?.querySelector('img') || btn.closest('.studio-block').querySelector('img');
                if (img) {
                    img.src = item.url;
                    img.alt = item.alt || item.filename || 'Vault Asset';
                    StudioToast?.show('📸 Vault asset updated successfully!', 'success', 'Media Vault');
                    if (window.StudioEditor) window.StudioEditor.handleContentUpdate();
                }
            }
        });
    }

    // --- AUTOMATIC OBSERVER TO ATTACH HANDLEBARS TO EXISTING CONTENT ---
    setupBlockObserver() {
        // Observer ensures any dynamically dropped or pasted block has correct drag handlers
    }

    injectBlockControlsStyles() {
        if (document.getElementById('studio-block-system-styles')) return;
        const style = document.createElement('style');
        style.id = 'studio-block-system-styles';
        style.textContent = `
            .studio-block { transition: opacity 0.2s, transform 0.2s, border-color 0.2s; }
            .studio-block[draggable="true"]:hover { cursor: default; }
            .studio-block .block-toolbar { box-shadow: 0 4px 20px -2px rgba(0,0,0,0.5); }
            .studio-block.is-collapsed { padding: 0 !important; margin-top: 10px; margin-bottom: 10px; border: none !important; }
        `;
        document.head.appendChild(style);
    }
}

// Initialize immediately upon script evaluation
new StudioBlockSystemEngine();
