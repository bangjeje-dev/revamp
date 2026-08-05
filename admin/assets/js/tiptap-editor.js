/**
 * bangjeje.dev Studio V2 — Sprint 1: Article Workspace MVP (Tiptap Editorial Engine)
 * Pure Vanilla JavaScript ES Module implementation of Tiptap via high-velocity CDN.
 * Focus: Smooth, fast, and stable writing experience with Slash Commands and TailAdmin styling.
 * Exclusions: No SEO, no Media Library, no Cloudflare R2, no custom blocks, no publishing backend.
 */

import { Editor } from 'https://esm.sh/@tiptap/core@2.10.4';
import StarterKit from 'https://esm.sh/@tiptap/starter-kit@2.10.4';
import Placeholder from 'https://esm.sh/@tiptap/extension-placeholder@2.10.4';

class StudioArticleEditor {
    constructor() {
        this.editor = null;
        this.slashMenuOpen = false;
        this.slashQuery = '';
        this.selectedIndex = 0;
        this.slashItems = [
            { title: 'Heading 1', desc: 'Large document headline or section title', icon: 'ph-text-h-one', action: () => this.editor.chain().focus().toggleHeading({ level: 1 }).run() },
            { title: 'Heading 2', desc: 'Medium chapter heading for structured breaks', icon: 'ph-text-h-two', action: () => this.editor.chain().focus().toggleHeading({ level: 2 }).run() },
            { title: 'Heading 3', desc: 'Small subsection header', icon: 'ph-text-h-three', action: () => this.editor.chain().focus().toggleHeading({ level: 3 }).run() },
            { title: 'Bullet List', desc: 'Create a simple bulleted item list', icon: 'ph-list-bullets', action: () => this.editor.chain().focus().toggleBulletList().run() },
            { title: 'Numbered List', desc: 'Create a numbered sequential list', icon: 'ph-list-numbers', action: () => this.editor.chain().focus().toggleOrderedList().run() },
            { title: 'Quote Box', desc: 'Capture an executive citation or emphasis quote', icon: 'ph-quotes', action: () => this.editor.chain().focus().toggleBlockquote().run() },
            { title: 'Code Fence', desc: 'Syntax highlighting code block for developers', icon: 'ph-code', action: () => this.editor.chain().focus().toggleCodeBlock().run() },
            { title: 'Divider Rule', desc: 'Horizontal separation rule between topics', icon: 'ph-minus', action: () => this.editor.chain().focus().setHorizontalRule().run() }
        ];

        this.init();
    }

    init() {
        this.initTiptap();
        this.bindToolbarEvents();
        this.bindSlashMenu();
        this.bindTitleAndSave();
        this.setupWordCount();
        this.injectSlashDropdownDOM();
        
        // Expose instance to global window for onclick inline handlers if needed
        window.StudioEditor = this;
        
        StudioToast?.show('Tiptap V2 Editorial Engine active! Type "/" for instant block formatting.', 'success', 'Studio V2');
    }

    initTiptap() {
        const container = document.getElementById('tiptap-canvas-root');
        if (!container) {
            console.error('Tiptap mount point #tiptap-canvas-root not found in DOM.');
            return;
        }

        this.editor = new Editor({
            element: container,
            extensions: [
                StarterKit.configure({
                    heading: { levels: [1, 2, 3, 4] },
                    bulletList: { HTMLAttributes: { class: 'tiptap-ul list-disc pl-6 space-y-2 text-slate-800 font-medium my-3' } },
                    orderedList: { HTMLAttributes: { class: 'tiptap-ol list-decimal pl-6 space-y-2 text-slate-800 font-medium my-3' } },
                    blockquote: { HTMLAttributes: { class: 'tiptap-quote pl-5 border-l-4 border-slate-900 my-5 py-1 italic font-serif text-xl text-slate-800' } },
                    codeBlock: { HTMLAttributes: { class: 'tiptap-code-block rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs p-5 my-4 overflow-x-auto border border-slate-800 shadow-sm leading-relaxed' } },
                    code: { HTMLAttributes: { class: 'tiptap-code bg-slate-100 text-rose-600 font-mono text-xs font-bold px-1.5 py-0.5 rounded border border-slate-200' } },
                    horizontalRule: { HTMLAttributes: { class: 'my-8 border-t-2 border-slate-200' } }
                }),
                Placeholder.configure({
                    placeholder: ({ node }) => {
                        if (node.type.name === 'heading') {
                            return `Heading level ${node.attrs.level}...`;
                        }
                        return "Start writing your article, or press '/' for commands...";
                    },
                    emptyEditorClass: 'tiptap-empty-canvas',
                    emptyNodeClass: 'tiptap-empty-node'
                })
            ],
            content: `
                <p>Writing in <strong>Studio V2</strong> is designed to feel lighter, faster, and closer to Notion or Ghost than a heavy CMS administration panel.</p>
                <h2>1. Built on Tiptap & ProseMirror</h2>
                <p>We have replaced isolated JSON block containers with a real time unified document model. You can seamlessly select text across multiple paragraphs, apply instant typography styles, and utilize intuitive keyboard accelerators.</p>
                <blockquote>"The editor should adapt to the author. The author should never adapt to the editor. Writing always comes first."</blockquote>
                <h3>Supported MVP Capabilities:</h3>
                <ul>
                    <li><strong>Fluid Typography:</strong> Support for headings, bulleted arrays, ordered lists, and emphasis quotes.</li>
                    <li><strong>Zero-Clutter Workspace:</strong> No disruptive SEO forms or metadata modals interfering with your narrative drafting flow.</li>
                    <li><strong>Slash Command Foundation:</strong> Try typing a forward slash <code>/</code> at any new line to trigger instant formatting models.</li>
                </ul>
                <pre><code>// Example Tiptap Code Fence\nconst studioV2 = {\n  engine: "Tiptap / ProseMirror",\n  theme: "TailAdmin White & Outfit font",\n  status: "Sprint 1 MVP Active"\n};</code></pre>
                <p>Continue drafting below...</p>
            `,
            editorProps: {
                attributes: {
                    class: 'prose prose-slate max-w-none focus:outline-none text-slate-800 text-lg sm:text-xl leading-relaxed font-normal min-h-[420px] selection:bg-[#C3FF00]/50 selection:text-slate-900 pb-32 font-sans'
                }
            },
            onUpdate: ({ editor }) => {
                this.handleEditorUpdate(editor);
                this.updateToolbarState(editor);
            },
            onSelectionUpdate: ({ editor }) => {
                this.updateToolbarState(editor);
            }
        });
    }

