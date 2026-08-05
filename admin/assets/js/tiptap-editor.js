/**
 * bangjeje.dev Studio V2 — Sprint 2: Media Library Integration (Tiptap Engine)
 * Production-ready Vanilla JavaScript ES Module implementation of Tiptap with Reusable R2 Media Vault.
 * Focus: Seamless image block insertion via StudioMediaLibrary modal instead of native browser file pickers.
 */

import { Editor } from 'https://esm.sh/@tiptap/core@2.10.4';
import StarterKit from 'https://esm.sh/@tiptap/starter-kit@2.10.4';
import Placeholder from 'https://esm.sh/@tiptap/extension-placeholder@2.10.4';
import Image from 'https://esm.sh/@tiptap/extension-image@2.10.4';

class StudioArticleEditorV2 {
    constructor() {
        this.editor = null;
        this.slashMenuOpen = false;
        this.slashQuery = '';
        this.selectedIndex = 0;
        this.saveTimer = null;
        this.lastSaveTime = null;
        this.tickerInterval = null;

        // Categorized & searchable Slash Command block library with Sprint 2 Media & Vault integration
        this.slashCatalog = [
            { category: 'Typography', title: 'Heading 1', keywords: 'h1 heading one large title section headline', desc: 'Large document headline or section break', icon: 'ph-text-h-one', action: () => this.editor.chain().focus().toggleHeading({ level: 1 }).run() },
            { category: 'Typography', title: 'Heading 2', keywords: 'h2 heading two medium chapter section', desc: 'Medium chapter heading for structured breaks', icon: 'ph-text-h-two', action: () => this.editor.chain().focus().toggleHeading({ level: 2 }).run() },
            { category: 'Typography', title: 'Heading 3', keywords: 'h3 heading three small subsection header', desc: 'Small subsection header', icon: 'ph-text-h-three', action: () => this.editor.chain().focus().toggleHeading({ level: 3 }).run() },
            
            { category: 'Media & Vault', title: 'Image Asset', keywords: 'image media photo picture asset r2 cloudflare vault webp', desc: 'Insert high-res WebP asset from R2 Vault', icon: 'ph-image', action: () => this.openMediaLibraryVault() },
            { category: 'Media & Vault', title: 'Media Library Vault', keywords: 'vault library r2 assets existing pictures gallery storage', desc: 'Browse Studio V2 Media Library attachments', icon: 'ph-images-square', action: () => this.openMediaLibraryVault() },
            
            { category: 'Lists & Structure', title: 'Bullet List', keywords: 'ul bullet list points unordered item dots', desc: 'Create a simple bulleted item list', icon: 'ph-list-bullets', action: () => this.editor.chain().focus().toggleBulletList().run() },
            { category: 'Lists & Structure', title: 'Numbered List', keywords: 'ol number ordered list sequential numbers 1 2', desc: 'Create a numbered sequential array', icon: 'ph-list-numbers', action: () => this.editor.chain().focus().toggleOrderedList().run() },
            { category: 'Lists & Structure', title: 'Divider Rule', keywords: 'hr divider line separator horizontal break', desc: 'Horizontal separation rule between topics', icon: 'ph-minus', action: () => this.editor.chain().focus().setHorizontalRule().run() },
            
            { category: 'Callouts & Syntax', title: 'Quote Box', keywords: 'quote blockquote citation executive emphasis', desc: 'Capture an executive citation or emphasis quote', icon: 'ph-quotes', action: () => this.editor.chain().focus().toggleBlockquote().run() },
            { category: 'Callouts & Syntax', title: 'Code Fence', keywords: 'code fence syntax block developer javascript typescript pre', desc: 'Syntax highlighting code block for developers', icon: 'ph-code', action: () => this.editor.chain().focus().toggleCodeBlock().run() }
        ];

        this.filteredItems = [...this.slashCatalog];
        this.init();
    }

