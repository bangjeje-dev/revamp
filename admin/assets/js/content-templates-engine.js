/**
 * Studio V2 — Sprint 8 Reusable Content Templates & Content Types Engine
 * 
 * Maximizes author productivity by preloading structured storytelling and engineering architectures
 * directly into the unified Tiptap Editorial Engine. Eliminates fragmented CMS editors by combining 
 * all content models into a single, high-velocity writing workspace.
 * 
 * SUPPORTED CONTENT TYPES (10):
 * 1. Blank Article        6. News
 * 2. Tutorial             7. Documentation
 * 3. Comparison           8. Release Notes
 * 4. Opinion              9. Landing Page
 * 5. Listicle            10. Case Study
 */

class StudioContentTemplatesEngine {
    constructor() {
        this.templates = {
            'blank': {
                id: 'blank',
                title: 'Blank Article',
                category: 'Editorial & Articles',
                badge: 'Empty Canvas',
                icon: 'ph-file-plus',
                desc: 'Immaculate open writing canvas with zero preconceptions. Starts simply with an empty paragraph.',
                blocksSummary: ['Clean writing canvas', 'No preloaded blocks'],
                sampleTitle: ''
            },
            'tutorial': {
                id: 'tutorial',
                title: 'Technical Tutorial',
                category: 'Technical & Guides',
                badge: 'Step-by-step Guide',
                icon: 'ph-code-block',
                desc: 'Pre-structured engineering walkthrough with prerequisite callouts, code syntax fences, and repo previews.',
                blocksSummary: ['Advisory Callout', 'Code Syntax Fences (x2)', 'GitHub Repo Card', 'Related Articles'],
                sampleTitle: 'Building Edge-First Content Vaults with Cloudflare R2 & Vanilla JS'
            },
            'comparison': {
                id: 'comparison',
                title: 'Architecture Comparison',
                category: 'Technical & Guides',
                badge: 'Trade-offs Analysis',
                icon: 'ph-scales',
                desc: 'Comparative evaluation framework contrasting monolithic design patterns against composable edge speed.',
                blocksSummary: ['Before / After Split Columns', 'Comparative Table Matrix', 'Case Study KPI Metrics', 'Author Bio Credential'],
                sampleTitle: 'Composable Edge Architectures vs. Monolithic CMS Platforms: The 2026 Benchmark'
            },
            'opinion': {
                id: 'opinion',
                title: 'Editorial Opinion / Manifesto',
                category: 'Editorial & Articles',
                badge: 'Executive Manifesto',
                icon: 'ph-quotes',
                desc: 'High-contrast editorial layouts featuring bold conversational typography and oversized pull-quote citations.',
                blocksSummary: ['Executive Quote Block', 'Architectural Divider Rule', 'Author Bio Credential'],
                sampleTitle: 'Why Simplicity & Speed Always Win in Software Engineering'
            },
            'listicle': {
                id: 'listicle',
                title: 'Industry Takeaways (Listicle)',
                category: 'Editorial & Articles',
                badge: 'Numbered Takeaways',
                icon: 'ph-list-numbers',
                desc: 'Structured high-frequency engineering takeaways list with modular section breaks and advisory pro-tips.',
                blocksSummary: ['Advisory Callout Pro-Tip', 'Tech Stack Badge Matrix', 'Related Articles Showcase'],
                sampleTitle: '7 Architectural Habits of High-Velocity Software Product Teams'
            },
            'news': {
                id: 'news',
                title: 'Ecosystem Dispatch (News)',
                category: 'Editorial & Articles',
                badge: 'Rapid Dispatch',
                icon: 'ph-newspaper-clipping',
                desc: 'Rapid announcement format optimized for breaking technology releases, ecosystem milestones, and intelligence updates.',
                blocksSummary: ['Advisory Callout Notice', 'Executive Citation Box', 'Newsletter Capture Form'],
                sampleTitle: 'bangjeje.dev Announces Studio V2: Composable Content Systems Powered by Edge AI'
            },
            'documentation': {
                id: 'documentation',
                title: 'System Documentation',
                category: 'Technical & Guides',
                badge: 'Technical Handbook',
                icon: 'ph-book-open-text',
                desc: 'Standard developer documentation handbook preloaded with Installation protocols, Configuration matrices, and FAQ.',
                blocksSummary: ['Installation Code Fence', 'Configuration Table Matrix', 'Live Demo Sandbox Launcher', 'Advisory Callout'],
                sampleTitle: 'Studio V2 Architectural Handbook & Editorial OS Integration Guide'
            },
            'release-notes': {
                id: 'release-notes',
                title: 'System Release Notes',
                category: 'Technical & Guides',
                badge: 'Changelog Protocol',
                icon: 'ph-rocket-launch',
                desc: 'Changelog update document detailing version milestones, technical improvements, bug fixes, and source repository stats.',
                blocksSummary: ['Technology Stack Cloud', 'Code Syntax Refactor Logs', 'GitHub Repository Card', 'Download CTA Banner'],
                sampleTitle: 'Studio V2 v2.8.0 Release: Universal Block System & Edge Content Types'
            },
            'landing-page': {
                id: 'landing-page',
                title: 'Commercial Landing Page',
                category: 'Commercial & Showcase',
                badge: 'Product Showcase',
                icon: 'ph-browsers',
                desc: 'Executive commercial landing page preloaded with Hero statements, Features, Pricing matrices, and Testimonials.',
                blocksSummary: ['Technology Stack Cloud', 'Pricing Comparison Table', 'Executive Client Testimonial', 'Download Resource CTA'],
                sampleTitle: 'Aura Studio V2 — Universal Editorial Engine for Enterprise Teams'
            },
            'case-study': {
                id: 'case-study',
                title: 'Enterprise Case Study',
                category: 'Commercial & Showcase',
                badge: 'Client Validation',
                icon: 'ph-briefcase',
                desc: 'Comprehensive client validation narrative preloaded with Overview, Challenge, Solution, Gallery, Tech Stack, and KPI Metrics.',
                blocksSummary: ['Vault Gallery Grid', 'Technology Stack Matrix', 'Case Study KPI Metrics', 'Before / After Transformation', 'Author Bio Credential'],
                sampleTitle: 'COTIT Enterprise ERP: Achieving Sub-20ms TTFB & 40% Throughput Gains'
            }
        };

        this.init();
    }