    // --- TOOLBAR STATE SYNCHRONIZATION ---
    updateToolbarState(editor) {
        const toggleBtn = (id, active) => {
            const el = document.getElementById(id);
            if (el) {
                if (active) el.classList.add('bg-slate-900', 'text-[#C3FF00]', 'border-slate-800');
                else el.classList.remove('bg-slate-900', 'text-[#C3FF00]', 'border-slate-800');
            }
        };

        toggleBtn('tb-bold', editor.isActive('bold'));
        toggleBtn('tb-italic', editor.isActive('italic'));
        toggleBtn('tb-strike', editor.isActive('strike'));
        toggleBtn('tb-h1', editor.isActive('heading', { level: 1 }));
        toggleBtn('tb-h2', editor.isActive('heading', { level: 2 }));
        toggleBtn('tb-h3', editor.isActive('heading', { level: 3 }));
        toggleBtn('tb-bullet', editor.isActive('bulletList'));
        toggleBtn('tb-ordered', editor.isActive('orderedList'));
        toggleBtn('tb-quote', editor.isActive('blockquote'));
        toggleBtn('tb-code', editor.isActive('codeBlock'));

        // History undo/redo status
        const undoBtn = document.getElementById('tb-undo');
        const redoBtn = document.getElementById('tb-redo');
        if (undoBtn) undoBtn.disabled = !editor.can().undo();
        if (redoBtn) redoBtn.disabled = !editor.can().redo();
    }

    bindToolbarEvents() {
        const bind = (id, fn) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('click', (e) => { e.preventDefault(); fn(); this.editor.focus(); });
        };

        bind('tb-bold', () => this.editor.chain().focus().toggleBold().run());
        bind('tb-italic', () => this.editor.chain().focus().toggleItalic().run());
        bind('tb-strike', () => this.editor.chain().focus().toggleStrike().run());
        bind('tb-h1', () => this.editor.chain().focus().toggleHeading({ level: 1 }).run());
        bind('tb-h2', () => this.editor.chain().focus().toggleHeading({ level: 2 }).run());
        bind('tb-h3', () => this.editor.chain().focus().toggleHeading({ level: 3 }).run());
        bind('tb-bullet', () => this.editor.chain().focus().toggleBulletList().run());
        bind('tb-ordered', () => this.editor.chain().focus().toggleOrderedList().run());
        bind('tb-quote', () => this.editor.chain().focus().toggleBlockquote().run());
        bind('tb-code', () => this.editor.chain().focus().toggleCodeBlock().run());
        bind('tb-clear', () => this.editor.chain().focus().unsetAllMarks().clearNodes().run());

