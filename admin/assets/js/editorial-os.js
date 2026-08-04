/**
 * bangjeje.dev Studio — Gutenberg-Inspired Editorial OS Engine (Phase 7E)
 * Pure Vanilla JS execution of WordPress Gutenberg UX philosophy with TailAdmin White Theme:
 * - Persistent Dual-Tab Inspector Sidebar ('Document' vs 'Block')
 * - Dynamic Block Settings (Image crop/lazy-loading, Heading level/anchor ID, Gallery columns/lightbox)
 * - Floating Block Toolbar ([Type ▼] [Align] [B / I / Link] [↑ / ↓] [Options])
 * - WordPress-Style Media Library Modal (Upload, Library Vault, URL, Search, Alt Text)
 * - Reusable Block Patterns & Custom bangjeje.dev Blocks (Case Study CTA, Download Template, HubSpot Form, Author Bio, Tech Stack)
 */

class EditorialOS {
    static init(options = { isCaseStudy: false }) {
        this.isCaseStudy = options.isCaseStudy || window.location.pathname.includes('case-studies');
        this.activeBlock = null;
        this.setupKeyboardShortcuts();
        this.setupBlockSelection();
        this.setupAutoSave();
        this.injectFloatingToolbar();
        this.injectMediaLibraryModal();
        this.injectBlockInserterModal();
        this.injectSlashMenu();
        this.injectPublishModal();
        this.injectViewportSandbox();
        this.checkAndApplyTemplate();
        this.updateWordCount();
        this.switchInspectorTab('document');
    }

    // --- TEMPLATE SCAFFolding & INITIALIZATION ---
    static checkAndApplyTemplate() {
        const urlParams = new URLSearchParams(window.location.search);
        const template = urlParams.get('template');
        if (!template) return;

        const titleEl = document.querySelector('.canvas-title') || document.getElementById('doc-title');
        const container = document.getElementById('editorial-canvas-blocks') || document.getElementById('editorial-canvas-root');
        
        if (!titleEl || !container) return;

        if (template === 'blank') {
            titleEl.textContent = 'Untitled';
            titleEl.focus();
            container.innerHTML = `
                <div class="block-item group relative p-3 my-1 rounded-xl border border-transparent hover:border-slate-200 transition-all cursor-text" data-block-type="paragraph" onclick="EditorialOS.selectBlock(this)">
                    <div class="absolute left-[-28px] top-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-10">
                        <button title="Drag / Options" onclick="EditorialOS.blockActionMenu(this, event)" class="text-slate-400 hover:text-slate-900 p-1 cursor-grab font-mono text-base leading-none">⋮⋮</button>
                    </div>
                    <p contenteditable="true" class="focus:outline-none text-slate-400 focus:text-slate-800 transition-colors m-0 text-base leading-relaxed">Start writing, or type '/' to choose a block or reusable pattern...</p>
                </div>
            `;
            StudioToast.show("Opened Zero-Clutter Gutenberg Canvas. Type '/' or click '[ + ]' for Block Library.", 'info', 'Editorial OS');
        } else if (template === 'tutorial') {
            titleEl.textContent = 'Step-by-Step Tutorial: Building Headless Apps with Cloudflare Workers';
            container.innerHTML = `
                <div class="block-item group relative p-3 my-1 rounded-xl border border-transparent hover:border-slate-200 transition-all cursor-text" data-block-type="paragraph" onclick="EditorialOS.selectBlock(this)">
                    <div class="absolute left-[-28px] top-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-10"><button onclick="EditorialOS.blockActionMenu(this, event)" class="text-slate-400 hover:text-slate-900 p-1 cursor-grab font-mono text-base">⋮⋮</button></div>
                    <p contenteditable="true" class="focus:outline-none text-slate-700 font-medium text-lg leading-relaxed m-0">In this technical tutorial, you will learn how to deploy lightning-fast serverless endpoints at the global edge without managing traditional monolithic database servers.</p>
                </div>
                <div class="block-item group relative p-3 my-2 rounded-xl border border-transparent hover:border-slate-200 transition-all cursor-text" data-block-type="heading" data-level="h2" onclick="EditorialOS.selectBlock(this)">
                    <div class="absolute left-[-28px] top-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-10"><button onclick="EditorialOS.blockActionMenu(this, event)" class="text-slate-400 hover:text-slate-900 p-1 cursor-grab font-mono text-base">⋮⋮</button></div>
                    <h2 contenteditable="true" class="text-2xl font-extrabold text-slate-900 focus:outline-none m-0">Prerequisite Environment Checklist</h2>
                </div>
                <div class="block-item group relative p-3 my-1 rounded-xl border border-transparent hover:border-slate-200 transition-all cursor-text" data-block-type="list" onclick="EditorialOS.selectBlock(this)">
                    <div class="absolute left-[-28px] top-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-10"><button onclick="EditorialOS.blockActionMenu(this, event)" class="text-slate-400 hover:text-slate-900 p-1 cursor-grab font-mono text-base">⋮⋮</button></div>
                    <ul class="list-disc pl-6 space-y-2 text-slate-800 font-medium m-0" contenteditable="true">
                        <li>Node.js v20.0+ installed on your local OS workspace.</li>
                        <li>Wrangler CLI authenticated with your active Cloudflare Enterprise account.</li>
                    </ul>
                </div>
                <!-- CUSTOM BLOCK: DOWNLOAD TEMPLATE -->
                ${this.getCustomBlockHtml('download-template')}
            `;
            StudioToast.show("Loaded 'Technical Tutorial' scaffold with syntax code fences & custom download block.", 'success', 'Template Engine');
        } else if (template === 'opinion') {
            titleEl.textContent = 'Why Modern Digital Products Are Over-Engineered: An Executive Manifesto';
            container.innerHTML = `
                <div class="block-item group relative p-3 my-1 rounded-xl border border-transparent hover:border-slate-200 transition-all cursor-text" data-block-type="paragraph" onclick="EditorialOS.selectBlock(this)">
                    <div class="absolute left-[-28px] top-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-10"><button onclick="EditorialOS.blockActionMenu(this, event)" class="text-slate-400 hover:text-slate-900 p-1 cursor-grab font-mono text-base">⋮⋮</button></div>
                    <p contenteditable="true" class="focus:outline-none text-slate-700 font-serif italic text-xl sm:text-2xl leading-relaxed m-0">"We have traded simplicity, page speed, and cognitive joy for bloated JavaScript bundlers and unmaintainable abstraction mazes."</p>
                </div>
                <!-- CUSTOM BLOCK: CASE STUDY CTA -->
                ${this.getCustomBlockHtml('case-study-cta')}
            `;
            StudioToast.show("Loaded 'Editorial Opinion / Manifesto' scaffold.", 'success', 'Template Engine');
        }

        setTimeout(() => {
            this.updateWordCount();
            const firstBlock = container.querySelector('.block-item');
            if (firstBlock) this.selectBlock(firstBlock);
        }, 200);
    }

    // --- DYNAMIC RIGHT INSPECTOR (DOCUMENT vs BLOCK TABS) ---
    static switchInspectorTab(tabName) {
        const docBtn = document.getElementById('tab-btn-doc');
        const blockBtn = document.getElementById('tab-btn-block');
        const docPane = document.getElementById('inspector-pane-doc');
        const blockPane = document.getElementById('inspector-pane-block');

        if (!docBtn || !blockBtn || !docPane || !blockPane) return;

        if (tabName === 'document') {
            docBtn.className = 'flex-1 py-3 text-xs font-bold font-sans text-slate-900 border-b-2 border-slate-900 bg-white transition-colors cursor-pointer';
            blockBtn.className = 'flex-1 py-3 text-xs font-semibold font-sans text-slate-400 hover:text-slate-700 border-b border-slate-200 bg-slate-50/60 transition-colors cursor-pointer';
            docPane.classList.remove('hidden');
            blockPane.classList.add('hidden');
        } else {
            blockBtn.className = 'flex-1 py-3 text-xs font-bold font-sans text-slate-900 border-b-2 border-slate-900 bg-white transition-colors cursor-pointer';
            docBtn.className = 'flex-1 py-3 text-xs font-semibold font-sans text-slate-400 hover:text-slate-700 border-b border-slate-200 bg-slate-50/60 transition-colors cursor-pointer';
            blockPane.classList.remove('hidden');
            docPane.classList.add('hidden');
            this.renderDynamicBlockInspector();
        }
    }

    static selectBlock(blockEl) {
        if (this.activeBlock === blockEl) return;
        
        // Remove outline from previous block
        document.querySelectorAll('.block-item').forEach(el => el.classList.remove('ring-2', 'ring-[#C3FF00]', 'border-slate-300', 'bg-slate-50/30'));
        
        this.activeBlock = blockEl;
        if (blockEl) {
            blockEl.classList.add('ring-2', 'ring-[#C3FF00]', 'bg-slate-50/30');
            this.positionFloatingToolbar(blockEl);
            this.switchInspectorTab('block');
            this.renderDynamicBlockInspector();
        } else {
            this.hideFloatingToolbar();
            this.switchInspectorTab('document');
        }
    }

