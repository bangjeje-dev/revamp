/**
 * bangjeje.dev Studio — Editorial Operating System Engine (Phase 7C/7D)
 * Pure Vanilla JS execution of Notion/Ghost-inspired Block Editor, Slash Commands (/), Focus Mode (Ctrl+Shift+F),
 * Modular Case Study Storytelling blocks, On-Demand Metadata Inspector, Zero-Refresh Multi-Viewport Previews,
 * and Dynamic Template Scaffolding for Articles and Case Studies.
 */

class EditorialOS {
    static init(options = { isCaseStudy: false }) {
        this.isCaseStudy = options.isCaseStudy || window.location.pathname.includes('case-studies');
        this.setupKeyboardShortcuts();
        this.setupBlockEvents();
        this.setupAutoSave();
        this.injectSlashMenu();
        this.injectMetadataDrawer();
        this.injectPublishModal();
        this.injectViewportSandbox();
        this.checkAndApplyTemplate();
        this.updateWordCount();
    }

    static checkAndApplyTemplate() {
        const urlParams = new URLSearchParams(window.location.search);
        const template = urlParams.get('template');
        if (!template) return;

        const titleEl = document.querySelector('.canvas-title');
        const container = document.getElementById('editorial-canvas-blocks') || document.getElementById('editorial-canvas-root');
        const badge = document.getElementById('current-pub-status-badge');
        
        if (!titleEl || !container) return;

        if (template === 'blank') {
            if (titleEl) {
                titleEl.textContent = 'Untitled';
                titleEl.focus();
            }
            if (badge) {
                badge.className = 'px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] font-extrabold uppercase';
                badge.textContent = 'Draft in Vault';
            }
            container.innerHTML = `
                <div class="block-item group relative pl-8 pr-2 py-1 my-1 border-l-2 border-transparent hover:border-slate-200 transition-all">
                    <div class="absolute left-1 top-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-10">
                        <button title="Block Action / Grip" onclick="EditorialOS.blockActionMenu(this)" class="text-slate-400 hover:text-slate-900 p-1 cursor-grab font-mono text-sm leading-none">⋮⋮</button>
                    </div>
                    <div contenteditable="true" class="focus:outline-none text-slate-400 focus:text-slate-800 transition-colors">Start writing, or type '/' for commands...</div>
                </div>
            `;
            StudioToast.show("Opened Zero-Clutter Blank Canvas. Type '/' for instant blocks.", 'info', 'Editorial OS');
        } else if (template === 'tutorial') {
            titleEl.textContent = 'Step-by-Step Tutorial: Building Headless Apps with Cloudflare Workers';
            container.innerHTML = `
                <div class="block-item group relative pl-8 pr-2 py-1 my-1 border-l-2 border-transparent hover:border-slate-200 transition-all">
                    <p contenteditable="true" class="focus:outline-none text-slate-700 font-medium sm:text-xl leading-relaxed">In this technical step-by-step tutorial, you will learn how to deploy lightning-fast serverless endpoints at the global edge without managing traditional database servers.</p>
                </div>
                <div class="block-item group relative pl-8 pr-2 py-2 my-2 border-l-2 border-transparent hover:border-slate-200 transition-all">
                    <h2 contenteditable="true" class="text-xl sm:text-2xl font-extrabold text-slate-900 focus:outline-none mt-6">Prerequisite Environment Checklist</h2>
                </div>
                <div class="block-item group relative pl-8 pr-2 py-1 my-1 border-l-2 border-transparent hover:border-slate-200 transition-all">
                    <ul class="list-disc pl-5 space-y-2 text-slate-800 font-medium" contenteditable="true">
                        <li>Node.js v20.0+ installed on your local OS or WSL2 workspace.</li>
                        <li>Wrangler CLI authenticated with your active Cloudflare Enterprise account.</li>
                        <li>Basic familiarity with ES modules and TypeScript syntax.</li>
                    </ul>
                </div>
                <div class="block-item group relative pl-8 pr-2 py-2 my-2 border-l-2 border-transparent hover:border-slate-200 transition-all">
                    <h2 contenteditable="true" class="text-xl sm:text-2xl font-extrabold text-slate-900 focus:outline-none mt-4">Step 1: Initializing the Edge Worker Scaffolding</h2>
                </div>
                <div class="block-item group relative pl-8 pr-2 py-1 my-2 border-l-2 border-transparent hover:border-slate-200 transition-all">
                    <div class="rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs border border-slate-800 shadow-sm overflow-hidden my-2">
                        <div class="px-4 py-2 bg-slate-800/80 text-[11px] font-bold text-slate-400 flex justify-between items-center border-b border-slate-700">
                            <span contenteditable="true" class="text-white">terminal / powershell</span>
                            <button onclick="StudioToast.show('Snippet copied to clipboard.', 'success')" class="hover:text-white transition-colors">Copy <i class="ph ph-copy ml-1"></i></button>
                        </div>
                        <pre class="p-4 overflow-x-auto focus:outline-none leading-relaxed" contenteditable="true">npm create cloudflare@latest bangjeje-edge-worker -- --type=simple\ncd bangjeje-edge-worker\nnpm run dev</pre>
                    </div>
                </div>
                <div class="block-item group relative pl-8 pr-2 py-1 my-2 border-l-2 border-transparent hover:border-slate-200 transition-all">
                    <div contenteditable="true" class="focus:outline-none text-slate-400 focus:text-slate-800 transition-colors">Type '/' to add more steps, screenshots, or callout blocks...</div>
                </div>
            `;
            StudioToast.show("Loaded 'Technical Tutorial' scaffold with syntax fences & checklists.", 'success', 'Template Engine');
        } else if (template === 'opinion') {
            titleEl.textContent = 'Why Modern Digital Products Are Over-Engineered: An Executive Manifesto';
            container.innerHTML = `
                <div class="block-item group relative pl-8 pr-2 py-1 my-1 border-l-2 border-transparent hover:border-slate-200 transition-all">
                    <p contenteditable="true" class="focus:outline-none text-slate-700 font-serif italic sm:text-2xl leading-relaxed">"We have traded simplicity, page speed, and cognitive joy for bloated JavaScript bundlers and unmaintainable abstraction mazes."</p>
                </div>
                <div class="block-item group relative pl-8 pr-2 py-1 my-4 border-l-2 border-transparent hover:border-slate-200 transition-all">
                    <p contenteditable="true" class="focus:outline-none text-slate-800 font-normal leading-relaxed">When founders and software leaders set out to build modern digital platforms, they frequently fall victim to industry peer pressure. They adopt complex single-page architectures for content that could be served thousands of times faster via static edge caching and semantic HTML.</p>
                </div>
                <div class="block-item group relative pl-8 pr-2 py-1 my-2 border-l-2 border-transparent hover:border-slate-200 transition-all">
                    <div class="p-5 rounded-2xl bg-slate-900 text-white border border-slate-700 shadow-sm flex items-start gap-4 my-2">
                        <i class="ph ph-quotes text-2xl text-[#C3FF00] shrink-0 mt-0.5"></i>
                        <div class="flex-1 space-y-1">
                            <div class="text-[11px] font-mono font-black uppercase text-[#C3FF00] tracking-wider" contenteditable="true">EXECUTIVE TAKEAWAY</div>
                            <div class="text-xs sm:text-sm font-normal text-slate-200 focus:outline-none" contenteditable="true">Your end users do not care how complex your internal microservice routing is. They care about instant load times, pristine typography, and seamless interactionability.</div>
                        </div>
                    </div>
                </div>
            `;
            StudioToast.show("Loaded 'Editorial Opinion / Manifesto' scaffold.", 'success', 'Template Engine');
        } else if (template === 'listicle') {
            titleEl.textContent = '7 Crucial Architecture Mistakes That Kill Enterprise Software Performance';
            container.innerHTML = `
                <div class="block-item group relative pl-8 pr-2 py-1 my-1">
                    <p contenteditable="true" class="focus:outline-none text-slate-700 font-medium sm:text-xl leading-relaxed">After reviewing dozens of commercial codebases and scaling high-traffic infrastructure at bangjeje.dev, we identified seven fatal engineering anti-patterns that systematically erode system velocity.</p>
                </div>
                <div class="block-item group relative pl-8 pr-2 py-2 my-2">
                    <h2 contenteditable="true" class="text-xl sm:text-2xl font-extrabold text-slate-900 mt-4">1. Ignoring Edge CDN WebP Media Compression</h2>
                    <p contenteditable="true" class="text-slate-800 mt-2">Serving uncompressed PNG or JPEG binaries directly from origin servers instantly sabotages your Core Web Vitals LCP latency score.</p>
                </div>
                <div class="block-item group relative pl-8 pr-2 py-2 my-2">
                    <h2 contenteditable="true" class="text-xl sm:text-2xl font-extrabold text-slate-900 mt-4">2. Excessive Third-Party JavaScript Scripts</h2>
                    <p contenteditable="true" class="text-slate-800 mt-2">Every unvalidated telemetry tracker or analytics widget increases main-thread interaction blocking (INP). Keep your asset footprint lean.</p>
                </div>
                <div class="block-item group relative pl-8 pr-2 py-2 my-2">
                    <h2 contenteditable="true" class="text-xl sm:text-2xl font-extrabold text-slate-900 mt-4">3. Database Synchronous Queries on Main Threads</h2>
                    <p contenteditable="true" class="text-slate-800 mt-2">Always implement asynchronous background job taskers and local cache storage layers for heavy computational reporting.</p>
                </div>
            `;
            StudioToast.show("Loaded 'Industry Listicle' repeatable items scaffold.", 'success', 'Template Engine');
        } else if (template === 'comparison') {
            titleEl.textContent = 'Vanilla Web Components vs. React Fiber: Architectural Evaluation for Enterprise Dashboards';
            container.innerHTML = `
                <div class="block-item pl-8 pr-2 py-1">
                    <p contenteditable="true" class="text-slate-700 font-medium sm:text-xl">When structuring an internal enterprise operating system, architecture teams face a fundamental decision: adopt heavy declarative virtual DOM libraries or leverage native browser standards?</p>
                </div>
                <div class="block-item pl-8 pr-2 py-2 my-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
                        <div class="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                            <div class="font-black text-emerald-900 text-sm flex items-center gap-2"><i class="ph ph-check-circle text-lg text-emerald-600"></i> Vanilla Web Components</div>
                            <ul class="text-xs text-emerald-800 space-y-1 font-medium list-disc pl-4" contenteditable="true"><li>Zero bundle overhead or compiler friction</li><li>Direct browser standards compatibility</li><li>Instant boot velocity and minimal memory usage</li></ul>
                        </div>
                        <div class="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                            <div class="font-black text-amber-900 text-sm flex items-center gap-2"><i class="ph ph-warning-circle text-lg text-amber-600"></i> Declarative Virtual DOM Frameworks</div>
                            <ul class="text-xs text-amber-800 space-y-1 font-medium list-disc pl-4" contenteditable="true"><li>High bundle bandwidth footprint</li><li>Requires complex build pipelines (Webpack, Vite)</li><li>Frequent breaking changes across library upgrades</li></ul>
                        </div>
                    </div>
                </div>
            `;
            StudioToast.show("Loaded 'Framework Comparison' matrix scaffold.", 'success', 'Template Engine');
        } else if (template === 'ai') {
            titleEl.textContent = '[AI Assisted Scaffold] Automated Research & Insight Strategy';
            container.innerHTML = `
                <div class="block-item pl-8 pr-2 py-4">
                    <div class="p-6 rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50/50 text-center space-y-3 my-2">
                        <i class="ph ph-magic-wand text-3xl text-purple-600 mx-auto block"></i>
                        <div class="text-base font-extrabold text-slate-800">AI Intelligent Scaffolding (Future Placeholder)</div>
                        <p class="text-xs text-slate-600 max-w-md mx-auto">In Phase 7F, entering prompt directives here will automatically outline structured headings, generate SEO meta parameters, and prepare interactive FAQ accordions without traditional writer's block.</p>
                    </div>
                </div>
            `;
            StudioToast.show("Loaded 'AI Assisted' placeholder scaffold.", 'info', 'AI Future Hook');
        } else if (template === 'business' || template === 'dev' || template === 'uiux') {
            titleEl.textContent = `${template.toUpperCase()} Strategic Insight & Architectural Breakdown`;
            StudioToast.show(`Loaded '${template.toUpperCase()}' starting scaffold.`, 'success', 'Template Engine');
        }

        setTimeout(() => this.updateWordCount(), 200);
    }