    init() {
        this.initTiptap();
        this.bindToolbarEvents();
        this.bindSlashMenu();
        this.bindTitleAndSave();
        this.setupKeyboardShortcuts();
        this.injectSlashDropdownDOM();
        this.restoreOrInitDraft();
        this.startSaveTicker();
        
        window.StudioEditor = this;
    }

    initTiptap() {
        const container = document.getElementById('tiptap-canvas-root');
        if (!container) return;

        this.editor = new Editor({
            element: container,
            extensions: [
                StarterKit.configure({
                    heading: { levels: [1, 2, 3, 4] },
                    bulletList: { HTMLAttributes: { class: 'tiptap-ul list-disc pl-6 space-y-2.5 text-slate-800 font-medium my-4' } },
                    orderedList: { HTMLAttributes: { class: 'tiptap-ol list-decimal pl-6 space-y-2.5 text-slate-800 font-medium my-4' } },
                    blockquote: { HTMLAttributes: { class: 'tiptap-quote pl-6 border-l-4 border-slate-900 bg-slate-50/70 py-4 pr-6 rounded-r-xl my-6 italic font-serif text-xl sm:text-2xl text-slate-800 leading-relaxed' } },
                    codeBlock: { HTMLAttributes: { class: 'tiptap-code-block rounded-2xl bg-slate-900 text-emerald-300 font-mono text-sm sm:text-base p-6 my-6 overflow-x-auto border border-slate-800 shadow-sm leading-relaxed' } },
                    code: { HTMLAttributes: { class: 'tiptap-code bg-slate-100 text-rose-600 font-mono text-xs sm:text-sm font-extrabold px-2 py-0.5 rounded border border-slate-200/80' } },
                    horizontalRule: { HTMLAttributes: { class: 'my-10 border-t-2 border-slate-200' } }
                }),
                Image.configure({
                    inline: false,
                    allowBase64: true,
                    HTMLAttributes: {
                        class: 'tiptap-image rounded-2xl border border-slate-200/80 shadow-md my-8 max-w-full h-auto cursor-pointer block hover:shadow-xl transition-all'
                    }
                }),
                Placeholder.configure({
                    placeholder: ({ node }) => {
                        if (node.type.name === 'heading') {
                            return `Heading level ${node.attrs.level}...`;
                        }
                        return "Press '/' for commands (e.g. /image for Media Vault), or just start typing...";
                    },
                    emptyEditorClass: 'tiptap-empty-canvas',
                    emptyNodeClass: 'tiptap-empty-node'
                })
            ],
            editorProps: {
                attributes: {
                    class: 'prose prose-slate max-w-none focus:outline-none text-slate-800 text-lg sm:text-[20px] leading-[1.8] font-normal min-h-[480px] selection:bg-[#C3FF00]/50 selection:text-slate-950 pb-32 font-sans'
                }
            },
            onUpdate: ({ editor }) => {
                this.handleContentUpdate();
                this.updateToolbarState(editor);
            },
            onSelectionUpdate: ({ editor }) => {
                this.updateToolbarState(editor);
            }
        });
    }

    // --- SPRINT 2 REUSABLE MEDIA LIBRARY VAULT INTEGRATION ---
    openMediaLibraryVault() {
        if (!window.StudioMediaLibrary) {
            console.error('StudioMediaLibrary singleton not detected in DOM.');
            StudioToast?.show('Media Library engine not loaded.', 'error', 'Studio V2');
            return;
        }

        window.StudioMediaLibrary.open({
            onSelect: (asset) => {
                if (!this.editor) return;
                
                // Insert crisp WebP image node into Tiptap with WCAG Alt text and Caption title
                this.editor.chain().focus().setImage({
                    src: asset.url,
                    alt: asset.alt || asset.filename,
                    title: asset.caption || asset.alt
                }).run();

                StudioToast?.show(`Inserted "${asset.filename}" from Studio V2 Media Library!`, 'success', 'Media Vault');
                this.handleContentUpdate();
            }
        });
    }