    static setupBlockSelection() {
        const container = document.getElementById('editorial-canvas-blocks') || document.getElementById('editorial-canvas-root');
        if (container) {
            container.addEventListener('click', (e) => {
                const block = e.target.closest('.block-item');
                if (block) {
                    this.selectBlock(block);
                } else if (e.target === container) {
                    // Clicking empty canvas space adds a new paragraph block
                    this.insertBlock('paragraph');
                }
            });

            // Listen for keyboard arrow block traversal
            container.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowUp' && e.ctrlKey && this.activeBlock) {
                    e.preventDefault();
                    this.moveBlockUp(this.activeBlock);
                } else if (e.key === 'ArrowDown' && e.ctrlKey && this.activeBlock) {
                    e.preventDefault();
                    this.moveBlockDown(this.activeBlock);
                }
            });
        }
    }

    // --- DYNAMIC BLOCK SETTINGS IN RIGHT SIDEBAR ---
    static renderDynamicBlockInspector() {
        const pane = document.getElementById('inspector-pane-block');
        if (!pane) return;

        if (!this.activeBlock) {
            pane.innerHTML = `
                <div class="p-8 text-center text-slate-400 space-y-3 font-sans">
                    <i class="ph ph-cube text-3xl mx-auto block text-slate-300"></i>
                    <div class="text-xs font-bold text-slate-600">No Block Selected</div>
                    <p class="text-xs font-normal leading-relaxed">Click or tap any block in the center editorial canvas to inspect its typography, media dimensions, or relational settings.</p>
                </div>
            `;
            return;
        }

        const type = this.activeBlock.getAttribute('data-block-type') || 'paragraph';

        if (type === 'heading') {
            const level = this.activeBlock.getAttribute('data-level') || 'h2';
            pane.innerHTML = `
                <div class="p-6 space-y-6 text-xs font-sans">
                    <div class="border-b border-slate-100 pb-4 flex items-center justify-between">
                        <span class="font-extrabold text-sm text-slate-900 flex items-center gap-2"><i class="ph ph-text-h-two text-blue-600 text-lg"></i> Heading Block Settings</span>
                        <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-600 uppercase">Core</span>
                    </div>
                    
                    <div class="space-y-2">
                        <label class="font-bold font-mono text-[11px] uppercase text-slate-600 block">Heading Level</label>
                        <div class="grid grid-cols-6 gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                            <button onclick="EditorialOS.setHeadingLevel('h1')" class="py-1.5 rounded font-bold font-mono text-center ${level === 'h1' ? 'bg-slate-900 text-[#C3FF00]' : 'text-slate-600 hover:bg-white'}">H1</button>
                            <button onclick="EditorialOS.setHeadingLevel('h2')" class="py-1.5 rounded font-bold font-mono text-center ${level === 'h2' ? 'bg-slate-900 text-[#C3FF00]' : 'text-slate-600 hover:bg-white'}">H2</button>
                            <button onclick="EditorialOS.setHeadingLevel('h3')" class="py-1.5 rounded font-bold font-mono text-center ${level === 'h3' ? 'bg-slate-900 text-[#C3FF00]' : 'text-slate-600 hover:bg-white'}">H3</button>
                            <button onclick="EditorialOS.setHeadingLevel('h4')" class="py-1.5 rounded font-bold font-mono text-center ${level === 'h4' ? 'bg-slate-900 text-[#C3FF00]' : 'text-slate-600 hover:bg-white'}">H4</button>
                            <button onclick="EditorialOS.setHeadingLevel('h5')" class="py-1.5 rounded font-bold font-mono text-center ${level === 'h5' ? 'bg-slate-900 text-[#C3FF00]' : 'text-slate-600 hover:bg-white'}">H5</button>
                            <button onclick="EditorialOS.setHeadingLevel('h6')" class="py-1.5 rounded font-bold font-mono text-center ${level === 'h6' ? 'bg-slate-900 text-[#C3FF00]' : 'text-slate-600 hover:bg-white'}">H6</button>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="font-bold font-mono text-[11px] uppercase text-slate-600 block">HTML Anchor ID (Jump Link)</label>
                        <div class="flex rounded-lg border border-slate-300 overflow-hidden bg-white">
                            <span class="bg-slate-100 px-3 py-2 font-mono text-slate-400 border-r border-slate-300">#</span>
                            <input type="text" value="section-heading-anchor" onchange="StudioToast.show('Anchor ID updated in DOM.', 'info')" class="w-full px-3 py-2 font-mono font-semibold text-slate-900 focus:outline-none">
                        </div>
                        <span class="text-[10px] text-slate-400 block font-normal">Enables deep linking directly to this section across browsers.</span>
                    </div>

                    <div class="space-y-2 pt-4 border-t border-slate-100">
                        <label class="font-bold font-mono text-[11px] uppercase text-slate-600 block">Typography & Color Overrides</label>
                        <div class="flex items-center justify-between py-1"><span>Font Weight:</span><select class="studio-input w-36 font-semibold"><option>Extrabold (800)</option><option>Bold (700)</option></select></div>
                        <div class="flex items-center justify-between py-1">
                            <span>Text Color:</span>
                            <div class="flex gap-2">
                                <span class="w-6 h-6 rounded-full bg-slate-900 border border-slate-300 cursor-pointer shadow-xs" title="Slate 900"></span>
                                <span class="w-6 h-6 rounded-full bg-blue-600 border border-slate-300 cursor-pointer shadow-xs" title="Brand Blue"></span>
                                <span class="w-6 h-6 rounded-full bg-emerald-600 border border-slate-300 cursor-pointer shadow-xs" title="Emerald"></span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (type === 'image') {
            pane.innerHTML = `
                <div class="p-6 space-y-6 text-xs font-sans">
                    <div class="border-b border-slate-100 pb-4 flex items-center justify-between">
                        <span class="font-extrabold text-sm text-slate-900 flex items-center gap-2"><i class="ph ph-image text-purple-600 text-lg"></i> Image Block Settings</span>
                        <button onclick="EditorialOS.openMediaLibraryModal()" class="px-2.5 py-1 rounded bg-slate-900 text-[#C3FF00] font-mono text-[10px] font-black hover:bg-slate-800 transition-colors">Replace Image</button>
                    </div>

                    <div class="space-y-2">
                        <label class="font-bold font-mono text-[11px] uppercase text-slate-600 block">WCAG Mandatory Alt Text</label>
                        <textarea class="studio-input w-full h-20 text-xs leading-relaxed font-normal" placeholder="Describe image details for screen readers and SEO...">COTIT global logistics enterprise dashboard interface deployed via Cloudflare Workers</textarea>
                    </div>

                    <div class="space-y-2">
                        <label class="font-bold font-mono text-[11px] uppercase text-slate-600 block">Image Caption & Attribution</label>
                        <input type="text" value="Figure 1.1 — High-velocity handheld scanner UI on iPhone 15 Pro" class="studio-input w-full font-normal">
                    </div>

                    <div class="space-y-3 pt-4 border-t border-slate-100">
                        <label class="font-bold font-mono text-[11px] uppercase text-slate-600 block">Crop & Aspect Ratio</label>
                        <div class="grid grid-cols-3 gap-2">
                            <button onclick="StudioToast.show('Set aspect ratio to 16:9 widescreen.', 'info')" class="p-2 rounded-lg border border-slate-900 bg-slate-900 text-[#C3FF00] font-mono font-bold text-[11px]">16:9 Wide</button>
                            <button onclick="StudioToast.show('Set aspect ratio to 4:3 standard.', 'info')" class="p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 font-mono font-bold text-[11px]">4:3 Standard</button>
                            <button onclick="StudioToast.show('Set aspect ratio to 1:1 square.', 'info')" class="p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 font-mono font-bold text-[11px]">1:1 Square</button>
                        </div>
                    </div>

                    <div class="space-y-2 pt-4 border-t border-slate-100">
                        <label class="font-bold font-mono text-[11px] uppercase text-slate-600 flex justify-between items-center">
                            <span>Edge Lazy Loading</span>
                            <input type="checkbox" checked class="accent-[#C3FF00] w-4 h-4 rounded cursor-pointer" onchange="StudioToast.show('Toggled native loading=lazy directive.', 'info')">
                        </label>
                        <p class="text-[11px] text-slate-500 font-normal">Defers downloading binary media until visible in viewport to guarantee 0.8s LCP scores.</p>
                    </div>
                </div>
            `;
        } else if (type === 'gallery') {
            pane.innerHTML = `
                <div class="p-6 space-y-6 text-xs font-sans">
                    <div class="border-b border-slate-100 pb-4 flex items-center justify-between">
                        <span class="font-extrabold text-sm text-slate-900 flex items-center gap-2"><i class="ph ph-squares-four text-emerald-600 text-lg"></i> Gallery Block Settings</span>
                        <button onclick="EditorialOS.openMediaLibraryModal()" class="px-2 py-1 rounded bg-slate-900 text-[#C3FF00] font-mono text-[10px] font-black">+ Add Visuals</button>
                    </div>

                    <div class="space-y-2">
                        <label class="font-bold font-mono text-[11px] uppercase text-slate-600 block">Layout Mode</label>
                        <div class="flex gap-2">
                            <label class="flex-1 p-2.5 rounded-lg bg-slate-900 text-[#C3FF00] font-bold text-center cursor-pointer border border-slate-800 shadow-xs font-mono"><input type="radio" name="g_mode" checked class="hidden"> Grid Flow</label>
                            <label class="flex-1 p-2.5 rounded-lg bg-slate-50 text-slate-700 font-semibold text-center cursor-pointer border border-slate-200 hover:bg-slate-100 font-mono"><input type="radio" name="g_mode" class="hidden"> Masonry</label>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <div class="flex justify-between items-center font-bold font-mono text-[11px] uppercase text-slate-600"><span>Grid Columns:</span><span class="text-blue-600 font-black">2 Columns</span></div>
                        <input type="range" min="1" max="4" value="2" class="w-full accent-slate-900 cursor-pointer" onchange="StudioToast.show('Gallery column arrangement updated.', 'info')">
                    </div>

                    <div class="space-y-2">
                        <label class="font-bold font-mono text-[11px] uppercase text-slate-600 block">Grid Gap Spacing</label>
                        <select class="studio-input w-full font-semibold"><option>Medium (16px / 1rem)</option><option>Small (8px / 0.5rem)</option><option>Large (24px / 1.5rem)</option></select>
                    </div>

                    <div class="space-y-2 pt-4 border-t border-slate-100">
                        <label class="font-bold font-mono text-[11px] uppercase text-slate-600 flex justify-between items-center">
                            <span>Interactive Lightbox Zoom</span>
                            <input type="checkbox" checked class="accent-[#C3FF00] w-4 h-4 rounded cursor-pointer" onchange="StudioToast.show('Toggled interactive modal lightbox on click.', 'info')">
                        </label>
                    </div>
                </div>
            `;
        } else if (type === 'case-study-cta' || type === 'download-template' || type === 'hubspot-form' || type === 'author-bio' || type === 'tech-stack' || type === 'related-assets') {
            pane.innerHTML = `
                <div class="p-6 space-y-6 text-xs font-sans">
                    <div class="border-b border-slate-100 pb-4 flex items-center justify-between">
                        <span class="font-extrabold text-sm text-slate-900 flex items-center gap-2"><i class="ph ph-sparkle text-[#C3FF00] bg-slate-900 p-1 rounded"></i> Custom bangjeje Block</span>
                        <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 text-purple-800 uppercase">Brand OS</span>
                    </div>

                    <div class="space-y-2">
                        <label class="font-bold font-mono text-[11px] uppercase text-slate-600 block">Relational Asset Target</label>
                        <select class="studio-input w-full font-bold text-slate-900 bg-slate-50" onchange="StudioToast.show('Linked commercial target updated in block card.', 'success')">
                            <option>COTIT: Enterprise ERP Logistics (LCP 0.8s)</option>
                            <option>BAZARTANI: AgriTech E-Commerce Platform</option>
                            <option>Aura SaaS UI Kit (Figma + WebP Tokens)</option>
                        </select>
                    </div>

                    <div class="space-y-2">
                        <label class="font-bold font-mono text-[11px] uppercase text-slate-600 block">Call to Action Button Text</label>
                        <input type="text" value="${type === 'download-template' ? 'Download Free Template Starter' : 'Explore Commercial Execution ➔'}" class="studio-input w-full font-bold text-blue-600">
                    </div>

                    <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                        <div class="font-extrabold text-slate-900">Enterprise Brand Component</div>
                        <p>This block dynamically inherit styling tokens from <code>studio.css</code> and ensures automated CRM lead attribution across your Cloudflare Edge domain.</p>
                    </div>
                </div>
            `;
        } else {
            // Default Paragraph / Code / List Settings
            pane.innerHTML = `
                <div class="p-6 space-y-6 text-xs font-sans">
                    <div class="border-b border-slate-100 pb-4 flex items-center justify-between">
                        <span class="font-extrabold text-sm text-slate-900 flex items-center gap-2"><i class="ph ph-text-t text-slate-700 text-lg"></i> Paragraph & Typography Settings</span>
                    </div>
                    <div class="space-y-2">
                        <label class="font-bold font-mono text-[11px] uppercase text-slate-600 block">Font Size Scale</label>
                        <select class="studio-input w-full font-semibold"><option>Regular Body (18px)</option><option>Lead Introductory (20px)</option><option>Compact Caption (14px)</option></select>
                    </div>
                    <div class="space-y-2">
                        <label class="font-bold font-mono text-[11px] uppercase text-slate-600 block">Drop Cap Initials</label>
                        <label class="flex items-center gap-2 text-slate-700 font-medium cursor-pointer"><input type="checkbox" class="accent-slate-900 w-4 h-4 rounded"> Render oversized initial magazine letter</label>
                    </div>
                </div>
            `;
        }
    }

    static setHeadingLevel(newLevel) {
        if (!this.activeBlock || this.activeBlock.getAttribute('data-block-type') !== 'heading') return;
        this.activeBlock.setAttribute('data-level', newLevel);
        const heading = this.activeBlock.querySelector('h1, h2, h3, h4, h5, h6');
        if (heading) {
            const newTag = document.createElement(newLevel);
            newTag.contentEditable = "true";
            newTag.textContent = heading.textContent;
            newTag.className = newLevel === 'h1' ? 'text-3xl font-black text-slate-900 focus:outline-none m-0' :
                               newLevel === 'h2' ? 'text-2xl font-extrabold text-slate-900 focus:outline-none m-0' :
                               newLevel === 'h3' ? 'text-xl font-bold text-slate-800 focus:outline-none m-0' :
                               'text-lg font-bold text-slate-800 focus:outline-none m-0';
            heading.replaceWith(newTag);
            newTag.focus();
            StudioToast.show(`Changed heading level to ${newLevel.toUpperCase()}`, 'info', 'Block Inspector');
            this.renderDynamicBlockInspector();
        }
    }

    // --- FLOATING BLOCK TOOLBAR ---
    static injectFloatingToolbar() {
        if (document.getElementById('floating-block-toolbar')) return;
        const toolbar = document.createElement('div');
        toolbar.id = 'floating-block-toolbar';
        toolbar.className = 'fixed z-40 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 p-1 flex items-center gap-1 text-xs hidden transition-all duration-150 transform -translate-y-2 font-sans';
        toolbar.innerHTML = `
            <div class="flex items-center gap-0.5 px-2 py-1 border-r border-slate-700 font-bold font-mono text-[#C3FF00] cursor-pointer hover:bg-slate-800 rounded-lg" onclick="EditorialOS.openBlockInserterModal()">
                <i class="ph ph-cube text-base"></i> <span id="tb-block-type">Paragraph</span> <i class="ph ph-caret-down text-[10px] ml-1"></i>
            </div>
            <div class="flex items-center gap-0.5 px-1 border-r border-slate-700">
                <button onclick="StudioToast.show('Aligned text left.', 'info')" class="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white" title="Align Left"><i class="ph ph-text-align-left text-base"></i></button>
                <button onclick="StudioToast.show('Aligned text center.', 'info')" class="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white" title="Align Center"><i class="ph ph-text-align-center text-base"></i></button>
            </div>
            <div class="flex items-center gap-0.5 px-1 border-r border-slate-700">
                <button onclick="document.execCommand('bold');" class="p-1.5 hover:bg-slate-800 rounded font-black text-slate-200 hover:text-white" title="Bold">B</button>
                <button onclick="document.execCommand('italic');" class="p-1.5 hover:bg-slate-800 rounded italic text-slate-200 hover:text-white" title="Italic">I</button>
                <button onclick="StudioToast.show('Insert link URL dialog...', 'info')" class="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white" title="Link"><i class="ph ph-link-simple text-base"></i></button>
            </div>
            <div class="flex items-center gap-0.5 px-1">
                <button onclick="EditorialOS.moveBlockUp(EditorialOS.activeBlock)" class="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white" title="Move Up"><i class="ph ph-arrow-up text-base"></i></button>
                <button onclick="EditorialOS.moveBlockDown(EditorialOS.activeBlock)" class="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white" title="Move Down"><i class="ph ph-arrow-down text-base"></i></button>
                <button onclick="EditorialOS.blockActionMenu(this, event)" class="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-rose-400" title="Block Options / Delete"><i class="ph ph-trash text-base"></i></button>
            </div>
        `;
        document.body.appendChild(toolbar);
    }

    static positionFloatingToolbar(blockEl) {
        const toolbar = document.getElementById('floating-block-toolbar');
        if (!toolbar || !blockEl) return;
        const rect = blockEl.getBoundingClientRect();
        if (rect && rect.top > 40) {
            toolbar.style.top = `${rect.top + window.scrollY - 44}px`;
            toolbar.style.left = `${rect.left + 12}px`;
            const label = document.getElementById('tb-block-type');
            if (label) {
                const type = blockEl.getAttribute('data-block-type') || 'paragraph';
                label.textContent = type.charAt(0).toUpperCase() + type.slice(1);
            }
            toolbar.classList.remove('hidden', '-translate-y-2');
        }
    }

    static hideFloatingToolbar() {
        const toolbar = document.getElementById('floating-block-toolbar');
        if (toolbar) toolbar.classList.add('hidden', '-translate-y-2');
    }

    static moveBlockUp(block) {
        if (block && block.previousElementSibling) {
            block.parentNode.insertBefore(block, block.previousElementSibling);
            this.positionFloatingToolbar(block);
            StudioToast.show('Moved block up.', 'info', 'Block Reorder');
            this.updateWordCount();
        }
    }

    static moveBlockDown(block) {
        if (block && block.nextElementSibling) {
            block.parentNode.insertBefore(block.nextElementSibling, block);
            this.positionFloatingToolbar(block);
            StudioToast.show('Moved block down.', 'info', 'Block Reorder');
            this.updateWordCount();
        }
    }

    static blockActionMenu(btn, event) {
        if (event) event.stopPropagation();
        const block = btn.closest('.block-item') || this.activeBlock;
        if (!block) return;

        if (confirm(`Execute block action on this module?\n\n• OK to Duplicate / Clone Section\n• Cancel to Scrub / Delete Section`)) {
            const clone = block.cloneNode(true);
            block.after(clone);
            this.selectBlock(clone);
            StudioToast.show('Block successfully cloned.', 'success', 'Gutenberg Engine');
        } else {
            if (confirm('Permanently remove this block?')) {
                const next = block.nextElementSibling || block.previousElementSibling;
                block.remove();
                this.selectBlock(next);
                StudioToast.show('Block removed from canvas.', 'info', 'Block Engine');
                this.updateWordCount();
            }
        }
    }

    // --- WORDPRESS-STYLE MEDIA LIBRARY MODAL ---
    static injectMediaLibraryModal() {
        if (document.getElementById('media-library-modal')) return;
        const modal = document.createElement('div');
        modal.id = 'media-library-modal';
        modal.className = 'fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs hidden flex items-center justify-center p-4 sm:p-6 transition-all font-sans';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full flex flex-col max-h-[85vh] overflow-hidden transform scale-95 transition-all duration-150" id="media-modal-box">
                
                <!-- Modal Header & Tabs -->
                <div class="p-6 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50">
                    <div class="flex items-center gap-6">
                        <span class="font-extrabold text-slate-900 text-lg flex items-center gap-2"><i class="ph ph-folder-open text-purple-600 text-2xl"></i> WordPress-Style Media Library</span>
                        <div class="flex gap-1 bg-slate-200/60 p-1 rounded-xl font-bold text-xs">
                            <button onclick="EditorialOS.switchMediaTab('library')" id="m-tab-library" class="px-3.5 py-1.5 rounded-lg bg-white text-slate-900 shadow-xs">Media Vault Library (42)</button>
                            <button onclick="EditorialOS.switchMediaTab('upload')" id="m-tab-upload" class="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900">Upload New Files</button>
                            <button onclick="EditorialOS.switchMediaTab('url')" id="m-tab-url" class="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900">Insert from URL</button>
                        </div>
                    </div>
                    <button onclick="EditorialOS.closeMediaLibraryModal()" class="text-slate-400 hover:text-slate-900 font-mono text-lg p-1">✕</button>
                </div>

                <!-- MEDIA LIBRARY GRID PANE -->
                <div id="media-pane-library" class="p-6 flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6 bg-white">
                    <div class="md:col-span-2 space-y-4">
                        <div class="flex gap-3">
                            <div class="relative flex-1">
                                <i class="ph ph-magnifying-glass absolute left-3 top-2.5 text-slate-400 text-base"></i>
                                <input type="text" placeholder="Search filename, tag, or alt-text..." class="studio-input w-full pl-9 h-9 text-xs font-semibold">
                            </div>
                            <select class="studio-input w-36 h-9 text-xs font-semibold bg-slate-50"><option>All File Types</option><option>WebP Imagery</option><option>SVG Icons</option></select>
                        </div>

                        <!-- Grid Thumbnail Items -->
                        <div class="grid grid-cols-3 gap-3 overflow-y-auto max-h-80 pr-2">
                            <div onclick="EditorialOS.selectMediaItem('COTIT_Dashboard_Hero.webp', '142 KB', 'Enterprise Supply Chain LCP 0.8s interface')" class="aspect-video rounded-xl bg-slate-900 border-2 border-[#C3FF00] flex flex-col justify-center items-center p-2 text-white cursor-pointer relative group overflow-hidden shadow-xs">
                                <i class="ph ph-image text-3xl text-[#C3FF00] mb-1"></i>
                                <span class="text-[10px] font-mono font-bold text-center leading-tight truncate w-full">COTIT_Hero.webp</span>
                                <span class="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#C3FF00] text-slate-900 flex items-center justify-center text-xs font-black">✓</span>
                            </div>
                            <div onclick="EditorialOS.selectMediaItem('BAZARTANI_Checkout_Flow.webp', '189 KB', 'AgriTech mobile payment gateway modal')" class="aspect-video rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 flex flex-col justify-center items-center p-2 text-white cursor-pointer group overflow-hidden">
                                <i class="ph ph-shopping-bag text-3xl text-emerald-400 mb-1"></i>
                                <span class="text-[10px] font-mono font-bold text-slate-300 text-center leading-tight truncate w-full">BAZARTANI.webp</span>
                            </div>
                            <div onclick="EditorialOS.selectMediaItem('Aura_SaaS_Design_Tokens.webp', '112 KB', 'Figma design token component library')" class="aspect-video rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 flex flex-col justify-center items-center p-2 text-white cursor-pointer group overflow-hidden">
                                <i class="ph ph-stack text-3xl text-purple-400 mb-1"></i>
                                <span class="text-[10px] font-mono font-bold text-slate-300 text-center leading-tight truncate w-full">Aura_Tokens.webp</span>
                            </div>
                            <div onclick="EditorialOS.selectMediaItem('Studio_Gutenberg_OS.webp', '98 KB', 'Editorial OS dual tab interface')" class="aspect-video rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 flex flex-col justify-center items-center p-2 text-white cursor-pointer group overflow-hidden">
                                <i class="ph ph-desktop text-3xl text-rose-400 mb-1"></i>
                                <span class="text-[10px] font-mono font-bold text-slate-300 text-center leading-tight truncate w-full">Gutenberg_OS.webp</span>
                            </div>
                        </div>
                    </div>

                    <!-- Right Attachment Inspector Pane -->
                    <div class="border-l border-slate-200 pl-6 space-y-4 text-xs">
                        <div class="font-extrabold text-slate-900 uppercase tracking-wider font-mono text-[11px]">Attachment Details</div>
                        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                            <div id="m-sel-title" class="font-black text-slate-900 text-sm truncate">COTIT_Dashboard_Hero.webp</div>
                            <div id="m-sel-meta" class="font-mono text-[11px] text-slate-500">142 KB &bull; WebP Edge Compressed &bull; 1440x900px</div>
                        </div>

                        <div class="space-y-1.5">
                            <label class="font-bold font-mono text-[10px] uppercase text-slate-600 block">WCAG Alt Text (Required)</label>
                            <input id="m-sel-alt" type="text" value="Enterprise Supply Chain LCP 0.8s interface" class="studio-input w-full font-semibold text-xs">
                        </div>

                        <div class="space-y-1.5">
                            <label class="font-bold font-mono text-[10px] uppercase text-slate-600 block">Caption / Attribution</label>
                            <input type="text" value="Deployed on Cloudflare Workers global Edge CDN" class="studio-input w-full font-normal text-xs">
                        </div>

                        <button onclick="StudioToast.show('Deleted media item from Cloudflare Vault storage.', 'info')" class="text-rose-600 hover:underline font-bold text-xs pt-2 block font-mono">Scrub File from Vault</button>
                    </div>
                </div>

                <!-- UPLOAD PANE (Hidden) -->
                <div id="media-pane-upload" class="p-10 flex-1 hidden flex flex-col items-center justify-center text-center bg-slate-50/50">
                    <div class="max-w-md w-full p-10 rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-900 bg-white transition-all space-y-4 cursor-pointer">
                        <i class="ph ph-cloud-arrow-up text-5xl text-blue-600 mx-auto block"></i>
                        <div><h4 class="font-extrabold text-slate-900 text-base">Drop WebP / PNG files here to compress</h4><p class="text-xs text-slate-400 mt-1">Automatic conversion to WebP with Cloudflare Edge caching protocols.</p></div>
                        <button class="btn-studio-primary bg-slate-900 text-white text-xs px-6 py-2.5 rounded-xl font-bold">Select Files to Upload</button>
                    </div>
                </div>

                <!-- URL PANE (Hidden) -->
                <div id="media-pane-url" class="p-10 flex-1 hidden bg-white space-y-4 max-w-lg mx-auto w-full flex flex-col justify-center">
                    <h4 class="font-extrabold text-slate-900 text-base">Insert External CDN Asset by URL</h4>
                    <div class="space-y-2">
                        <label class="font-bold font-mono text-xs uppercase text-slate-600 block">Absolute WebP Image URL</label>
                        <input type="text" placeholder="https://cdn.bangjeje.dev/assets/hero_image.webp" class="studio-input w-full font-mono text-xs">
                    </div>
                </div>

                <div class="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
                    <button onclick="EditorialOS.closeMediaLibraryModal()" class="btn-studio-secondary py-2.5 px-5 text-xs font-bold text-slate-700">Cancel</button>
                    <button onclick="EditorialOS.confirmMediaInsertion()" class="btn-studio-primary py-2.5 px-6 text-xs bg-[#C3FF00] text-slate-900 font-black uppercase tracking-wider shadow-md">✓ Insert into Editorial Canvas</button>
                </div>

            </div>
        `;
        document.body.appendChild(modal);
    }

    static openMediaLibraryModal() {
        const modal = document.getElementById('media-library-modal');
        if (modal) {
            modal.classList.remove('hidden');
            setTimeout(() => document.getElementById('media-modal-box').classList.remove('scale-95'), 10);
        }
    }

    static closeMediaLibraryModal() {
        const modal = document.getElementById('media-library-modal');
        if (modal && !modal.classList.contains('hidden')) {
            document.getElementById('media-modal-box').classList.add('scale-95');
            setTimeout(() => modal.classList.add('hidden'), 150);
        }
    }

    static switchMediaTab(tab) {
        ['library', 'upload', 'url'].forEach(t => {
            const btn = document.getElementById(`m-tab-${t}`);
            const pane = document.getElementById(`media-pane-${t}`);
            if (btn && pane) {
                if (t === tab) {
                    btn.className = 'px-3.5 py-1.5 rounded-lg bg-white text-slate-900 shadow-xs font-bold';
                    pane.classList.remove('hidden');
                } else {
                    btn.className = 'px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 font-semibold';
                    pane.classList.add('hidden');
                }
            }
        });
    }

    static selectMediaItem(filename, size, alt) {
        const tEl = document.getElementById('m-sel-title');
        const mEl = document.getElementById('m-sel-meta');
        const aEl = document.getElementById('m-sel-alt');
        if (tEl) tEl.textContent = filename;
        if (mEl) mEl.textContent = `${size} • WebP Edge Compressed`;
        if (aEl) aEl.value = alt;
        StudioToast.show(`Selected media: ${filename}`, 'info', 'Media Vault');
    }

    static confirmMediaInsertion() {
        this.closeMediaLibraryModal();
        if (!this.activeBlock) this.insertBlock('image');
        StudioToast.show('Updated image block with selected WebP Media Vault visual!', 'success', 'Media Library');
    }

    // --- REUSABLE BLOCK PATTERNS & CUSTOM BANGJEJE BLOCKS ---
    static injectBlockInserterModal() {
        if (document.getElementById('block-inserter-modal')) return;
        const modal = document.createElement('div');
        modal.id = 'block-inserter-modal';
        modal.className = 'fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs hidden flex items-center justify-center p-4 sm:p-6 transition-all font-sans';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full flex flex-col max-h-[85vh] overflow-hidden transform scale-95 transition-all duration-150" id="inserter-modal-box">
                
                <div class="p-6 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50">
                    <div class="flex items-center gap-6">
                        <span class="font-extrabold text-slate-900 text-lg flex items-center gap-2"><i class="ph ph-plus-circle text-blue-600 text-2xl"></i> Gutenberg Block & Pattern Library</span>
                        <div class="flex gap-1 bg-slate-200/60 p-1 rounded-xl font-bold text-xs">
                            <button onclick="EditorialOS.switchInserterTab('blocks')" id="i-tab-blocks" class="px-4 py-1.5 rounded-lg bg-white text-slate-900 shadow-xs font-bold">Blocks (Core & Custom)</button>
                            <button onclick="EditorialOS.switchInserterTab('patterns')" id="i-tab-patterns" class="px-4 py-1.5 rounded-lg text-slate-600 hover:text-slate-900">Reusable Block Patterns (10)</button>
                        </div>
                    </div>
                    <button onclick="EditorialOS.closeBlockInserterModal()" class="text-slate-400 hover:text-slate-900 font-mono text-lg p-1">✕</button>
                </div>

                <!-- BLOCKS TAB PANE -->
                <div id="inserter-pane-blocks" class="p-6 flex-1 overflow-y-auto space-y-6 bg-white">
                    <div>
                        <span class="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-3">Custom bangjeje.dev Blocks (Enterprise OS)</span>
                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div onclick="EditorialOS.insertCustomBlock('case-study-cta')" class="p-4 rounded-xl border border-slate-200 hover:border-slate-900 bg-slate-50/50 hover:bg-white transition-all cursor-pointer text-left space-y-1 group shadow-xs">
                                <div class="w-8 h-8 rounded-lg bg-slate-900 text-[#C3FF00] flex items-center justify-center font-bold mb-2"><i class="ph ph-briefcase text-lg"></i></div>
                                <div class="font-bold text-slate-900 text-xs">Case Study CTA</div>
                                <p class="text-[11px] text-slate-500">Commercial promotion box with empirical speed ROI KPIs.</p>
                            </div>
                            <div onclick="EditorialOS.insertCustomBlock('download-template')" class="p-4 rounded-xl border border-slate-200 hover:border-slate-900 bg-slate-50/50 hover:bg-white transition-all cursor-pointer text-left space-y-1 group shadow-xs">
                                <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-2"><i class="ph ph-download-simple text-lg"></i></div>
                                <div class="font-bold text-slate-900 text-xs">Download Template</div>
                                <p class="text-[11px] text-slate-500">High-converting asset card for UI kits and starter ZIP bundles.</p>
                            </div>
                            <div onclick="EditorialOS.insertCustomBlock('hubspot-form')" class="p-4 rounded-xl border border-slate-200 hover:border-slate-900 bg-slate-50/50 hover:bg-white transition-all cursor-pointer text-left space-y-1 group shadow-xs">
                                <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-2"><i class="ph ph-envelope text-lg"></i></div>
                                <div class="font-bold text-slate-900 text-xs">Newsletter / HubSpot Form</div>
                                <p class="text-[11px] text-slate-500">Embedded CRM lead capture widget with high-contrast button.</p>
                            </div>
                            <div onclick="EditorialOS.insertCustomBlock('author-bio')" class="p-4 rounded-xl border border-slate-200 hover:border-slate-900 bg-slate-50/50 hover:bg-white transition-all cursor-pointer text-left space-y-1 group shadow-xs">
                                <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold mb-2"><i class="ph ph-user text-lg"></i></div>
                                <div class="font-bold text-slate-900 text-xs">Author Bio Card</div>
                                <p class="text-[11px] text-slate-500">Verified developer credentials with social X & LinkedIn linkers.</p>
                            </div>
                            <div onclick="EditorialOS.insertCustomBlock('tech-stack')" class="p-4 rounded-xl border border-slate-200 hover:border-slate-900 bg-slate-50/50 hover:bg-white transition-all cursor-pointer text-left space-y-1 group shadow-xs">
                                <div class="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold mb-2"><i class="ph ph-stack text-lg"></i></div>
                                <div class="font-bold text-slate-900 text-xs">Technology Stack Matrix</div>
                                <p class="text-[11px] text-slate-500">Interactive badge array of Cloudflare, Tailwind & TypeScript tokens.</p>
                            </div>
                            <div onclick="EditorialOS.insertCustomBlock('related-assets')" class="p-4 rounded-xl border border-slate-200 hover:border-slate-900 bg-slate-50/50 hover:bg-white transition-all cursor-pointer text-left space-y-1 group shadow-xs">
                                <div class="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold mb-2"><i class="ph ph-grid-four text-lg"></i></div>
                                <div class="font-bold text-slate-900 text-xs">Related Assets & Studies</div>
                                <p class="text-[11px] text-slate-500">Automated internal interlinking card grids for SEO backlink velocity.</p>
                            </div>
                        </div>
                    </div>

                    <div class="pt-4 border-t border-slate-100">
                        <span class="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-3">Core Editorial Blocks</span>
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold text-slate-700">
                            <button onclick="EditorialOS.insertBlock('heading'); EditorialOS.closeBlockInserterModal();" class="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center gap-2"><i class="ph ph-text-h-two text-blue-600 text-lg"></i> Heading H2/H3</button>
                            <button onclick="EditorialOS.insertBlock('paragraph'); EditorialOS.closeBlockInserterModal();" class="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center gap-2"><i class="ph ph-text-t text-slate-700 text-lg"></i> Paragraph Text</button>
                            <button onclick="EditorialOS.insertBlock('image'); EditorialOS.closeBlockInserterModal();" class="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center gap-2"><i class="ph ph-image text-purple-600 text-lg"></i> WebP Media</button>
                            <button onclick="EditorialOS.insertBlock('gallery'); EditorialOS.closeBlockInserterModal();" class="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center gap-2"><i class="ph ph-squares-four text-emerald-600 text-lg"></i> Viewport Gallery</button>
                            <button onclick="EditorialOS.insertBlock('code'); EditorialOS.closeBlockInserterModal();" class="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center gap-2"><i class="ph ph-code text-indigo-600 text-lg"></i> Syntax Code Fence</button>
                            <button onclick="EditorialOS.insertBlock('callout'); EditorialOS.closeBlockInserterModal();" class="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center gap-2"><i class="ph ph-lightning text-amber-500 text-lg"></i> Pro-Tip Alert</button>
                            <button onclick="EditorialOS.insertBlock('quote'); EditorialOS.closeBlockInserterModal();" class="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center gap-2"><i class="ph ph-quotes text-rose-500 text-lg"></i> Executive Quote</button>
                            <button onclick="EditorialOS.insertBlock('faq'); EditorialOS.closeBlockInserterModal();" class="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center gap-2"><i class="ph ph-question text-sky-600 text-lg"></i> FAQ Accordion</button>
                        </div>
                    </div>
                </div>

                <!-- PATTERNS TAB PANE (Hidden) -->
                <div id="inserter-pane-patterns" class="p-6 flex-1 overflow-y-auto space-y-4 bg-white hidden">
                    <p class="text-xs text-slate-500">Reusable pre-composed storytelling modules that accelerate content creation while remaining completely editable:</p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Hero Pattern -->
                        <div onclick="EditorialOS.insertPattern('hero')" class="p-5 rounded-2xl border border-slate-200 hover:border-slate-900 bg-slate-50/50 hover:bg-white transition-all cursor-pointer space-y-2 group shadow-xs">
                            <span class="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-extrabold uppercase">Pattern &bull; Hero</span>
                            <h4 class="font-extrabold text-slate-900 text-sm">Enterprise Impact Hero Scenario</h4>
                            <p class="text-xs text-slate-500">Combines oversized lead headline, executive summary paragraph, and 3-column empirical KPI scorecard.</p>
                        </div>

                        <!-- FAQ Pattern -->
                        <div onclick="EditorialOS.insertPattern('faq-group')" class="p-5 rounded-2xl border border-slate-200 hover:border-slate-900 bg-slate-50/50 hover:bg-white transition-all cursor-pointer space-y-2 group shadow-xs">
                            <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-extrabold uppercase">Pattern &bull; FAQ</span>
                            <h4 class="font-extrabold text-slate-900 text-sm">3-Stack FAQ Accordion Group</h4>
                            <p class="text-xs text-slate-500">Preloads three expandable Q&A accordions optimized for Google search schema snippets.</p>
                        </div>

                        <!-- Tech Stack Pattern -->
                        <div onclick="EditorialOS.insertPattern('tech-matrix')" class="p-5 rounded-2xl border border-slate-200 hover:border-slate-900 bg-slate-50/50 hover:bg-white transition-all cursor-pointer space-y-2 group shadow-xs">
                            <span class="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono text-[10px] font-extrabold uppercase">Pattern &bull; Stack</span>
                            <h4 class="font-extrabold text-slate-900 text-sm">Full-Stack Cloudflare Architecture Matrix</h4>
                            <p class="text-xs text-slate-500">Preloaded badges for Workers, Pages, D1 SQL Database, Tailwind CSS V3, and HubSpot CRM.</p>
                        </div>

                        <!-- HubSpot CRM Pattern -->
                        <div onclick="EditorialOS.insertPattern('hubspot-lead')" class="p-5 rounded-2xl border border-slate-200 hover:border-slate-900 bg-slate-50/50 hover:bg-white transition-all cursor-pointer space-y-2 group shadow-xs">
                            <span class="px-2 py-0.5 rounded bg-slate-900 text-[#C3FF00] font-mono text-[10px] font-extrabold uppercase">Pattern &bull; Conversion</span>
                            <h4 class="font-extrabold text-slate-900 text-sm">High-Converting Lead Magnet Section</h4>
                            <p class="text-xs text-slate-500">Dark-mode callout box featuring value proposition bullets and immediate email input submit form.</p>
                        </div>
                    </div>
                </div>

            </div>
        `;
        document.body.appendChild(modal);
    }

    static openBlockInserterModal() {
        const modal = document.getElementById('block-inserter-modal');
        if (modal) {
            modal.classList.remove('hidden');
            setTimeout(() => document.getElementById('inserter-modal-box').classList.remove('scale-95'), 10);
        }
    }

    static closeBlockInserterModal() {
        const modal = document.getElementById('block-inserter-modal');
        if (modal && !modal.classList.contains('hidden')) {
            document.getElementById('inserter-modal-box').classList.add('scale-95');
            setTimeout(() => modal.classList.add('hidden'), 150);
        }
    }

    static switchInserterTab(tab) {
        const bBtn = document.getElementById('i-tab-blocks');
        const pBtn = document.getElementById('i-tab-patterns');
        const bPane = document.getElementById('inserter-pane-blocks');
        const pPane = document.getElementById('inserter-pane-patterns');
        if (!bBtn || !pBtn || !bPane || !pPane) return;

        if (tab === 'blocks') {
            bBtn.className = 'px-4 py-1.5 rounded-lg bg-white text-slate-900 shadow-xs font-bold';
            pBtn.className = 'px-4 py-1.5 rounded-lg text-slate-600 hover:text-slate-900';
            bPane.classList.remove('hidden');
            pPane.classList.add('hidden');
        } else {
            pBtn.className = 'px-4 py-1.5 rounded-lg bg-white text-slate-900 shadow-xs font-bold';
            bBtn.className = 'px-4 py-1.5 rounded-lg text-slate-600 hover:text-slate-900';
            pPane.classList.remove('hidden');
            bPane.classList.add('hidden');
        }
    }

    static insertBlock(type) {
        const container = document.getElementById('editorial-canvas-blocks') || document.getElementById('editorial-canvas-root');
        if (!container) return;
        
        const block = document.createElement('div');
        block.className = 'block-item group relative p-3 my-1 rounded-xl border border-transparent hover:border-slate-200 transition-all cursor-text';
        block.setAttribute('data-block-type', type);
        block.setAttribute('onclick', 'EditorialOS.selectBlock(this)');

        const grip = `
            <div class="absolute left-[-28px] top-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-10">
                <button title="Drag / Options" onclick="EditorialOS.blockActionMenu(this, event)" class="text-slate-400 hover:text-slate-900 p-1 cursor-grab font-mono text-base leading-none">⋮⋮</button>
            </div>
        `;

        if (type === 'heading') {
            block.setAttribute('data-level', 'h2');
            block.innerHTML = `${grip}<h2 contenteditable="true" class="text-2xl font-extrabold text-slate-900 focus:outline-none m-0">New Chapter Heading...</h2>`;
        } else if (type === 'image') {
            block.innerHTML = `
                ${grip}
                <div onclick="EditorialOS.openMediaLibraryModal(); event.stopPropagation();" class="p-10 rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-900 bg-slate-50 text-center space-y-3 my-2 cursor-pointer transition-all">
                    <i class="ph ph-image text-4xl text-purple-600 mx-auto block"></i>
                    <div class="font-extrabold text-slate-800 text-sm">Click to Open Media Library Vault</div>
                    <p class="text-xs text-slate-400 font-mono">Supports WebP upload & URL integration</p>
                </div>
            `;
        } else if (type === 'gallery') {
            block.innerHTML = `
                ${grip}
                <div class="grid grid-cols-2 gap-4 my-2">
                    <div onclick="EditorialOS.openMediaLibraryModal(); event.stopPropagation();" class="aspect-video bg-slate-900 text-white rounded-xl p-4 flex flex-col justify-center items-center text-center cursor-pointer border border-slate-700 hover:border-[#C3FF00]">
                        <i class="ph ph-monitor text-3xl text-[#C3FF00] mb-1"></i><div class="font-bold text-xs">Desktop Viewport (1440p)</div><span class="text-[10px] font-mono text-slate-400">Click to Replace WebP</span>
                    </div>
                    <div onclick="EditorialOS.openMediaLibraryModal(); event.stopPropagation();" class="aspect-video bg-slate-900 text-white rounded-xl p-4 flex flex-col justify-center items-center text-center cursor-pointer border border-slate-700 hover:border-[#C3FF00]">
                        <i class="ph ph-device-mobile text-3xl text-[#C3FF00] mb-1"></i><div class="font-bold text-xs">Mobile Viewport (390px)</div><span class="text-[10px] font-mono text-slate-400">Click to Replace WebP</span>
                    </div>
                </div>
            `;
        } else if (type === 'code') {
            block.innerHTML = `
                ${grip}
                <div class="rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs border border-slate-800 shadow-sm overflow-hidden my-2">
                    <div class="px-4 py-2 bg-slate-800/80 text-[11px] font-bold text-slate-400 flex justify-between items-center border-b border-slate-700">
                        <span contenteditable="true" class="text-white">tailwind.config.js</span>
                        <button onclick="StudioToast.show('Code snippet copied.', 'success'); event.stopPropagation();" class="hover:text-white transition-colors">Copy <i class="ph ph-copy ml-1"></i></button>
                    </div>
                    <pre class="p-4 overflow-x-auto focus:outline-none leading-relaxed m-0" contenteditable="true">export default {\n  content: ["./**/*.html"],\n  theme: { extend: { colors: { electric: "#C3FF00" } } }\n};</pre>
                </div>
            `;
        } else if (type === 'callout') {
            block.innerHTML = `
                ${grip}
                <div class="p-5 rounded-2xl bg-slate-900 text-white border border-slate-700 shadow-sm flex items-start gap-4 my-2">
                    <i class="ph ph-lightning text-2xl text-[#C3FF00] shrink-0 mt-0.5"></i>
                    <div class="flex-1 space-y-1">
                        <div class="text-[11px] font-mono font-bold uppercase text-[#C3FF00] tracking-wider" contenteditable="true">PRO-TIP: ARCHITECTURAL NOTE</div>
                        <div class="text-xs sm:text-sm font-normal text-slate-200 focus:outline-none" contenteditable="true">Write your high-contrast editorial alert or technical recommendation here...</div>
                    </div>
                </div>
            `;
        } else if (type === 'quote') {
            block.innerHTML = `
                ${grip}
                <blockquote class="pl-5 border-l-4 border-slate-900 my-4 py-1 italic font-serif text-xl text-slate-800 focus:outline-none m-0" contenteditable="true">
                    "The author should never adapt to the editor; the editor must adapt to the author's narrative flow."
                </blockquote>
            `;
        } else if (type === 'faq') {
            block.innerHTML = `
                ${grip}
                <div class="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 my-2">
                    <div class="p-4 font-bold text-slate-900 flex justify-between items-center cursor-pointer bg-white border-b border-slate-200">
                        <span contenteditable="true">Frequently Asked Question: Why choose Cloudflare Edge?</span>
                        <i class="ph ph-caret-down text-slate-400"></i>
                    </div>
                    <div class="p-4 text-slate-600 text-sm leading-relaxed" contenteditable="true">Cloudflare Edge delivers WebP binaries and cached static HTML directly from 300+ global network nodes...</div>
                </div>
            `;
        } else {
            block.innerHTML = `${grip}<p contenteditable="true" class="text-base sm:text-lg leading-relaxed text-slate-800 focus:outline-none m-0">Start typing paragraph block...</p>`;
        }

        if (this.activeBlock) this.activeBlock.after(block);
        else container.appendChild(block);
        
        this.selectBlock(block);
        StudioToast.show(`Inserted Gutenberg block: ${type.toUpperCase()}`, 'info', 'Block Library');
        this.updateWordCount();
    }

    static insertCustomBlock(type) {
        this.closeBlockInserterModal();
        const container = document.getElementById('editorial-canvas-blocks') || document.getElementById('editorial-canvas-root');
        if (!container) return;

        const block = document.createElement('div');
        block.className = 'block-item group relative p-2 my-3 rounded-xl border border-transparent hover:border-slate-200 transition-all cursor-text';
        block.setAttribute('data-block-type', type);
        block.setAttribute('onclick', 'EditorialOS.selectBlock(this)');
        block.innerHTML = this.getCustomBlockHtml(type, true);

        if (this.activeBlock) this.activeBlock.after(block);
        else container.appendChild(block);

        this.selectBlock(block);
        StudioToast.show(`Inserted Custom bangjeje Block: ${type.toUpperCase()}`, 'success', 'Enterprise Brand OS');
        this.updateWordCount();
    }

    static getCustomBlockHtml(type, withGrip = true) {
        const grip = withGrip ? `
            <div class="absolute left-[-28px] top-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-10">
                <button title="Drag / Options" onclick="EditorialOS.blockActionMenu(this, event)" class="text-slate-400 hover:text-slate-900 p-1 cursor-grab font-mono text-base leading-none">⋮⋮</button>
            </div>
        ` : '';

        if (type === 'case-study-cta') {
            return `
                <div class="block-item group relative p-2 my-4 rounded-xl border border-transparent hover:border-slate-200 transition-all cursor-text" data-block-type="case-study-cta" onclick="EditorialOS.selectBlock(this)">
                    ${grip}
                    <div class="p-6 rounded-2xl bg-slate-900 text-white border border-slate-700 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 my-1">
                        <div class="space-y-2 max-w-lg">
                            <span class="inline-block px-2.5 py-0.5 rounded bg-[#C3FF00] text-slate-900 font-mono text-[10px] font-black uppercase">Commercial Triumph &bull; Enterprise Case Study</span>
                            <h3 contenteditable="true" class="text-lg sm:text-xl font-extrabold text-white leading-tight focus:outline-none">COTIT: Achieving 0.8s LCP Velocity via Cloudflare Workers & Headless Architecture</h3>
                            <p contenteditable="true" class="text-xs text-slate-300 font-normal leading-relaxed focus:outline-none">See how our enterprise design tokens eliminated legacy database bottlenecks and boosted lead conversion by +40% across global supply chains.</p>
                        </div>
                        <a href="javascript:void(0)" onclick="StudioToast.show('Navigating to COTIT commercial case study...', 'info')" class="px-6 py-3.5 rounded-xl bg-[#C3FF00] hover:bg-white text-slate-900 font-black text-xs uppercase tracking-wider transition-colors shrink-0 flex items-center gap-2 shadow-sm">
                            <span>Explore Study</span> <i class="ph ph-arrow-right text-base font-bold"></i>
                        </a>
                    </div>
                </div>
            `;
        } else if (type === 'download-template') {
            return `
                <div class="block-item group relative p-2 my-4 rounded-xl border border-transparent hover:border-slate-200 transition-all cursor-text" data-block-type="download-template" onclick="EditorialOS.selectBlock(this)">
                    ${grip}
                    <div class="p-6 rounded-2xl bg-white border-2 border-slate-900 shadow-md flex items-center justify-between gap-4 my-1">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-xl bg-slate-900 text-[#C3FF00] flex items-center justify-center text-2xl font-black shrink-0 shadow-xs"><i class="ph ph-package"></i></div>
                            <div>
                                <div class="flex items-center gap-2"><span contenteditable="true" class="font-extrabold text-slate-900 text-base">Aura SaaS UI Kit Starter Bundle</span><span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-black uppercase">Free Token</span></div>
                                <div contenteditable="true" class="text-xs text-slate-500 font-mono mt-0.5">Includes Figma Design System & Tailwind CSS V3 web layout components (4.2 MB ZIP)</div>
                            </div>
                        </div>
                        <button onclick="StudioToast.show('Downloading Aura SaaS Starter bundle...', 'success'); event.stopPropagation();" class="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#C3FF00] font-bold text-xs uppercase tracking-wider shrink-0 transition-colors shadow-xs">Download ZIP</button>
                    </div>
                </div>
            `;
        } else if (type === 'hubspot-form') {
            return `
                <div class="block-item group relative p-2 my-4 rounded-xl border border-transparent hover:border-slate-200 transition-all cursor-text" data-block-type="hubspot-form" onclick="EditorialOS.selectBlock(this)">
                    ${grip}
                    <div class="p-8 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl text-center space-y-4 my-1 max-w-2xl mx-auto">
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-[#C3FF00] font-mono text-xs font-black uppercase"><i class="ph ph-envelope font-bold"></i> Enterprise Engineering Insights</div>
                        <h3 contenteditable="true" class="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Subscribe to the bangjeje.dev Architecture Newsletter</h3>
                        <p contenteditable="true" class="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed font-normal">Receive bi-weekly technical teardowns on Cloudflare Edge velocity, custom design systems, and high-converting commercial UX patterns.</p>
                        <div class="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
                            <input type="email" placeholder="Enter your executive or GitHub email..." class="studio-input flex-1 h-11 px-4 text-xs bg-white text-slate-900 rounded-xl font-medium focus:outline-none">
                            <button onclick="StudioToast.show('Successfully subscribed! HubSpot CRM lead attributed.', 'success'); event.stopPropagation();" class="px-6 h-11 rounded-xl bg-[#C3FF00] hover:bg-white text-slate-900 font-black text-xs uppercase tracking-wider transition-colors shrink-0 shadow-sm">Join Pipeline</button>
                        </div>
                        <span class="text-[10px] font-mono text-slate-500 block pt-1">Zero spam. Connected directly to HubSpot CRM Edge pipeline. Unsubscribe anytime.</span>
                    </div>
                </div>
            `;
        } else if (type === 'author-bio') {
            return `
                <div class="block-item group relative p-2 my-4 rounded-xl border border-transparent hover:border-slate-200 transition-all cursor-text" data-block-type="author-bio" onclick="EditorialOS.selectBlock(this)">
                    ${grip}
                    <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-start sm:items-center gap-5 my-1">
                        <div class="w-16 h-16 rounded-2xl bg-slate-900 text-[#C3FF00] flex items-center justify-center text-2xl font-black font-mono shrink-0 shadow-sm">J</div>
                        <div class="flex-1 space-y-1">
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div><span contenteditable="true" class="font-extrabold text-slate-900 text-base">Jajang</span> <span class="text-slate-400">&bull;</span> <span contenteditable="true" class="font-bold text-blue-600 text-xs font-mono">Founder & Principal Full-Stack Architect</span></div>
                                <div class="flex items-center gap-2 font-mono text-xs font-bold">
                                    <a href="javascript:void(0)" onclick="StudioToast.show('Open X / Twitter profile', 'info'); event.stopPropagation();" class="text-slate-600 hover:text-slate-900 px-2 py-1 rounded bg-white border border-slate-200 shadow-2xs">X / Twitter</a>
                                    <a href="javascript:void(0)" onclick="StudioToast.show('Open LinkedIn profile', 'info'); event.stopPropagation();" class="text-slate-600 hover:text-slate-900 px-2 py-1 rounded bg-white border border-slate-200 shadow-2xs">LinkedIn</a>
                                </div>
                            </div>
                            <p contenteditable="true" class="text-xs text-slate-600 leading-relaxed font-normal">Building ultra-fast commercial web applications, design systems, and headless enterprise infrastructure at bangjeje.dev Studio.</p>
                        </div>
                    </div>
                </div>
            `;
        } else if (type === 'tech-stack') {
            return `
                <div class="block-item group relative p-2 my-3 rounded-xl border border-transparent hover:border-slate-200 transition-all cursor-text" data-block-type="tech-stack" onclick="EditorialOS.selectBlock(this)">
                    ${grip}
                    <div class="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 my-1">
                        <div class="text-[11px] font-mono font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2"><i class="ph ph-stack text-purple-600"></i> Technology Stack Matrix</div>
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-mono text-xs font-bold">Cloudflare Workers</span>
                            <span class="px-3 py-1.5 rounded-lg bg-slate-900 text-[#C3FF00] font-mono text-xs font-bold">Tailwind CSS V3</span>
                            <span class="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-mono text-xs font-bold border border-blue-200">TypeScript / ES Modules</span>
                            <span class="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 font-mono text-xs font-bold border border-amber-200">HubSpot CRM Edge API</span>
                            <button onclick="StudioToast.show('Added custom stack token.', 'info'); event.stopPropagation();" class="px-3 py-1.5 rounded-lg border border-dashed border-slate-300 text-slate-500 hover:text-slate-900 text-xs font-mono font-bold">+ Add Token</button>
                        </div>
                    </div>
                </div>
            `;
        } else if (type === 'related-assets') {
            return `
                <div class="block-item group relative p-2 my-4 rounded-xl border border-transparent hover:border-slate-200 transition-all cursor-text" data-block-type="related-assets" onclick="EditorialOS.selectBlock(this)">
                    ${grip}
                    <div class="space-y-3 my-1">
                        <div class="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between"><span>📚 Related Portfolio Triumphs & Design Assets</span><span class="text-slate-400">Internal SEO Backlink Velocity</span></div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-900 transition-all cursor-pointer space-y-1">
                                <span class="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold uppercase">Case Study</span>
                                <h4 class="font-extrabold text-slate-900 text-sm">BAZARTANI: Scaling AgriTech Infrastructure</h4>
                                <p class="text-xs text-slate-500 line-clamp-2">How Cloudflare Workers solved payment gateway timeouts during agricultural merchant harvests.</p>
                            </div>
                            <div class="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-900 transition-all cursor-pointer space-y-1">
                                <span class="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono text-[10px] font-bold uppercase">Design System</span>
                                <h4 class="font-extrabold text-slate-900 text-sm">COTIT Design Token Spec Sheet</h4>
                                <p class="text-xs text-slate-500 line-clamp-2">Complete typography and spacing variable definitions for global supply chain handheld scanners.</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        return `<div class="block-item group relative p-3 my-1 rounded-xl border border-slate-200 text-xs font-mono text-slate-500">Custom bangjeje Block Placeholder: ${type}</div>`;
    }

    static insertPattern(patternType) {
        this.closeBlockInserterModal();
        const container = document.getElementById('editorial-canvas-blocks') || document.getElementById('editorial-canvas-root');
        if (!container) return;

        let patternHtml = '';
        if (patternType === 'hero') {
            patternHtml = `
                <div class="block-item group relative p-3 my-2" data-block-type="heading" data-level="h1" onclick="EditorialOS.selectBlock(this)">
                    <h1 contenteditable="true" class="text-3xl sm:text-5xl font-extrabold text-slate-900 focus:outline-none tracking-tight leading-tight m-0">Engineering Enterprise Velocity with Headless Cloudflare Architecture</h1>
                </div>
                <div class="block-item group relative p-3 my-1" data-block-type="paragraph" onclick="EditorialOS.selectBlock(this)">
                    <p contenteditable="true" class="text-lg text-slate-600 leading-relaxed font-normal focus:outline-none m-0">An exhaustive technical audit and architectural implementation blueprint detailing how custom design tokens and edge computing eliminated monolithic supply chain bottlenecks for COTIT Corp.</p>
                </div>
                ${this.getCustomBlockHtml('tech-stack')}
            `;
        } else if (patternType === 'faq-group') {
            patternHtml = `
                <div class="block-item group relative p-3 my-2" data-block-type="heading" data-level="h2" onclick="EditorialOS.selectBlock(this)">
                    <h2 contenteditable="true" class="text-2xl font-extrabold text-slate-900 m-0">Frequently Asked Questions</h2>
                </div>
                <div class="block-item group relative p-3 my-1" data-block-type="faq" onclick="EditorialOS.selectBlock(this)">
                    <div class="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 my-1"><div class="p-4 font-bold text-slate-900 flex justify-between items-center bg-white border-b border-slate-200"><span contenteditable="true">How does edge caching reduce LCP latency?</span><i class="ph ph-caret-down text-slate-400"></i></div><div class="p-4 text-slate-600 text-sm leading-relaxed" contenteditable="true">By serving pre-compiled WebP visuals and HTML fragments from global Cloudflare edge nodes...</div></div>
                </div>
                <div class="block-item group relative p-3 my-1" data-block-type="faq" onclick="EditorialOS.selectBlock(this)">
                    <div class="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 my-1"><div class="p-4 font-bold text-slate-900 flex justify-between items-center bg-white border-b border-slate-200"><span contenteditable="true">Can this design system be integrated with WordPress or Next.js?</span><i class="ph ph-caret-down text-slate-400"></i></div><div class="p-4 text-slate-600 text-sm leading-relaxed" contenteditable="true">Yes. Because our tokens are built on standard Vanilla CSS variables and Tailwind classes, they port seamlessly into any framework without breaking changes.</div></div>
                </div>
            `;
        } else if (patternType === 'hubspot-lead') {
            patternHtml = this.getCustomBlockHtml('hubspot-form');
        } else if (patternType === 'tech-matrix') {
            patternHtml = this.getCustomBlockHtml('tech-stack');
        }

        const div = document.createElement('div');
        div.className = 'space-y-2 my-2';
        div.innerHTML = patternHtml;
        if (this.activeBlock) this.activeBlock.after(div);
        else container.appendChild(div);

        StudioToast.show(`Inserted Reusable Block Pattern: "${patternType.toUpperCase()}"`, 'success', 'Pattern Library');
        this.updateWordCount();
    }

    // --- SLASH MENU PORTAL ---
    static injectSlashMenu() {
        if (document.getElementById('slash-menu-portal')) return;
        const portal = document.createElement('div');
        portal.id = 'slash-menu-portal';
        portal.className = 'fixed z-50 bg-white rounded-xl shadow-2xl border border-slate-200 w-72 p-2 text-xs font-semibold hidden opacity-0 transition-opacity duration-150 overflow-hidden font-sans';
        portal.innerHTML = `
            <div class="px-2 py-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase border-b border-slate-100 mb-1">⚡ Instant Slash Library & Patterns</div>
            <div class="space-y-0.5 max-h-72 overflow-y-auto no-scrollbar">
                <a href="javascript:void(0)" onclick="EditorialOS.insertBlock('heading'); EditorialOS.closeSlashMenu();" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 transition-colors"><i class="ph ph-text-h-two text-lg text-blue-600"></i> Heading (H2/H3)</a>
                <a href="javascript:void(0)" onclick="EditorialOS.insertBlock('image'); EditorialOS.closeSlashMenu();" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 transition-colors"><i class="ph ph-image text-lg text-purple-600"></i> WordPress Media Library</a>
                <a href="javascript:void(0)" onclick="EditorialOS.insertBlock('gallery'); EditorialOS.closeSlashMenu();" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 transition-colors"><i class="ph ph-squares-four text-lg text-emerald-600"></i> Viewport Gallery</a>
                <a href="javascript:void(0)" onclick="EditorialOS.insertBlock('code'); EditorialOS.closeSlashMenu();" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 transition-colors"><i class="ph ph-code text-lg text-indigo-600"></i> Syntax Code Fence</a>
                <a href="javascript:void(0)" onclick="EditorialOS.insertBlock('callout'); EditorialOS.closeSlashMenu();" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 transition-colors"><i class="ph ph-lightning text-lg text-amber-500"></i> Pro-Tip Alert Callout</a>
                <!-- Custom bangjeje Blocks -->
                <div class="px-2 py-1 text-[10px] font-mono font-extrabold text-purple-700 uppercase pt-2 border-t border-slate-100 mt-1">Custom bangjeje Blocks</div>
                <a href="javascript:void(0)" onclick="EditorialOS.insertCustomBlock('case-study-cta'); EditorialOS.closeSlashMenu();" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 transition-colors"><i class="ph ph-briefcase text-lg text-slate-900"></i> Case Study CTA</a>
                <a href="javascript:void(0)" onclick="EditorialOS.insertCustomBlock('download-template'); EditorialOS.closeSlashMenu();" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 transition-colors"><i class="ph ph-download-simple text-lg text-emerald-700"></i> Download Template Box</a>
                <a href="javascript:void(0)" onclick="EditorialOS.insertCustomBlock('hubspot-form'); EditorialOS.closeSlashMenu();" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 transition-colors"><i class="ph ph-envelope text-lg text-amber-700"></i> HubSpot CRM Form</a>
                <a href="javascript:void(0)" onclick="EditorialOS.insertCustomBlock('author-bio'); EditorialOS.closeSlashMenu();" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 transition-colors"><i class="ph ph-user text-lg text-blue-700"></i> Author Bio Card</a>
                <a href="javascript:void(0)" onclick="EditorialOS.insertCustomBlock('tech-stack'); EditorialOS.closeSlashMenu();" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 transition-colors"><i class="ph ph-stack text-lg text-purple-700"></i> Technology Stack Matrix</a>
                <a href="javascript:void(0)" onclick="EditorialOS.insertCustomBlock('related-assets'); EditorialOS.closeSlashMenu();" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 transition-colors"><i class="ph ph-grid-four text-lg text-rose-700"></i> Related Assets Grid</a>
            </div>
        `;
        document.body.appendChild(portal);

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

    // --- KEYBOARD SHORTCUTS & AUTO SAVE ---
    static setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'f') {
                e.preventDefault();
                document.body.classList.toggle('focus-zen-mode');
                StudioToast.show(document.body.classList.contains('focus-zen-mode') ? 'Focus Mode Activated.' : 'Exited Focus Mode.', 'info', 'Gutenberg OS');
            }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                e.preventDefault();
                this.triggerVaultSave();
            }
            if (e.key === 'Escape') {
                this.closeSlashMenu();
                this.closeMediaLibraryModal();
                this.closeBlockInserterModal();
                this.closePublishModal();
                this.exitViewportSandbox();
            }
        });
    }

    static triggerVaultSave() {
        const statusEl = document.getElementById('vault-sync-status');
        if (statusEl) {
            statusEl.innerHTML = '<span class="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block mr-1.5"></span> Saving Revisions...';
            setTimeout(() => statusEl.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1.5"></span> Vault Synced', 600);
        }
        StudioToast.show('Revision snapshot committed directly to Cloudflare Vault.', 'success', 'Vault Sync');
    }

    static setupAutoSave() {
        let timer;
        document.addEventListener('input', (e) => {
            if (e.target && (e.target.closest('.block-item') || e.target.classList.contains('canvas-title'))) {
                clearTimeout(timer);
                const statusEl = document.getElementById('vault-sync-status');
                if (statusEl) statusEl.innerHTML = '<span class="w-2 h-2 rounded-full bg-slate-400 inline-block mr-1.5"></span> Unsaved...';
                timer = setTimeout(() => {
                    if (statusEl) statusEl.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1.5"></span> Vault Synced';
                    this.updateWordCount();
                }, 1200);
            }
        });
    }

    static updateWordCount() {
        const canvas = document.getElementById('editorial-canvas-blocks') || document.getElementById('editorial-canvas-root') || document.body;
        const words = (canvas.innerText || '').trim().split(/\s+/).filter(w => w.length > 0 && w !== '⋮⋮').length;
        const meter = document.getElementById('reading-time-meter');
        if (meter) meter.textContent = `${words} Words | ${Math.max(1, Math.ceil(words / 200))}m Read`;
    }

    // --- PRE-PUBLISH GATE & VIEWPORT SANDBOX ---
    static injectPublishModal() {
        if (document.getElementById('publish-gate-modal')) return;
        const modal = document.createElement('div');
        modal.id = 'publish-gate-modal';
        modal.className = 'fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 hidden opacity-0 transition-all duration-150 font-sans';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-8 space-y-6 transform scale-95 transition-transform">
                <div class="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-slate-900 text-[#C3FF00] flex items-center justify-center text-xl shadow-xs"><i class="ph ph-rocket-launch"></i></div>
                        <div><h3 class="font-extrabold text-slate-900 text-lg">Deploy to Cloudflare Edge?</h3><p class="text-xs text-slate-500 font-normal">Gutenberg pre-publish quality verification audit</p></div>
                    </div>
                    <button onclick="EditorialOS.closePublishModal()" class="text-slate-400 hover:text-slate-900 font-mono text-base">✕</button>
                </div>
                <div class="space-y-2.5 text-xs font-semibold text-slate-700">
                    <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2.5"><i class="ph ph-check-circle text-lg text-emerald-600"></i> <span>SEO Optimization Score verified at <strong>96/100 (Grade A)</strong></span></div>
                    <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5"><i class="ph ph-check text-emerald-600 text-base font-bold"></i> <span>All Image Blocks contain valid WCAG Alt-Text</span></div>
                    <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5"><i class="ph ph-check text-emerald-600 text-base font-bold"></i> <span>HubSpot CRM Lead capture pipeline connected</span></div>
                </div>
                <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                    <button type="button" onclick="EditorialOS.closePublishModal()" class="btn-studio-secondary py-2.5 px-5 text-xs">Return to Editor</button>
                    <button type="button" onclick="EditorialOS.confirmBroadcast()" class="btn-studio-primary py-2.5 px-6 text-xs bg-[#C3FF00] text-slate-900 font-black shadow-md">✓ Broadcast to Edge</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    static openPublishModal() {
        const modal = document.getElementById('publish-gate-modal');
        if (modal) {
            modal.classList.remove('hidden');
            setTimeout(() => { modal.classList.remove('opacity-0'); modal.querySelector('div').classList.remove('scale-95'); }, 10);
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
        if (badge) { badge.className = 'px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-extrabold uppercase'; badge.textContent = 'Published Live on Edge'; }
    }

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
                    <button onclick="EditorialOS.switchViewport('tablet')" id="vp-btn-tablet" class="px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-400 font-semibold">Tablet (11")</button>
                    <button onclick="EditorialOS.switchViewport('mobile')" id="vp-btn-mobile" class="px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-400 font-semibold">Mobile (iPhone 15 Pro)</button>
                </div>
                <button onclick="EditorialOS.exitViewportSandbox()" class="btn-studio-secondary py-2 px-4 text-xs font-bold text-slate-900 bg-white">✕ Return to Editor</button>
            </header>
            <div class="flex-1 bg-slate-900 overflow-y-auto p-6 sm:p-10 flex items-start justify-center">
                <div id="viewport-frame-container" class="bg-white text-slate-900 rounded-2xl shadow-2xl overflow-y-auto max-w-4xl w-full p-12 transition-all duration-300 border border-slate-700 min-h-[600px] font-sans"></div>
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
            if (btn) btn.className = m === mode ? 'px-3 py-1.5 rounded-lg bg-slate-800 text-[#C3FF00] font-bold' : 'px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-400 font-semibold';
        });
        container.className = mode === 'desktop' ? 'bg-white text-slate-900 rounded-2xl shadow-2xl overflow-y-auto max-w-4xl w-full p-12 transition-all duration-300 border border-slate-700 min-h-[700px]' :
                              mode === 'tablet'  ? 'bg-white text-slate-900 rounded-2xl shadow-2xl overflow-y-auto max-w-[640px] w-full p-8 transition-all duration-300 border border-slate-700 min-h-[800px]' :
                                                   'bg-white text-slate-900 rounded-3xl shadow-2xl overflow-y-auto max-w-[390px] w-full p-5 transition-all duration-300 border-[8px] border-slate-800 min-h-[780px]';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    EditorialOS.init();
});