    init() {
        window.StudioContentTemplates = this;
        console.log('⚡ StudioContentTemplatesEngine initialized with 10 production Content Types.');
    }

    /**
     * Helper to safely call Sprint 7 block generator if available, or generate fallback HTML.
     */
    getBlock(type, customOptions) {
        if (window.StudioBlockEngine && typeof window.StudioBlockEngine.generateBlockHTML === 'function') {
            return window.StudioBlockEngine.generateBlockHTML(type, customOptions);
        }
        return `<p><em>[Block: ${type.toUpperCase()}]</em></p>`;
    }

    /**
     * Generates exact preloaded block HTML sequences for all 10 Content Types.
     */
    generateTemplateContent(templateId) {
        const tId = templateId ? templateId.toLowerCase() : 'blank';

        switch (tId) {
            case 'case-study':
                return `
                    <h2>1. Project Overview</h2>
                    <p>When high-growth enterprises reach architectural inflection points, legacy systems become critical bottlenecks. This comprehensive case study explores our engineering partnership to modernize high-frequency infrastructure, migrating from fragmented legacy CMS architecture to a unified composable edge system.</p>
                    
                    <h2>2. The Engineering Challenge</h2>
                    <p>The client's pre-existing software platform suffered from extreme database read saturation and multi-second page render latency during peak traffic spikes. Content editors faced fragmented administrative workflows across multiple disparate toolchains.</p>
                    ${this.getBlock('callout', { title: 'Critical Infrastructure Friction', text: 'Pre-migration audit identified an average Time-to-First-Byte (TTFB) exceeding 1,200ms and substantial developer maintenance overhead caused by monolithic database query locks.' })}
                    
                    <h2>3. Architectural Research & Audit</h2>
                    <p>Prior to writing a single line of production code, our engineering architecture team conducted an exhaustive 3-week infrastructure telemetry audit and developer UX interview cycle to isolate exact serialization bottlenecks.</p>
                    
                    <h2>4. Our Composable Solution</h2>
                    <p>We engineered a highly resilient, globally decentralized content architecture utilizing Cloudflare Workers, edge object caching, and our unified Studio V2 Editorial Engine with zero custom database overhead.</p>
                    
                    <h2>5. Visual Prototype Gallery</h2>
                    <p>Below is an empirical showcase representing the redesigned executive analytics interface and real-time edge telemetry panels deployed during Phase 2 of implementation:</p>
                    ${this.getBlock('gallery')}
                    
                    <h2>6. Technology Stack & Infrastructure</h2>
                    <p>The operational foundation relies entirely on globally distributed edge compute tokens and highly standardized Vanilla Javascript frameworks:</p>
                    ${this.getBlock('tech-stack')}
                    
                    <h2>7. Execution Timeline & Milestones</h2>
                    ${this.getBlock('table')}
                    
                    <h2>8. Real-Time Performance Metrics & KPI Gains</h2>
                    <p>Following a seamless zero-downtime DNS cutover, edge synthetic benchmarking and Datadog telemetry captured unprecedented global speed improvements across all primary API endpoints:</p>
                    ${this.getBlock('case-study-metrics')}
                    
                    <h2>9. Production Results & Architectural Transformation</h2>
                    <p>The transformation established an immediate competitive differentiator. Below is a structural comparative look at the system architecture before and after our composable refactor:</p>
                    ${this.getBlock('before-after')}
                    
                    <h2>10. Founder Reflection & Learnings</h2>
                    ${this.getBlock('quote')}
                    ${this.getBlock('author-bio')}
                `;

            case 'documentation':
                return `
                    <h2>1. Architecture Introduction</h2>
                    <p>Welcome to the official technical specification and implementation manual for Studio V2. This system is engineered as a unified, composable editorial engine designed to power technical articles, documentation, and commercial publications without relying on complex database overhead.</p>
                    
                    <h2>2. Quick Installation Protocol</h2>
                    <p>To integrate Studio V2 directly into your web application or Cloudflare Pages project, run the following initialization script within your local environment:</p>
                    ${this.getBlock('code', { code: '// Execute via your terminal environment\nnpx -y create-studio-app@latest ./ --edge-ready\n\n// Install peer dependencies\nnpm i @tiptap/core @tiptap/starter-kit --save-exact' })}
                    
                    <h2>3. Configuration Matrix & Environment Tokens</h2>
                    <p>Configure your edge storage credentials and publishing secret tokens within your project root environmental declaration file (<code>.dev.vars</code>):</p>
                    ${this.getBlock('table')}
                    
                    <h2>4. Code Execution Example</h2>
                    <p>Once instantiated, initialize the universal block engine and bind your writing canvas directly to your DOM architecture:</p>
                    ${this.getBlock('code')}
                    ${this.getBlock('callout', { title: 'Edge Worker Caching Tip', text: 'Always ensure your Cloudflare R2 bucket binding is mapped to R2_MEDIA_VAULT in your wrangler.toml file for instant image uploads.' })}
                    
                    <h2>5. Interactive Sandbox & FAQ</h2>
                    <p>Explore our live experimental sandbox below to inspect DOM transformations in real-time:</p>
                    ${this.getBlock('live-demo')}
                    <h3>Frequently Asked Questions</h3>
                    <p><strong>Q: Does Studio V2 require a traditional SQL database?</strong><br>A: No. Studio V2 operates entirely on edge key-value stores and static Git repositories for high-frequency reliability.</p>
                `;

            case 'landing-page':
                return `
                    <h2>Next-Generation Universal Content Engine for Enterprise Teams</h2>
                    <p>Experience zero-latency content authorship powered entirely by Cloudflare Edge CDN and modern Vanilla JavaScript architecture. Say goodbye to bloated monoliths and fragmented editorial workspaces.</p>
                    
                    <h2>1. Engineered Features & High-Speed Architecture</h2>
                    <p>Built exclusively for developers and executive storytellers who refuse to compromise on ergonomics or site rendering velocity:</p>
                    <ul>
                        <li><strong>Universal 20-Block Engine:</strong> Write Articles, Case Studies, and Documentation from a single workspace.</li>
                        <li><strong>Cloudflare R2 Media Vault:</strong> Drag-and-drop instant image compression and Object Storage pipelines.</li>
                        <li><strong>Zero Database Bottlenecks:</strong> 100% static output compilation for secure, sub-15ms edge delivery.</li>
                    </ul>
                    ${this.getBlock('tech-stack')}
                    
                    <h2>2. Transparent Enterprise Pricing & Tier Matrix</h2>
                    <p>Simple, predictable commercial licensing engineered for startups, boutique digital agencies, and globally distributed engineering teams:</p>
                    ${this.getBlock('table')}
                    
                    <h2>3. Verified Executive Testimonials</h2>
                    <p>See why engineering leaders and technical CTOs are migrating their content infrastructures to our high-speed composable engine:</p>
                    ${this.getBlock('testimonial')}
                    ${this.getBlock('quote')}
                    
                    <h2>4. Ready to Transform Your Content Architecture?</h2>
                    <p>Deploy your production-ready workspace in less than five minutes with zero external dependencies:</p>
                    ${this.getBlock('download-cta')}
                    ${this.getBlock('github-repo')}
                `;

            case 'tutorial':
                return `
                    <h2>1. Tutorial Overview & Learning Objectives</h2>
                    <p>In this engineering step-by-step tutorial, you will master the implementation of composable content storage utilizing Cloudflare R2 object buckets and pure vanilla JavaScript event loops.</p>
                    ${this.getBlock('callout', { title: 'Prerequisite Engineering Checklist', text: 'Before commencing this tutorial, ensure you have Node.js v20+, an active Cloudflare Cloud Account, and administrative terminal privileges.' })}
                    
                    <h2>2. Step 1: Initialize Your Cloudflare Worker Environment</h2>
                    <p>Begin by scaffolding your edge worker pipeline with explicit CORS rules and bucket authorization bindings:</p>
                    ${this.getBlock('code', { code: 'export default {\n  async fetch(request, env) {\n    if (request.method === "PUT") {\n      const file = await request.blob();\n      const key = `vault/${Date.now()}-${file.name}`;\n      await env.R2_MEDIA_VAULT.put(key, file);\n      return new Response(JSON.stringify({ status: "success", key }), { status: 200 });\n    }\n  }\n};' })}
                    
                    <h2>3. Step 2: Integrate Studio V2 Frontend Handlings</h2>
                    <p>With your worker deployed to the edge, attach our reactive upload listener directly to your custom modal DOM nodes:</p>
                    ${this.getBlock('code')}
                    ${this.getBlock('image')}
                    
                    <h2>4. Verification & Synthetic Testing</h2>
                    <p>Execute synthetic PUT requests against your staging endpoint to confirm token validity and inspect HTTP 200 upload confirmation timestamps.</p>
                    
                    <h2>5. Summary & Next Steps</h2>
                    <p>You have successfully constructed an enterprise-grade cloud media pipeline with zero database servers. Keep exploring our open-source repositories and related engineering guides below:</p>
                    ${this.getBlock('github-repo')}
                    ${this.getBlock('related-articles')}
                `;

            case 'comparison':
                return `
                    <h2>1. Executive Summary & Paradigm Shift</h2>
                    <p>Selecting an underlying web content architecture requires balancing engineering complexity against editorial velocity. In this rigorous evaluation, we benchmark legacy database-driven monoliths against modern composable edge frameworks.</p>
                    
                    <h2>2. Architectural Evolution: Monoliths vs. Composable Edge</h2>
                    <p>Below is an architectural breakdown highlighting the structural divergence between traditional centralized web servers and globally distributed static runtimes:</p>
                    ${this.getBlock('before-after')}
                    
                    <h2>3. Feature Trade-Off & Evaluation Matrix</h2>
                    <p>We evaluated both operational models across five critical technical criteria: TTFB Speed, Scalability Costs, Security Vulnerability Surface, Developer Ergonomics, and Offline Resiliency:</p>
                    ${this.getBlock('table')}
                    
                    <h2>4. Real-World Performance Telemetry</h2>
                    <p>When subjecting both architectures to simulated sustained concurrency testing (5,000 requests/sec), edge composable systems demonstrated extreme speed dominance:</p>
                    ${this.getBlock('case-study-metrics')}
                    
                    <h2>5. Final Verdict & Strategic Recommendation</h2>
                    ${this.getBlock('callout', { title: 'Executive Architecture Recommendation', text: 'For any publication or portfolio prioritizing reading speed, security, and developer productivity, migrating to a static edge pipeline represents an immediate order-of-magnitude upgrade.' })}
                    ${this.getBlock('author-bio')}
                `;

            case 'opinion':
                return `
                    <h2>The Illusion of Complex Modern Software</h2>
                    <p>Modern frontend engineering has quietly drifted into a state of unnecessary complexity. We build thirty-megabyte single-page web applications just to render static typography, locking our storytelling behind layers of complex framework abstractions.</p>
                    ${this.getBlock('quote', { text: '“We must stop confusing tooling complexity with engineering capability. True architectural mastery is achieved when there is nothing left to remove.”' })}
                    
                    <h2>Why Writing Should Always Come Before Administration</h2>
                    <p>When an author opens a digital workspace, every form field, dropdown selector, and loading spinner represents friction against creative thought. A true editorial operating system must disappear until the exact second a tool is summoned.</p>
                    
                    <h2>The Return to Vanilla Foundations</h2>
                    <p>By returning to standard DOM specifications, robust CSS architectures, and decentralized edge content storage, we unlock software that feels lightning fast and indestructible.</p>
                    ${this.getBlock('divider')}
                    ${this.getBlock('author-bio')}
                `;

            case 'listicle':
                return `
                    <h2>Overview: Engineering for Velocity</h2>
                    <p>After architecting and scaling more than two dozen enterprise publishing infrastructures, certain recurring patterns separate world-class engineering teams from those perpetually drowning in technical debt. Here are seven timeless principles:</p>
                    
                    <h2>1. Treat Speed as an Uncompromising Core Feature</h2>
                    <p>If your digital publication requires more than half a second to complete visual layout rendering, your underlying architecture is broken. Sub-20ms Time-to-First-Byte must be treated as a baseline requirement.</p>
                    ${this.getBlock('callout', { title: 'Pro-Tip: The 100ms Rule', text: 'Human cognitive perception views any response under 100 milliseconds as instantaneous. Design your entire editorial feedback loop around this strict physical boundary.' })}
                    
                    <h2>2. Eliminate Database Locks with Static Compilation</h2>
                    <p>Never compute on every read request what can be seamlessly pre-compiled during document publication. Static edge distribution removes 99% of common security and scale vectors.</p>
                    
                    <h2>3. Unify Your Editorial Block Systems</h2>
                    <p>Stop engineering five different CMS editors for Articles, Case Studies, and Docs. Build one robust, universally adaptable block library that conforms effortlessly to any content model.</p>
                    ${this.getBlock('tech-stack')}
                    
                    <h2>4. Keep Exploring & Further Reading</h2>
                    ${this.getBlock('related-articles')}
                `;

            case 'news':
                return `
                    <h2>Breaking: bangjeje.dev Unveils Studio V2 Universal Editorial Engine</h2>
                    <p><em>JAKARTA, EST. 2026</em> — Today marks a major architectural milestone in modern publishing systems as bangjeje.dev officially releases Studio V2, featuring an integrated 20-block universal content framework powered entirely by edge cloud infrastructure.</p>
                    ${this.getBlock('callout', { title: 'Release Announcement & Availability', text: 'Studio V2 Sprint 8 is now officially live across all primary editorial workspace routes with complete template preloading and zero-database compilation.' })}
                    
                    <h2>Executive Commentary & Vision</h2>
                    <p>The release addresses a longstanding dilemma facing engineering organizations: how to empower content creators with magazine-quality publishing layouts without introducing bloated CMS frameworks into production codebases.</p>
                    ${this.getBlock('quote')}
                    
                    <h2>Receive Weekly Executive Intelligence Briefings</h2>
                    <p>Stay updated with our latest open-source software architectures, design systems releases, and deep engineering essays:</p>
                    ${this.getBlock('newsletter')}
                `;

            case 'release-notes':
                return `
                    <h2>Studio V2 v2.8.0 — Universal Content Templates & Preloaded Architectures</h2>
                    <p>We are thrilled to deploy <strong>Sprint 8</strong> across the bangjeje.dev network! This major architectural update establishes 10 reusable Content Types, allowing authors to generate comprehensive Case Studies, Documentation manuals, and Landing Pages from a single unified editor.</p>
                    
                    <h2>1. What's New in This Release</h2>
                    <ul>
                        <li><strong>10 Reusable Content Templates:</strong> One-click preloaded architectural scaffolding for Case Studies, Tutorials, Docs, and more.</li>
                        <li><strong>Unified Workspace Router:</strong> Full URL parameter hydration (<code>?template=case-study</code>) connecting dashboard creation flows directly to the editor.</li>
                        <li><strong>Enhanced Reader Sanitization:</strong> Automated cleanup algorithms stripping editing handlebars and contenteditable flags when rendering public reading views.</li>
                    </ul>
                    ${this.getBlock('tech-stack')}
                    
                    <h2>2. Under the Hood & Syntax Refactorings</h2>
                    <p>Our Core UI bundle size was reduced by 14% by consolidating redundant modal controllers into lightweight singleton patterns:</p>
                    ${this.getBlock('code', { code: '// Clean modular initialization in content-templates-engine.js\nwindow.StudioContentTemplates.applyTemplate("case-study", { overwrite: true });' })}
                    
                    <h2>3. Open Source Repository Commit Activity</h2>
                    <p>Explore our complete commit history and download the latest precompiled template blueprint packages directly from our developer repository:</p>
                    ${this.getBlock('github-repo')}
                    ${this.getBlock('download-cta')}
                `;

            case 'blank':
            default:
                return `<p>Start writing your extraordinary document here, or press <code>/</code> to insert modular blocks from our 20-block editorial library...</p>`;
        }
    }