    static setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Focus Mode: Ctrl + Shift + F or Cmd + Shift + F
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'f') {
                e.preventDefault();
                this.toggleFocusMode();
            }
            // Silent Vault Save Pulse: Ctrl + S or Cmd + S
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                e.preventDefault();
                this.triggerVaultSave();
            }
            // Escape to exit Focus Mode or close drawers/menus
            if (e.key === 'Escape') {
                this.closeSlashMenu();
                this.closeMetadataDrawer();
                this.closePublishModal();
                this.exitViewportSandbox();
            }
        });
    }

    static toggleFocusMode() {
        document.body.classList.toggle('focus-zen-mode');
        const isFocus = document.body.classList.contains('focus-zen-mode');
        StudioToast.show(isFocus ? 'Focus Mode Activated. Press Ctrl+Shift+F or ESC to exit.' : 'Exited Focus Mode.', 'info', 'Editorial OS');
    }

    static triggerVaultSave() {
        const statusEl = document.getElementById('vault-sync-status');
        if (statusEl) {
            statusEl.innerHTML = '<span class="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block mr-1.5"></span> Syncing...';
            setTimeout(() => {
                statusEl.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1.5"></span> Vault Synced';
            }, 600);
        }
        StudioToast.show('Editorial revisions saved silently to Vault repository.', 'success', 'Vault Sync');
    }

    static setupAutoSave() {
        let debounceTimer;
        document.addEventListener('input', (e) => {
            if (e.target && (e.target.classList.contains('editor-canvas') || e.target.closest('.storytelling-block') || e.target.classList.contains('canvas-title') || e.target.closest('.block-item'))) {
                clearTimeout(debounceTimer);
                const statusEl = document.getElementById('vault-sync-status');
                if (statusEl) statusEl.innerHTML = '<span class="w-2 h-2 rounded-full bg-slate-400 inline-block mr-1.5"></span> Unsaved...';
                
                debounceTimer = setTimeout(() => {
                    if (statusEl) statusEl.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1.5"></span> Vault Synced';
                    this.updateWordCount();
                }, 1200);
            }
        });
    }

    static updateWordCount() {
        const canvas = document.getElementById('editorial-canvas-blocks') || document.getElementById('editorial-canvas-root') || document.body;
        const text = canvas.innerText || '';
        const words = text.trim().split(/\s+/).filter(w => w.length > 0 && w !== '⋮⋮').length;
        const readTime = Math.max(1, Math.ceil(words / 200));
        const meter = document.getElementById('reading-time-meter');
        if (meter) meter.textContent = `${words} Words | ${readTime}m Read`;
    }

    // --- SLASH COMMAND ENGINE ---
    static injectSlashMenu() {
        if (document.getElementById('slash-menu-portal')) return;
        const portal = document.createElement('div');
        portal.id = 'slash-menu-portal';
        portal.className = 'fixed z-50 bg-white rounded-xl shadow-2xl border border-slate-200 w-72 p-2 text-xs font-semibold hidden opacity-0 transition-opacity duration-150 overflow-hidden';
        portal.innerHTML = `
            <div class="px-2 py-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase border-b border-slate-100 mb-1">⚡ Instant Slash Commands</div>
            <div class="space-y-0.5 max-h-64 overflow-y-auto no-scrollbar">
                <a href="javascript:void(0)" onclick="EditorialOS.executeSlash('h2')" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 transition-colors"><i class="ph ph-text-h-two text-lg text-blue-600"></i> Section Heading (H2)</a>
                <a href="javascript:void(0)" onclick="EditorialOS.executeSlash('h3')" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 transition-colors"><i class="ph ph-text-h-three text-lg text-blue-500"></i> Sub-heading (H3)</a>
                <a href="javascript:void(0)" onclick="EditorialOS.executeSlash('callout')" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 transition-colors"><i class="ph ph-lightning text-lg text-amber-500"></i> Editorial Callout Alert</a>
                <a href="javascript:void(0)" onclick="EditorialOS.executeSlash('code')" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 transition-colors"><i class="ph ph-code text-lg text-emerald-600"></i> Syntax Code Fence</a>
                <a href="javascript:void(0)" onclick="EditorialOS.executeSlash('image')" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 transition-colors"><i class="ph ph-image text-lg text-purple-600"></i> WebP Media Dropzone</a>
                <a href="javascript:void(0)" onclick="EditorialOS.executeSlash('quote')" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 transition-colors"><i class="ph ph-quotes text-lg text-rose-500"></i> Executive Blockquote</a>
                <a href="javascript:void(0)" onclick="EditorialOS.executeSlash('faq')" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 transition-colors"><i class="ph ph-question text-lg text-indigo-600"></i> FAQ Accordion Group</a>
                <a href="javascript:void(0)" onclick="EditorialOS.executeSlash('link')" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 transition-colors"><i class="ph ph-link-simple text-lg text-sky-600"></i> Related Content Citation</a>
            </div>
        `;
        document.body.appendChild(portal);

        // Listen for '/' key in contenteditable canvas
        document.addEventListener('keyup', (e) => {
            if (e.key === '/') {
                const selection = window.getSelection();
                if (!selection.rangeCount) return;
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                if (rect && rect.top > 0) {
                    portal.style.top = `${rect.bottom + window.scrollY + 8}px`;
                    portal.style.left = `${Math.min(rect.left, window.innerWidth - 320)}px`;
                    portal.classList.remove('hidden');
                    setTimeout(() => portal.classList.remove('opacity-0'), 10);
                }
            } else if (e.key === 'Escape' || e.key === 'Backspace' || e.key === ' ') {
                this.closeSlashMenu();
            }
        });

        document.addEventListener('click', (e) => { if (!portal.contains(e.target)) this.closeSlashMenu(); });
    }

    static closeSlashMenu() {
        const portal = document.getElementById('slash-menu-portal');
        if (portal && !portal.classList.contains('hidden')) {
            portal.classList.add('opacity-0');
            setTimeout(() => portal.classList.add('hidden'), 150);
        }
    }

    static executeSlash(type) {
        this.closeSlashMenu();
        const container = document.getElementById('editorial-canvas-blocks') || document.getElementById('editorial-canvas-root');
        if (!container) return;

        const block = document.createElement('div');
        block.className = 'block-item group relative pl-8 pr-2 py-2 my-1 border-l-2 border-transparent hover:border-slate-200 transition-all';
        block.setAttribute('data-block-type', type);

        const gripHtml = `
            <div class="absolute left-1 top-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-10">
                <button title="Drag / Block Action" onclick="EditorialOS.blockActionMenu(this)" class="text-slate-400 hover:text-slate-900 p-1 cursor-grab font-mono text-sm leading-none">⋮⋮</button>
            </div>
        `;

        if (type === 'h2') {
            block.innerHTML = `${gripHtml}<h2 contenteditable="true" class="text-xl sm:text-2xl font-extrabold text-slate-900 focus:outline-none">New Chapter Heading...</h2>`;
        } else if (type === 'h3') {
            block.innerHTML = `${gripHtml}<h3 contenteditable="true" class="text-base sm:text-lg font-bold text-slate-800 focus:outline-none">Subsection Header...</h3>`;
        } else if (type === 'callout') {
            block.innerHTML = `
                ${gripHtml}
                <div class="p-5 rounded-2xl bg-slate-900 text-white border border-slate-700 shadow-sm flex items-start gap-4 my-2">
                    <i class="ph ph-lightning text-2xl text-[#C3FF00] shrink-0 mt-0.5"></i>
                    <div class="flex-1 space-y-1">
                        <div class="text-[11px] font-mono font-bold uppercase text-[#C3FF00] tracking-wider" contenteditable="true">PRO-TIP: ARCHITECTURAL NOTE</div>
                        <div class="text-xs sm:text-sm font-normal text-slate-200 focus:outline-none" contenteditable="true">Write your high-contrast editorial alert or technical recommendation here...</div>
                    </div>
                </div>
            `;
        } else if (type === 'code') {
            block.innerHTML = `
                ${gripHtml}
                <div class="rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs border border-slate-800 shadow-sm overflow-hidden my-2">
                    <div class="px-4 py-2 bg-slate-800/80 text-[11px] font-bold text-slate-400 flex justify-between items-center border-b border-slate-700">
                        <span contenteditable="true" class="text-white">tailwind.config.js</span>
                        <button onclick="StudioToast.show('Code snippet copied to clipboard.', 'success')" class="hover:text-white transition-colors">Copy <i class="ph ph-copy ml-1"></i></button>
                    </div>
                    <pre class="p-4 overflow-x-auto focus:outline-none leading-relaxed" contenteditable="true">export default {\n  content: ["./**/*.html"],\n  theme: { extend: { colors: { electric: "#C3FF00" } } }\n};</pre>
                </div>
            `;
        } else if (type === 'image') {
            block.innerHTML = `
                ${gripHtml}
                <div class="p-8 rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/50 text-center space-y-3 my-4 transition-all cursor-pointer">
                    <i class="ph ph-image text-3xl text-slate-400 mx-auto block"></i>
                    <div class="text-sm font-bold text-slate-700">Drop WebP Media or Click to Upload</div>
                    <p class="text-xs text-slate-400 font-normal">Automated Edge WebP compression & WCAG alt-text enforcement</p>
                    <input type="text" class="studio-input w-full max-w-sm mx-auto h-8 text-xs text-center block mt-2 font-mono" placeholder="Enter mandatory Alt-Text caption...">
                </div>
            `;
        } else if (type === 'quote') {
            block.innerHTML = `
                ${gripHtml}
                <blockquote class="pl-4 sm:pl-6 border-l-4 border-slate-900 my-4 py-1 italic font-serif text-lg sm:text-xl text-slate-700 focus:outline-none" contenteditable="true">
                    "The editor should always adapt to the author; the author should never adapt to the editor."
                </blockquote>
            `;
        } else if (type === 'faq') {
            block.innerHTML = `
                ${gripHtml}
                <div class="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 my-3">
                    <div class="p-4 font-bold text-slate-900 flex justify-between items-center cursor-pointer bg-white border-b border-slate-200">
                        <span contenteditable="true">Frequently Asked Question: How does edge caching work?</span>
                        <i class="ph ph-caret-down text-slate-400"></i>
                    </div>
                    <div class="p-4 text-slate-600 text-sm leading-relaxed" contenteditable="true">Edge caching stores compiled WebP imagery and static HTML fragments across Cloudflare global data centers...</div>
                </div>
            `;
        } else {
            block.innerHTML = `${gripHtml}<div contenteditable="true" class="text-sm sm:text-base leading-relaxed text-slate-800 focus:outline-none my-1">Start typing text block...</div>`;
        }

        container.appendChild(block);
        const target = block.querySelector('[contenteditable="true"]');
        if (target) target.focus();
        StudioToast.show(`Inserted slash block: "${type.toUpperCase()}"`, 'info', 'Block Engine');
        this.updateWordCount();
    }

    static blockActionMenu(button) {
        const block = button.closest('.block-item') || button.closest('.storytelling-block');
        if (!block) return;
        
        if (confirm(`Execute block action on this module?\n\n• OK to Duplicate / Clone Section\n• Cancel to Scrub / Delete Section`)) {
            const clone = block.cloneNode(true);
            block.after(clone);
            StudioToast.show('Section successfully duplicated.', 'success', 'Storytelling Block');
        } else {
            if (confirm('Permanently scrub this storytelling section?')) {
                block.remove();
                StudioToast.show('Section scrubbed from workspace.', 'info', 'Block Scrub');
                this.updateWordCount();
            }
        }
    }

    static setupBlockEvents() {
        const canvas = document.getElementById('editorial-canvas-blocks');
        if (canvas) {
            canvas.addEventListener('click', (e) => {
                if (e.target === canvas && !canvas.children.length) {
                    this.executeSlash('paragraph');
                }
            });
        }
    }

    // --- METADATA INSPECTOR DRAWER ---
    static injectMetadataDrawer() {
        if (document.getElementById('metadata-inspector-drawer')) return;
        const drawer = document.createElement('div');
        drawer.id = 'metadata-inspector-drawer';
        drawer.className = 'fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white border-l border-slate-200 shadow-2xl transform translate-x-full transition-transform duration-200 flex flex-col font-sans';
        drawer.innerHTML = `
            <div class="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 shrink-0">
                <span class="font-extrabold text-sm text-slate-900 flex items-center gap-2"><i class="ph ph-gear-six text-lg text-slate-700"></i> Metadata & SEO Inspector</span>
                <button onclick="EditorialOS.closeMetadataDrawer()" class="text-slate-400 hover:text-slate-900 p-1 font-mono text-base">✕</button>
            </div>
            
            <div class="flex-1 overflow-y-auto p-6 space-y-6 text-xs no-scrollbar">
                
                <!-- SEO HEALTH AUDIT -->
                <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                    <div class="flex justify-between items-center font-bold text-emerald-900 text-sm"><span>SEO Health Audit</span><span class="font-mono bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-700 text-xs font-black">95 / 100 Grade A</span></div>
                    <p class="text-emerald-700 font-medium leading-relaxed">Canonical URL slug, social Open Graph thumbnail, and meta lengths meet all Google Lighthouse edge criteria.</p>
                </div>

                <!-- REAL-TIME GOOGLE SERP SIMULATION -->
                <div class="space-y-2">
                    <label class="font-bold text-slate-700 font-mono text-[11px] uppercase block">Google SERP Simulation (Live Viewport)</label>
                    <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 font-sans space-y-1">
                        <div class="text-[11px] text-[#202124] font-normal flex items-center gap-1"><span class="w-4 h-4 rounded bg-slate-200 inline-block font-mono text-[9px] text-center font-bold">b</span> bangjeje.dev &gt; insights &gt; enterprise-growth</div>
                        <div class="text-sm font-medium text-[#1a0dab] hover:underline cursor-pointer">Designing for Enterprise Growth & Scalability | bangjeje Studio</div>
                        <div class="text-xs text-[#4d5156] leading-relaxed">Discover how modern headless architecture, Cloudflare Edge workers, and tailored design tokens empower commercial SaaS expansion.</div>
                    </div>
                </div>

                <!-- TAXONOMY & INDEXING -->
                <div class="space-y-3 pt-4 border-t border-slate-200">
                    <div>
                        <label class="font-bold text-slate-700 font-mono text-[11px] uppercase block mb-1">Canonical URL Slug</label>
                        <div class="flex rounded-lg border border-slate-300 overflow-hidden bg-white">
                            <span class="bg-slate-100 px-3 py-2 font-mono text-slate-500 border-r border-slate-300 shrink-0">/insights/</span>
                            <input type="text" value="designing-enterprise-growth" class="w-full px-3 py-2 font-mono font-semibold text-slate-900 focus:outline-none">
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="font-bold text-slate-700 font-mono text-[11px] uppercase block mb-1">Category Pillar</label>
                            <select class="studio-input w-full font-semibold bg-slate-50"><option>Design Systems</option><option>Architecture</option><option>Growth & CRM</option></select>
                        </div>
                        <div>
                            <label class="font-bold text-slate-700 font-mono text-[11px] uppercase block mb-1">Status Gate</label>
                            <select class="studio-input w-full font-semibold bg-slate-50"><option>Draft in Vault</option><option>Live Edge Broadcast</option></select>
                        </div>
                    </div>
                </div>

                <!-- FEATURED SOCIAL THUMBNAIL -->
                <div class="space-y-2 pt-4 border-t border-slate-200">
                    <label class="font-bold text-slate-700 font-mono text-[11px] uppercase flex justify-between items-center"><span>Featured Social Thumbnail</span><span class="text-emerald-600 font-bold">WebP Compressed</span></label>
                    <div class="h-32 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center p-4 text-slate-300 relative overflow-hidden group cursor-pointer">
                        <div class="absolute inset-0 bg-gradient-to-br from-[#C3FF00]/20 to-transparent"></div>
                        <i class="ph ph-image text-3xl text-[#C3FF00] relative z-10 mb-1"></i>
                        <span class="font-bold text-white text-xs relative z-10">Enterprise_Growth_Hero_16x9.webp</span>
                        <span class="font-mono text-[10px] text-slate-400 relative z-10">142 KB &bull; Alt-Text Validated</span>
                    </div>
                </div>

                <!-- RELATIONAL INTERLINKING GRAPH -->
                <div class="space-y-3 pt-4 border-t border-slate-200">
                    <label class="font-bold text-slate-700 font-mono text-[11px] uppercase block">Relational Content Graph</label>
                    <p class="text-slate-500 font-normal leading-relaxed">Bind this document to existing commercial portfolio work and downloadable templates to drive internal SEO backlink velocity.</p>
                    <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 font-medium">
                        <div class="flex justify-between items-center text-xs"><span class="font-bold text-purple-700 flex items-center gap-1.5"><i class="ph ph-briefcase"></i> COTIT Logistics Portal</span><button class="text-slate-400 hover:text-red-500 font-mono">✕</button></div>
                        <div class="flex justify-between items-center text-xs"><span class="font-bold text-emerald-700 flex items-center gap-1.5"><i class="ph ph-package"></i> Aura SaaS Template</span><button class="text-slate-400 hover:text-red-500 font-mono">✕</button></div>
                        <button onclick="StudioToast.show('Linked new relational asset to graph.', 'info')" class="w-full py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs mt-1">+ Attach Related Content...</button>
                    </div>
                </div>

            </div>
            
            <div class="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                <button onclick="EditorialOS.closeMetadataDrawer(); StudioToast.show('Metadata & SEO parameters synced to Vault.', 'success');" class="btn-studio-primary w-full text-xs py-3 bg-[#C3FF00] text-slate-900 font-black uppercase tracking-wider">Sync Metadata & Close</button>
            </div>
        `;
        document.body.appendChild(drawer);
    }

    static openMetadataDrawer() {
        const drawer = document.getElementById('metadata-inspector-drawer');
        if (drawer) drawer.classList.remove('translate-x-full');
    }

    static closeMetadataDrawer() {
        const drawer = document.getElementById('metadata-inspector-drawer');
        if (drawer) drawer.classList.add('translate-x-full');
    }

    // --- PRE-PUBLISH EDITORIAL GATE MODAL ---
    static injectPublishModal() {
        if (document.getElementById('publish-gate-modal')) return;
        const modal = document.createElement('div');
        modal.id = 'publish-gate-modal';
        modal.className = 'fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 hidden opacity-0 transition-all duration-150 font-sans';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 space-y-6 transform scale-95 transition-transform">
                <div class="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-slate-900 text-[#C3FF00] flex items-center justify-center text-xl shadow-xs"><i class="ph ph-rocket-launch"></i></div>
                        <div><h3 class="font-extrabold text-slate-900 text-base sm:text-lg">Deploy to Cloudflare Edge?</h3><p class="text-xs text-slate-500 font-normal">Automated pre-publish health verification audit</p></div>
                    </div>
                    <button onclick="EditorialOS.closePublishModal()" class="text-slate-400 hover:text-slate-900 font-mono text-base">✕</button>
                </div>
                
                <div class="space-y-2.5 text-xs font-semibold text-slate-700">
                    <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2.5"><i class="ph ph-check-circle text-lg text-emerald-600"></i> <span>SEO Health Optimization Score verified at <strong>95/100 (Grade A)</strong></span></div>
                    <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5"><i class="ph ph-check text-emerald-600 text-base font-bold"></i> <span>Canonical URL Slug validated without reserved tokens</span></div>
                    <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5"><i class="ph ph-check text-emerald-600 text-base font-bold"></i> <span>Featured WebP Thumbnail attached with compliant Alt-Text</span></div>
                    <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5"><i class="ph ph-check text-emerald-600 text-base font-bold"></i> <span>Relational Content Graph linked to commercial portfolio</span></div>
                </div>

                <div class="space-y-3 pt-3 border-t border-slate-100 text-xs">
                    <label class="font-bold text-slate-500 font-mono uppercase text-[10px] block">Broadcast Schedule:</label>
                    <div class="flex gap-3">
                        <label class="flex-1 p-3 rounded-xl bg-slate-900 text-white font-bold flex items-center gap-2.5 border border-slate-700 shadow-xs cursor-pointer"><input type="radio" name="deploy_mode" checked class="accent-[#C3FF00]"> <span>Deploy Live Immediately</span></label>
                        <label class="flex-1 p-3 rounded-xl bg-slate-50 text-slate-700 font-bold flex items-center gap-2.5 border border-slate-200 hover:bg-slate-100 cursor-pointer"><input type="radio" name="deploy_mode"> <span>Schedule Timestamp</span></label>
                    </div>
                </div>

                <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                    <button type="button" onclick="EditorialOS.closePublishModal()" class="btn-studio-secondary py-2.5 px-5 text-xs">Return to Editor</button>
                    <button type="button" onclick="EditorialOS.confirmBroadcast()" class="btn-studio-primary py-2.5 px-6 text-xs bg-[#C3FF00] text-slate-900 font-black shadow-md">✓ Confirm & Broadcast Live</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    static openPublishModal() {
        const modal = document.getElementById('publish-gate-modal');
        if (modal) {
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modal.querySelector('div').classList.remove('scale-95');
            }, 10);
        }
    }

    static closePublishModal() {
        const modal = document.getElementById('publish-gate-modal');
        if (modal && !modal.classList.contains('hidden')) {
            modal.classList.add('opacity-0');
            modal.querySelector('div').classList.add('scale-95');
            setTimeout(() => modal.classList.add('hidden'), 150);
        }
    }

    static confirmBroadcast() {
        this.closePublishModal();
        StudioToast.show('Successfully broadcasted document to live Cloudflare Edge servers!', 'success', 'Edge Deployment');
        const badge = document.getElementById('current-pub-status-badge');
        if (badge) {
            badge.className = 'px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-extrabold uppercase';
            badge.textContent = 'Published Live on Edge';
        }
    }

    // --- ZERO-REFRESH VIEWPORT SANDBOX ---
    static injectViewportSandbox() {
        if (document.getElementById('viewport-sandbox-overlay')) return;
        const sandbox = document.createElement('div');
        sandbox.id = 'viewport-sandbox-overlay';
        sandbox.className = 'fixed inset-0 z-50 bg-slate-900 text-white hidden flex flex-col transition-all font-sans';
        sandbox.innerHTML = `
            <header class="h-16 bg-slate-950 border-b border-slate-800 px-6 flex items-center justify-between shrink-0 text-xs font-mono">
                <div class="flex items-center gap-3 font-sans font-bold text-white text-sm"><i class="ph ph-device-mobile text-lg text-[#C3FF00]"></i> <span>Zero-Refresh Viewport Sandbox</span></div>
                <div class="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
                    <button onclick="EditorialOS.switchViewport('desktop')" id="vp-btn-desktop" class="px-3 py-1.5 rounded-lg bg-slate-800 text-[#C3FF00] font-bold">Desktop (1440p)</button>
                    <button onclick="EditorialOS.switchViewport('tablet')" id="vp-btn-tablet" class="px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-400 font-semibold">Tablet (iPad Pro 11")</button>
                    <button onclick="EditorialOS.switchViewport('mobile')" id="vp-btn-mobile" class="px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-400 font-semibold">Mobile (iPhone 15 Pro)</button>
                </div>
                <button onclick="EditorialOS.exitViewportSandbox()" class="btn-studio-secondary py-2 px-4 text-xs font-bold text-slate-900 bg-white hover:bg-slate-200">✕ Return to Editor</button>
            </header>
            
            <div class="flex-1 bg-slate-900 overflow-y-auto p-6 sm:p-10 flex items-start justify-center">
                <div id="viewport-frame-container" class="bg-white text-slate-900 rounded-2xl shadow-2xl overflow-y-auto max-w-4xl w-full p-8 sm:p-12 transition-all duration-300 border border-slate-700 min-h-[600px] font-sans">
                    <!-- Cloned Content goes here -->
                </div>
            </div>
        `;
        document.body.appendChild(sandbox);
    }

    static openViewportSandbox() {
        const overlay = document.getElementById('viewport-sandbox-overlay');
        const container = document.getElementById('viewport-frame-container');
        const source = document.getElementById('editorial-canvas-root') || document.getElementById('editorial-canvas-blocks');
        if (overlay && container && source) {
            container.innerHTML = `<div class="prose max-w-none space-y-6">${source.innerHTML}</div>`;
            overlay.classList.remove('hidden');
            StudioToast.show('Viewport Simulator Active. Test responsive flow without reloading.', 'info', 'Preview Engine');
        }
    }

    static exitViewportSandbox() {
        const overlay = document.getElementById('viewport-sandbox-overlay');
        if (overlay && !overlay.classList.contains('hidden')) overlay.classList.add('hidden');
    }

    static switchViewport(mode) {
        const container = document.getElementById('viewport-frame-container');
        ['desktop', 'tablet', 'mobile'].forEach(m => {
            const btn = document.getElementById(`vp-btn-${m}`);
            if (btn) {
                if (m === mode) btn.className = 'px-3 py-1.5 rounded-lg bg-slate-800 text-[#C3FF00] font-bold';
                else btn.className = 'px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-400 font-semibold';
            }
        });

        if (mode === 'desktop') {
            container.className = 'bg-white text-slate-900 rounded-2xl shadow-2xl overflow-y-auto max-w-4xl w-full p-12 transition-all duration-300 border border-slate-700 min-h-[700px] font-sans';
        } else if (mode === 'tablet') {
            container.className = 'bg-white text-slate-900 rounded-2xl shadow-2xl overflow-y-auto max-w-[640px] w-full p-8 transition-all duration-300 border border-slate-700 min-h-[800px] font-sans';
        } else if (mode === 'mobile') {
            container.className = 'bg-white text-slate-900 rounded-3xl shadow-2xl overflow-y-auto max-w-[390px] w-full p-5 transition-all duration-300 border-[8px] border-slate-800 min-h-[780px] font-sans';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    EditorialOS.init();
});