        bind('tb-undo', () => this.editor.chain().focus().undo().run());
        bind('tb-redo', () => this.editor.chain().focus().redo().run());
    }

    // --- SLASH COMMAND ENGINE ---
    injectSlashDropdownDOM() {
        if (document.getElementById('tiptap-slash-menu')) return;
        const dropdown = document.createElement('div');
        dropdown.id = 'tiptap-slash-menu';
        dropdown.className = 'fixed z-50 bg-white rounded-xl shadow-2xl border border-slate-200 w-80 p-2 hidden opacity-0 transition-opacity duration-100 overflow-hidden font-sans';
        dropdown.innerHTML = `
            <div class="px-2.5 py-1.5 text-[11px] font-mono font-bold text-slate-400 uppercase border-b border-slate-100 mb-1 flex justify-between items-center">
                <span>⚡ Slash Commands</span><span class="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">ESC to cancel</span>
            </div>
            <div id="slash-items-list" class="space-y-0.5 max-h-72 overflow-y-auto no-scrollbar"></div>
        `;
        document.body.appendChild(dropdown);
    }

    bindSlashMenu() {
        document.addEventListener('keydown', (e) => {
            if (!this.slashMenuOpen) {
                if (e.key === '/') {
                    // Slight delay to check if slash was added to editor
                    setTimeout(() => this.checkSlashTrigger(), 30);
                }
                return;
            }

            // If Slash menu is open, capture arrow navigation and Enter
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.selectedIndex = (this.selectedIndex + 1) % this.slashItems.length;
                this.renderSlashItems();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.selectedIndex = (this.selectedIndex - 1 + this.slashItems.length) % this.slashItems.length;
                this.renderSlashItems();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                this.executeSlashSelection(this.selectedIndex);
            } else if (e.key === 'Escape' || e.key === ' ') {
                this.closeSlashMenu();
            } else if (e.key === 'Backspace') {
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
        const textBefore = this.editor.state.doc.textBetween(Math.max(0, from - 10), from, '\n');
        
        // Check if trailing character is a slash on a clean boundary
        if (textBefore && textBefore.endsWith('/')) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            if (rect && (rect.top > 0 || rect.left > 0)) {
                this.openSlashMenu(rect.left, rect.bottom + window.scrollY + 6);
            }
        } else if (this.slashMenuOpen) {
            this.closeSlashMenu();
        }
    }

    openSlashMenu(x, y) {
        this.slashMenuOpen = true;
        this.selectedIndex = 0;
        const menu = document.getElementById('tiptap-slash-menu');
        if (!menu) return;

        menu.style.left = `${Math.min(x, window.innerWidth - 340)}px`;
        menu.style.top = `${y}px`;
        this.renderSlashItems();
        menu.classList.remove('hidden');
        setTimeout(() => menu.classList.remove('opacity-0'), 10);
    }

    closeSlashMenu() {
        this.slashMenuOpen = false;
        const menu = document.getElementById('tiptap-slash-menu');
        if (menu && !menu.classList.contains('hidden')) {
            menu.classList.add('opacity-0');
            setTimeout(() => menu.classList.add('hidden'), 100);
        }
    }

    renderSlashItems() {
        const list = document.getElementById('slash-items-list');
        if (!list) return;

        list.innerHTML = this.slashItems.map((item, index) => {
            const isSelected = index === this.selectedIndex;
            return `
                <div onclick="StudioEditor.executeSlashSelection(${index})" 
                     class="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all ${isSelected ? 'bg-slate-900 text-white shadow-sm' : 'hover:bg-slate-100 text-slate-800'}">
                    <div class="w-9 h-9 rounded-lg ${isSelected ? 'bg-slate-800 text-[#C3FF00]' : 'bg-slate-100 text-slate-700'} flex items-center justify-center shrink-0 text-xl font-bold">
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
        const item = this.slashItems[index];
        if (!item || !this.editor) return;

        // Delete the trailing '/' character from the document before applying format
        this.editor.chain().focus().deleteRange({ from: this.editor.state.selection.from - 1, to: this.editor.state.selection.from }).run();

        // Execute Tiptap command action
        item.action();
        
        this.closeSlashMenu();
        StudioToast?.show(`Applied formatting: ${item.title}`, 'info', 'Slash Engine');
    }

    // --- TITLE & SAVE DRAFT FOUNDATION ---
    bindTitleAndSave() {
        const saveBtn = document.getElementById('btn-save-draft');
        const titleInput = document.getElementById('doc-title-input');

        if (saveBtn) {
            saveBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.triggerSaveDraft();
            });
        }

        // Shortcut Ctrl+S / Cmd+S
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                e.preventDefault();
                this.triggerSaveDraft();
            }
        });

        if (titleInput) {
            titleInput.addEventListener('input', () => this.markUnsaved());
        }
    }

    markUnsaved() {
        const statusEl = document.getElementById('draft-status-badge');
        if (statusEl) {
            statusEl.className = 'px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] font-extrabold uppercase transition-colors';
            statusEl.textContent = 'Unsaved Changes';
        }
    }

    triggerSaveDraft() {
        const titleInput = document.getElementById('doc-title-input');
        const title = titleInput ? titleInput.value : 'Untitled Document';
        const html = this.editor ? this.editor.getHTML() : '';

        // Frontend persistence simulation in localStorage for prototype stability
        const payload = {
            title,
            content: html,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('bangjeje_studio_v2_draft', JSON.stringify(payload));

        const statusEl = document.getElementById('draft-status-badge');
        if (statusEl) {
            statusEl.className = 'px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-extrabold uppercase transition-colors';
            statusEl.textContent = 'Draft Saved locally';
        }

        StudioToast?.show(`Draft "${title.slice(0, 24)}..." saved securely to local foundation!`, 'success', 'Studio V2 MVP');
    }

    handleEditorUpdate() {
        this.markUnsaved();
        this.updateWordCount();
    }

    setupWordCount() {
        this.updateWordCount();
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

// Bootstrap Studio V2 MVP when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new StudioArticleEditor();
});