    /**
     * Applies the specified template directly to the active Tiptap editor canvas.
     */
    applyTemplate(templateId, isExplicit = true) {
        const tmpl = this.templates[templateId] || this.templates['blank'];
        const titleInput = document.getElementById('doc-title-input');
        
        if (titleInput && (!titleInput.value.trim() || titleInput.value === 'Untitled Article...' || isExplicit)) {
            titleInput.value = tmpl.sampleTitle || 'Untitled ' + tmpl.title;
        }
        
        const htmlContent = this.generateTemplateContent(templateId);
        
        if (window.StudioEditor && window.StudioEditor.editor) {
            window.StudioEditor.editor.chain().focus().setContent(htmlContent, false).run();
            window.StudioEditor.handleContentUpdate();
        } else {
            const canvas = document.getElementById('tiptap-canvas-root');
            if (canvas) canvas.innerHTML = htmlContent;
        }

        const modal = document.getElementById('studio-content-templates-modal');
        if (modal) modal.remove();

        if (isExplicit && window.StudioToast) {
            window.StudioToast.show(`⚡ Loaded Content Type: "${tmpl.title}" with preloaded architectural blocks.`, 'success', 'Studio V2 Engine');
        }
    }

    /**
     * Renders a TailAdmin glassmorphism modal with all 10 Content Type cards.
     */
    openTemplateSelectorModal() {
        let modal = document.getElementById('studio-content-templates-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'studio-content-templates-modal';
            modal.className = 'fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6';
            
            const renderCategoryCards = (category) => {
                return Object.values(this.templates)
                    .filter(t => t.category === category)
                    .map(t => `
                        <div onclick="window.StudioContentTemplates.applyTemplate('${t.id}', true)" class="group p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C3FF00]/80 transition-all cursor-pointer shadow-lg flex flex-col justify-between relative overflow-hidden">
                            <div>
                                <div class="flex items-center justify-between mb-3">
                                    <div class="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 text-[#C3FF00] flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">
                                        <i class="ph ${t.icon}"></i>
                                    </div>
                                    <span class="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono font-bold text-slate-300 uppercase tracking-wider">${t.badge}</span>
                                </div>
                                <h4 class="text-base font-black text-white m-0 tracking-tight font-sans">${t.title}</h4>
                                <p class="text-xs text-slate-400 m-0 pt-1.5 leading-relaxed font-normal">${t.desc}</p>
                                
                                <div class="mt-4 pt-3 border-t border-white/10">
                                    <span class="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#C3FF00] block mb-1.5"><i class="ph ph-squares-four"></i> Preloaded Blocks Architecture:</span>
                                    <div class="flex flex-wrap gap-1.5">
                                        ${t.blocksSummary.map(b => `<span class="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] font-mono border border-slate-800">${b}</span>`).join('')}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-5 pt-2 flex items-center justify-between text-xs font-mono text-[#C3FF00] font-extrabold group-hover:translate-x-1 transition-transform">
                                <span>⚡ Apply Content Type</span>
                                <i class="ph ph-arrow-right font-bold"></i>
                            </div>
                        </div>
                    `).join('');
            };

            modal.innerHTML = `
                <div class="bg-slate-900 border border-white/15 rounded-3xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl text-white">
                    <!-- Modal Header -->
                    <div class="px-6 py-5 bg-slate-950 border-b border-white/10 flex items-center justify-between shrink-0">
                        <div class="flex items-center gap-3">
                            <div class="w-11 h-11 rounded-2xl bg-[#C3FF00] text-slate-950 flex items-center justify-center text-2xl font-black shadow-lg"><i class="ph ph-copy-simple"></i></div>
                            <div>
                                <h3 class="font-extrabold text-lg text-white m-0 tracking-tight font-sans">Universal Content Types &amp; Templates Library</h3>
                                <span class="text-xs font-mono text-slate-400 block">Sprint 8 Productivity Engine &bull; 10 Production Archetypes Powered by Studio V2 Block System</span>
                            </div>
                        </div>
                        <button onclick="document.getElementById('studio-content-templates-modal').remove();" class="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors flex items-center justify-center text-lg"><i class="ph ph-x font-bold"></i></button>
                    </div>

                    <!-- Modal Body Grid -->
                    <div class="p-6 sm:p-8 overflow-y-auto flex-1 space-y-8 no-scrollbar">
                        <!-- Section 1: Commercial & Showcase (Case Studies, Landing Pages) -->
                        <div>
                            <div class="flex items-center gap-2 text-xs font-mono font-black uppercase tracking-wider text-[#C3FF00] mb-4 pb-2 border-b border-white/10">
                                <i class="ph ph-briefcase"></i> Commercial &amp; Enterprise Showcase (Case Study, Landing Page)
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                ${renderCategoryCards('Commercial & Showcase')}
                            </div>
                        </div>

                        <!-- Section 2: Technical & Guides (Tutorials, Docs, Release Notes) -->
                        <div>
                            <div class="flex items-center gap-2 text-xs font-mono font-black uppercase tracking-wider text-[#C3FF00] mb-4 pb-2 border-b border-white/10">
                                <i class="ph ph-code-block"></i> Technical Handbooks &amp; Engineering Guides (Tutorial, Documentation, Release Notes, Comparison)
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                                ${renderCategoryCards('Technical & Guides')}
                            </div>
                        </div>

                        <!-- Section 3: Editorial & Articles (Blank, Opinion, Listicle, News) -->
                        <div>
                            <div class="flex items-center gap-2 text-xs font-mono font-black uppercase tracking-wider text-[#C3FF00] mb-4 pb-2 border-b border-white/10">
                                <i class="ph ph-pen-nib"></i> Editorial Stories &amp; Articles (Blank, Opinion, Listicle, News)
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                                ${renderCategoryCards('Editorial & Articles')}
                            </div>
                        </div>
                    </div>

                    <!-- Modal Footer -->
                    <div class="px-6 py-4 bg-slate-950 border-t border-white/10 text-xs font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
                        <span>💡 Tip: Selecting a template automatically preloads standard editorial headings and interactive Studio V2 blocks directly into your active canvas.</span>
                        <span class="text-white font-bold">Universal Editorial Engine v2.8.0</span>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new StudioContentTemplatesEngine();
});