    restoreOrInitDraft() {
        const saved = localStorage.getItem('bangjeje_studio_v2_draft');
        const titleInput = document.getElementById('doc-title-input');
        
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.title && titleInput) titleInput.value = data.title;
                if (data.content && this.editor) this.editor.commands.setContent(data.content, false);
                if (data.timestamp) {
                    this.lastSaveTime = new Date(data.timestamp);
                    this.renderSaveStatus('saved');
                }
            } catch (e) {
                console.error('Failed to parse local draft:', e);
            }
        }

        if (!this.editor.getText().trim()) {
            this.editor.commands.setContent(`
                <p>Writing in Studio V2 now includes complete integration with our single source of truth: the <strong>Studio V2 Reusable Media Library</strong>.</p>
                <h2>1. Cloudflare R2 Media Vault Integration</h2>
                <p>Instead of relying on disconnected, rudimentary operating system file pickers, selecting an Image block or typing <code>/image</code> instantaneously launches the centralized Media Vault.</p>
                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1440&q=80" alt="COTIT Enterprise ERP Supply Chain Dashboard Preview on MacBook" title="Figure 1.1: COTIT Real-Time Factory Floor Telemetry & Edge Logistics Hub" />
                <p>Within the Media Library modal, authors gain real-time controls over WebP compression, WCAG Alt text editing, editorial caption attributions, and dynamic searching across recently uploaded and used assets.</p>
                <blockquote>"A design system is only as powerful as its centralized asset pipeline. Studio V2 brings cloud storage directly to the cursor."</blockquote>
                <h3>How to Test Media Insertion:</h3>
                <ul>
                    <li><strong>Sticky Toolbar:</strong> Click the new 🖼️ Image icon directly between Heading and List buttons.</li>
                    <li><strong>Slash Commands:</strong> Type <code>/image</code> or <code>/media</code> on any new blank line.</li>
                    <li><strong>Drag & Drop Vault:</strong> Drop local files into the modal to compress and save directly into your local vault foundation.</li>
                </ul>
                <p>Continue drafting below...</p>
            `, false);
        }

        setTimeout(() => {
            this.updateWordCount();
            if (titleInput && (!titleInput.value || titleInput.value === 'Untitled Article...')) {
                titleInput.focus();
            }
        }, 150);
    }

    // --- TOOLBAR STATE SYNCHRONIZATION ---
    updateToolbarState(editor) {
        const toggleBtn = (id, active) => {
            const el = document.getElementById(id);
            if (el) {
                if (active) {
                    el.classList.add('bg-slate-900', 'text-[#C3FF00]', 'border-slate-900', 'shadow-xs');
                    el.classList.remove('text-slate-600', 'border-transparent', 'hover:bg-slate-100');
                } else {
                    el.classList.remove('bg-slate-900', 'text-[#C3FF00]', 'border-slate-900', 'shadow-xs');
                    el.classList.add('text-slate-600', 'border-transparent', 'hover:bg-slate-100');
                }
            }
        };

        toggleBtn('tb-bold', editor.isActive('bold'));
        toggleBtn('tb-italic', editor.isActive('italic'));
        toggleBtn('tb-strike', editor.isActive('strike'));
        toggleBtn('tb-h1', editor.isActive('heading', { level: 1 }));
        toggleBtn('tb-h2', editor.isActive('heading', { level: 2 }));
        toggleBtn('tb-h3', editor.isActive('heading', { level: 3 }));
        toggleBtn('tb-image', editor.isActive('image'));
        toggleBtn('tb-bullet', editor.isActive('bulletList'));
        toggleBtn('tb-ordered', editor.isActive('orderedList'));
        toggleBtn('tb-quote', editor.isActive('blockquote'));
        toggleBtn('tb-code', editor.isActive('codeBlock'));

        const u = document.getElementById('tb-undo');
        const r = document.getElementById('tb-redo');
        if (u) u.disabled = !editor.can().undo();
        if (r) r.disabled = !editor.can().redo();
    }

    bindToolbarEvents() {
        const bind = (id, fn) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('click', (e) => { e.preventDefault(); fn(); this.editor?.focus(); });
        };

        bind('tb-bold', () => this.editor.chain().focus().toggleBold().run());
        bind('tb-italic', () => this.editor.chain().focus().toggleItalic().run());
        bind('tb-strike', () => this.editor.chain().focus().toggleStrike().run());
        bind('tb-h1', () => this.editor.chain().focus().toggleHeading({ level: 1 }).run());
        bind('tb-h2', () => this.editor.chain().focus().toggleHeading({ level: 2 }).run());
        bind('tb-h3', () => this.editor.chain().focus().toggleHeading({ level: 3 }).run());
        
        // SPRINT 2: Bind Image button to Reusable Media Library Modal
        bind('tb-image', () => this.openMediaLibraryVault());

        bind('tb-bullet', () => this.editor.chain().focus().toggleBulletList().run());
        bind('tb-ordered', () => this.editor.chain().focus().toggleOrderedList().run());
        bind('tb-quote', () => this.editor.chain().focus().toggleBlockquote().run());
        bind('tb-code', () => this.editor.chain().focus().toggleCodeBlock().run());
        bind('tb-clear', () => this.editor.chain().focus().unsetAllMarks().clearNodes().run());

        bind('tb-undo', () => this.editor.chain().focus().undo().run());
        bind('tb-redo', () => this.editor.chain().focus().redo().run());
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            const ctrl = e.ctrlKey || e.metaKey;
            if (ctrl && e.shiftKey && (e.key === '7' || e.code === 'Digit7')) {
                e.preventDefault();
                this.editor.chain().focus().toggleOrderedList().run();
            } else if (ctrl && e.shiftKey && (e.key === '8' || e.code === 'Digit8')) {
                e.preventDefault();
                this.editor.chain().focus().toggleBulletList().run();
            } else if (ctrl && (e.key === '/' || e.code === 'Slash')) {
                e.preventDefault();
                this.editor.commands.insertContent('/');
                setTimeout(() => this.checkSlashTrigger(), 20);
            } else if (ctrl && e.key.toLowerCase() === 's') {
                e.preventDefault();
                this.executeLocalSave();
            }
        });
    }

    // --- SLASH COMMAND ENGINE WITH DYNAMIC SEARCH & CATEGORIES ---
    injectSlashDropdownDOM() {
        if (document.getElementById('tiptap-slash-menu')) return;
        const dropdown = document.createElement('div');
        dropdown.id = 'tiptap-slash-menu';
        dropdown.className = 'fixed z-50 bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-80 p-2 hidden opacity-0 transform scale-95 transition-all duration-150 overflow-hidden font-sans';
        dropdown.innerHTML = `
            <div class="px-3 py-1.5 text-[11px] font-mono font-bold text-slate-400 uppercase border-b border-slate-100 mb-1.5 flex justify-between items-center">
                <span>⚡ Block Library</span><span id="slash-filter-tag" class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono lowercase">/</span>
            </div>
            <div id="slash-items-list" class="space-y-1 max-h-80 overflow-y-auto no-scrollbar pr-0.5"></div>
        `;
        document.body.appendChild(dropdown);
    }

    bindSlashMenu() {
        document.addEventListener('keydown', (e) => {
            if (!this.slashMenuOpen) {
                if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
                    setTimeout(() => this.checkSlashTrigger(), 30);
                }
                return;
            }

            if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
                e.preventDefault();
                this.selectedIndex = (this.selectedIndex + 1) % Math.max(1, this.filteredItems.length);
                this.renderSlashItems();
            } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
                e.preventDefault();
                this.selectedIndex = (this.selectedIndex - 1 + this.filteredItems.length) % Math.max(1, this.filteredItems.length);
                this.renderSlashItems();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                this.executeSlashSelection(this.selectedIndex);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.closeSlashMenu();
            } else if (e.key === 'Backspace' || e.key.length === 1) {
                setTimeout(() => this.checkSlashTrigger(), 30);
            }
        });

        document.addEventListener('click', (e) => {
            const menu = document.getElementById('tiptap-slash-menu');
            if (menu && !menu.contains(e.target)) this.closeSlashMenu();
        });
    }

    checkSlashTrigger() {
        if (!this.editor) return;
        const selection = window.getSelection();
        if (!selection || !selection.rangeCount) return;

        const { from } = this.editor.state.selection;
        const textBefore = this.editor.state.doc.textBetween(Math.max(0, from - 20), from, '\n');
        
        const match = textBefore.match(/(?:^|\s)\/([a-zA-Z0-9]*)$/);
        if (match) {
            this.slashQuery = match[1].toLowerCase();
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            
            this.filterCatalog(this.slashQuery);
            if (!this.slashMenuOpen) {
                this.openSlashMenu(rect.left, rect.bottom + window.scrollY + 8);
            } else {
                this.renderSlashItems();
                const tag = document.getElementById('slash-filter-tag');
                if (tag) tag.textContent = `/${this.slashQuery || ''}`;
            }
        } else if (this.slashMenuOpen) {
            this.closeSlashMenu();
        }
    }

    filterCatalog(query) {
        if (!query) {
            this.filteredItems = [...this.slashCatalog];
        } else {
            this.filteredItems = this.slashCatalog.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.keywords.toLowerCase().includes(query)
            );
        }
        this.selectedIndex = 0;
    }

    openSlashMenu(x, y) {
        this.slashMenuOpen = true;
        const menu = document.getElementById('tiptap-slash-menu');
        if (!menu) return;

        menu.style.left = `${Math.min(x, window.innerWidth - 340)}px`;
        menu.style.top = `${y}px`;
        const tag = document.getElementById('slash-filter-tag');
        if (tag) tag.textContent = `/${this.slashQuery || ''}`;
        
        this.renderSlashItems();
        menu.classList.remove('hidden');
        setTimeout(() => {
            menu.classList.remove('opacity-0', 'scale-95');
        }, 10);
    }

    closeSlashMenu() {
        this.slashMenuOpen = false;
        const menu = document.getElementById('tiptap-slash-menu');
        if (menu && !menu.classList.contains('hidden')) {
            menu.classList.add('opacity-0', 'scale-95');
            setTimeout(() => menu.classList.add('hidden'), 150);
        }
    }

    renderSlashItems() {
        const list = document.getElementById('slash-items-list');
        if (!list) return;

        if (this.filteredItems.length === 0) {
            list.innerHTML = `<div class="p-6 text-center text-xs font-semibold text-slate-400 font-sans">No matching block commands found for "/${this.slashQuery}"</div>`;
            return;
        }

        let currentCategory = '';
        list.innerHTML = this.filteredItems.map((item, index) => {
            const isSelected = index === this.selectedIndex;
            let header = '';
            if (item.category !== currentCategory) {
                currentCategory = item.category;
                header = `<div class="px-3 pt-3 pb-1 text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider">${currentCategory}</div>`;
            }

            return `
                ${header}
                <div onclick="StudioEditor.executeSlashSelection(${index})" 
                     class="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all ${isSelected ? 'bg-slate-900 text-white shadow-sm' : 'hover:bg-slate-100 text-slate-800'}">
                    <div class="w-9 h-9 rounded-lg ${isSelected ? 'bg-slate-800 text-[#C3FF00]' : 'bg-slate-100 text-slate-700'} flex items-center justify-center shrink-0 text-lg font-extrabold shadow-2xs">
                        <i class="ph ${item.icon}"></i>
                    </div>
                    <div class="flex-1 overflow-hidden">
                        <div class="text-xs font-extrabold truncate">${item.title}</div>
                        <div class="text-[11px] ${isSelected ? 'text-slate-300' : 'text-slate-400'} truncate font-normal">${item.desc}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    executeSlashSelection(index) {
        const item = this.filteredItems[index];
        if (!item || !this.editor) return;

        const deleteLen = 1 + (this.slashQuery ? this.slashQuery.length : 0);
        const { from } = this.editor.state.selection;
        this.editor.chain().focus().deleteRange({ from: from - deleteLen, to: from }).run();

        item.action();
        this.closeSlashMenu();
    }

    // --- AMBIENT AUTO-SAVE UX (NO TOASTS) ---
    bindTitleAndSave() {
        const titleInput = document.getElementById('doc-title-input');
        if (titleInput) {
            titleInput.addEventListener('input', () => this.handleContentUpdate());
            titleInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (this.editor) this.editor.commands.focus('start');
                }
            });
        }

        const saveBtn = document.getElementById('btn-save-draft');
        if (saveBtn) {
            saveBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.executeLocalSave(true);
            });
        }
    }

    handleContentUpdate() {
        this.updateWordCount();
        this.renderSaveStatus('saving');
        
        clearTimeout(this.saveTimer);
        this.saveTimer = setTimeout(() => {
            this.executeLocalSave(false);
        }, 1200);
    }

    executeLocalSave(isExplicit = false) {
        const titleInput = document.getElementById('doc-title-input');
        const title = titleInput ? titleInput.value : 'Untitled Article';
        const html = this.editor ? this.editor.getHTML() : '';
        const timestamp = new Date().toISOString();

        localStorage.setItem('bangjeje_studio_v2_draft', JSON.stringify({ title, content: html, timestamp }));
        
        if (window.StudioArticleWorkflow && isExplicit) {
            window.StudioArticleWorkflow.saveMetadata(true, 'Explicit author revision checkpoint');
            StudioToast?.show('Saved document & editorial metadata checkpoint!', 'success', 'Revision Vault');
        }

        this.lastSaveTime = new Date();
        this.renderSaveStatus('saved');
    }

    renderSaveStatus(state) {
        const badge = document.getElementById('ambient-save-status');
        if (!badge) return;

        if (state === 'saving') {
            badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse inline-block mr-2"></span>Saving...`;
            badge.className = 'font-mono text-xs text-slate-500 font-bold transition-all';
        } else if (state === 'saved') {
            badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-2"></span>Saved`;
            badge.className = 'font-mono text-xs text-slate-700 font-bold transition-all';
            setTimeout(() => this.tickClock(), 2500);
        }
    }

    startSaveTicker() {
        clearInterval(this.tickerInterval);
        this.tickerInterval = setInterval(() => this.tickClock(), 3000);
    }

    tickClock() {
        if (!this.lastSaveTime) return;
        const badge = document.getElementById('ambient-save-status');
        if (!badge || badge.textContent.includes('Saving...')) return;

        const seconds = Math.floor((new Date() - this.lastSaveTime) / 1000);
        if (seconds < 3) {
            badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-2"></span>Saved`;
        } else if (seconds < 60) {
            badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-slate-300 inline-block mr-2"></span>Last saved ${seconds} seconds ago`;
            badge.className = 'font-mono text-xs text-slate-400 font-medium transition-all';
        } else {
            const mins = Math.floor(seconds / 60);
            badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-slate-300 inline-block mr-2"></span>Last saved ${mins} ${mins === 1 ? 'minute' : 'minutes'} ago`;
            badge.className = 'font-mono text-xs text-slate-400 font-medium transition-all';
        }
    }

    updateWordCount() {
        if (!this.editor) return;
        const text = this.editor.getText().trim();
        const words = text ? text.split(/\s+/).filter(w => w.length > 0).length : 0;
        const meter = document.getElementById('reading-word-meter');
        if (meter) {
            meter.textContent = `${words} Words | ${Math.max(1, Math.ceil(words / 200))}m Read`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new StudioArticleEditorV2();
});
