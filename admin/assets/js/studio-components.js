/**
 * bangjeje.dev Studio — Vanilla Web Components & UX Engine (TailAdmin Enterprise Edition)
 * Pure HTML5 Custom Elements, Universal Header (+ New Dropdown), Editorial Toast Notifications & Command Palette (Ctrl+K).
 */

// 1. EDITORIAL TOAST NOTIFICATIONS ENGINE
class StudioToast {
    static init() {
        if (!document.getElementById('studio-toast-container')) {
            const container = document.createElement('div');
            container.id = 'studio-toast-container';
            container.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none transition-all';
            document.body.appendChild(container);
        }
    }

    static show(message, type = 'success', title = 'System Notification') {
        this.init();
        const container = document.getElementById('studio-toast-container');
        
        const toast = document.createElement('div');
        toast.className = 'pointer-events-auto p-4 rounded-xl bg-slate-900 text-white shadow-xl border border-slate-700 transform translate-y-3 opacity-0 transition-all duration-200 flex items-start gap-3';
        
        let iconHtml = '<i class="ph ph-check-circle text-xl text-[#C3FF00]"></i>';
        if (type === 'error') iconHtml = '<i class="ph ph-warning-circle text-xl text-red-500"></i>';
        if (type === 'info') iconHtml = '<i class="ph ph-info text-xl text-blue-400"></i>';

        toast.innerHTML = `
            <div class="shrink-0 pt-0.5">${iconHtml}</div>
            <div class="flex-1">
                <div class="text-[11px] font-mono uppercase font-bold text-slate-400 tracking-wider">${title}</div>
                <div class="text-xs font-semibold text-white mt-0.5">${message}</div>
            </div>
            <button class="text-slate-400 hover:text-white p-1 text-sm shrink-0 font-mono" onclick="this.parentElement.remove()">✕</button>
        `;
        
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.remove('translate-y-3', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');
        }, 10);

        setTimeout(() => {
            if (toast && toast.parentElement) {
                toast.classList.add('translate-y-2', 'opacity-0');
                setTimeout(() => toast.remove(), 250);
            }
        }, 4000);
    }
}

// 2. COMMAND PALETTE & GLOBAL SEARCH (CTRL+K / CMD+K)
class StudioCommandPalette {
    static init() {
        if (!document.getElementById('studio-cmd-modal')) {
            const modal = document.createElement('div');
            modal.id = 'studio-cmd-modal';
            modal.className = 'fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4 hidden opacity-0 transition-opacity duration-150';
            
            modal.innerHTML = `
                <div class="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden transform scale-95 transition-transform duration-150" id="cmd-box">
                    <div class="p-3.5 border-b border-slate-200 flex items-center gap-3 bg-slate-50/70">
                        <i class="ph ph-magnifying-glass text-xl text-slate-400"></i>
                        <input type="text" id="cmd-input" class="bg-transparent border-none text-sm font-semibold text-slate-900 focus:outline-none w-full placeholder:text-slate-400" placeholder="Search operational catalog, digital assets, or execute command...">
                        <span class="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px] font-bold">ESC</span>
                    </div>
                    
                    <div class="p-3.5 max-h-80 overflow-y-auto space-y-3 text-xs" id="cmd-results">
                        <div>
                            <div class="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">⚡ Instant Creation & Actions</div>
                            <div class="space-y-0.5">
                                <a href="javascript:void(0)" onclick="StudioCommandPalette.navigate('/admin/content/articles/create.html')" class="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 text-slate-800 font-semibold transition-colors">
                                    <span class="flex items-center gap-2.5"><i class="ph ph-feather text-base text-blue-600"></i> Write New Article (Zen Mode)</span>
                                    <span class="text-slate-400 font-mono text-[10px]">Content &rarr;</span>
                                </a>
                                <a href="javascript:void(0)" onclick="StudioCommandPalette.navigate('/admin/digital-assets/create.html')" class="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 text-slate-800 font-semibold transition-colors">
                                    <span class="flex items-center gap-2.5"><i class="ph ph-package text-base text-emerald-600"></i> Launch 3-Step Asset Packager (22+ Types)</span>
                                    <span class="text-slate-400 font-mono text-[10px]">Content &rarr;</span>
                                </a>
                                <a href="javascript:void(0)" onclick="StudioCommandPalette.navigate('/admin/content/case-studies/create.html')" class="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 text-slate-800 font-semibold transition-colors">
                                    <span class="flex items-center gap-2.5"><i class="ph ph-briefcase text-base text-purple-600"></i> Architect New Case Study</span>
                                    <span class="text-slate-400 font-mono text-[10px]">Content &rarr;</span>
                                </a>
                                <a href="javascript:void(0)" onclick="StudioCommandPalette.navigate('/admin/organization/index.html')" class="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 text-slate-800 font-semibold transition-colors">
                                    <span class="flex items-center gap-2.5"><i class="ph ph-tag text-base text-pink-600"></i> Manage Categories & Global Tags</span>
                                    <span class="text-slate-400 font-mono text-[10px]">Content &rarr;</span>
                                </a>
                                <!-- Marketing Module Inactive for Beta (Reserved for future release) -->
                            </div>
                        </div>

                        <div id="cmd-global-index">
                            <div class="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 mt-3">📑 Catalog Repository Index</div>
                            <div class="space-y-0.5">
                                <a href="javascript:void(0)" onclick="StudioCommandPalette.navigate('/admin/analytics/downloads.html')" class="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 text-slate-800 font-medium">
                                    <span class="flex items-center gap-2 font-bold"><i class="ph ph-chart-line-up text-emerald-600 text-base"></i> Performance & SEO Vitals Monitor</span>
                                    <span class="text-slate-500 font-mono text-[11px]">Analytics</span>
                                </a>
                                <a href="javascript:void(0)" onclick="StudioCommandPalette.navigate('/admin/analytics/leads.html')" class="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 text-slate-800 font-medium">
                                    <span class="flex items-center gap-2 font-bold"><i class="ph ph-users text-blue-600 text-base"></i> CRM Leads & Contact Pipeline</span>
                                    <span class="text-slate-500 font-mono text-[11px]">CRM</span>
                                </a>
                                <a href="javascript:void(0)" onclick="StudioCommandPalette.navigate('/admin/digital-assets/edit.html')" class="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 text-slate-800 font-medium">
                                    <span class="flex items-center gap-2 font-bold"><i class="ph ph-file-zip text-emerald-600 text-base"></i> Aura SaaS Landing Page Template <span class="text-slate-400 font-mono text-[11px] font-normal">v2.1.0</span></span>
                                    <span class="badge-tier-free text-[10px] px-2 py-0.5 rounded uppercase font-bold">Free Asset</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span>💡 Tip: Type 'new', 'asset', or 'leads' for instant commands</span>
                        <div class="flex gap-3"><span>↑↓ navigate</span><span>ENTER execute</span></div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            modal.addEventListener('click', (e) => { if (e.target === modal) StudioCommandPalette.close(); });

            const input = document.getElementById('cmd-input');
            input.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                const indexContainer = document.getElementById('cmd-global-index');
                if (query) indexContainer.style.display = 'block';
            });
        }
    }

    static open() {
        this.init();
        const modal = document.getElementById('studio-cmd-modal');
        const box = document.getElementById('cmd-box');
        const input = document.getElementById('cmd-input');
        
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            box.classList.remove('scale-95');
            input.focus();
        }, 10);
    }

    static close() {
        const modal = document.getElementById('studio-cmd-modal');
        const box = document.getElementById('cmd-box');
        if (modal && !modal.classList.contains('hidden')) {
            modal.classList.add('opacity-0');
            box.classList.add('scale-95');
            setTimeout(() => modal.classList.add('hidden'), 150);
        }
    }

    static navigate(targetPath) {
        this.close();
        const prefix = window.location.pathname.includes('/admin/') ? 
            window.location.pathname.substring(0, window.location.pathname.indexOf('/admin/')) : '';
        window.location.href = prefix + targetPath;
    }
}

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        StudioCommandPalette.open();
    }
    if (e.key === 'Escape') {
        StudioCommandPalette.close();
        const drawer = document.getElementById('seo-zen-drawer');
        if (drawer) drawer.classList.add('translate-x-full');
        const dropdown = document.getElementById('universal-new-dropdown-menu');
        if (dropdown) dropdown.classList.add('hidden');
    }
});

// 3. STREAMLINED PERMANENT TAILADMIN SIDEBAR COMPONENT (Cohesive OS Architecture)
class StudioSidebarElement extends HTMLElement {
    connectedCallback() {
        const activeItem = this.getAttribute('active') || 'dashboard';
        
        const currPath = window.location.pathname.replace(/\\/g, '/');
        let adminRoot = '../';
        if (currPath.endsWith('/admin/dashboard.html') || currPath.endsWith('/admin/index.html') || currPath.endsWith('/admin/login.html')) {
            adminRoot = './';
        } else if (currPath.includes('/content/articles') || currPath.includes('/content/case-studies') || currPath.includes('/content/documentation')) {
            adminRoot = '../../';
        } else {
            adminRoot = '../';
        }

        const groups = [
            {
                heading: 'OVERVIEW',
                items: [
                    { id: 'dashboard', label: 'Dashboard Overview', icon: 'ph-squares-four', href: `${adminRoot}dashboard.html` }
                ]
            },
            {
                heading: 'CONTENT',
                items: [
                    { id: 'articles', label: 'Articles & Insights', icon: 'ph-newspaper', href: `${adminRoot}content/articles/index.html`, badge: '24' },
                    { id: 'case-studies', label: 'Case Studies', icon: 'ph-briefcase', href: `${adminRoot}content/case-studies/index.html`, badge: '3' },
                    { id: 'digital-assets', label: 'Digital Assets & Portfolio', icon: 'ph-package', href: `${adminRoot}digital-assets/index.html`, badge: '22+ Types' },
                    { id: 'taxonomy', label: 'Categories & Tags', icon: 'ph-tag', href: `${adminRoot}organization/index.html` }
                ]
            },
            {
                heading: 'MEDIA',
                items: [
                    { id: 'media-library', label: 'Media Library', icon: 'ph-folder-open', href: `${adminRoot}media-library/index.html` }
                ]
            },
            {
                heading: 'ANALYTICS',
                items: [
                    { id: 'analytics', label: 'Performance & SEO Vitals', icon: 'ph-chart-line-up', href: `${adminRoot}analytics/downloads.html` }
                ]
            },
            {
                heading: 'CRM',
                items: [
                    { id: 'crm', label: 'Leads, Contacts & Pipeline', icon: 'ph-users', href: `${adminRoot}analytics/leads.html` }
                ]
            },
            /* Marketing module hidden during Beta phase (Reserved for future release) */
            {
                heading: 'SYSTEM',
                items: [
                    { id: 'settings', label: 'Website Settings', icon: 'ph-gear-six', href: `${adminRoot}settings/index.html` }
                ]
            }
        ];

        let navHtml = '';
        groups.forEach((group, idx) => {
            if (group.heading !== 'OVERVIEW') {
                navHtml += `<div class="px-3.5 pt-3.5 pb-1 text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider">${group.heading}</div>`;
            }
            group.items.forEach(item => {
                const isActive = item.id === activeItem ? 
                    'bg-slate-900 text-white font-bold shadow-xs' : 
                    'text-slate-600 hover:bg-slate-100 font-semibold';
                const badgeHtml = item.badge ? `<span class="ml-auto text-[10px] font-mono px-2 py-0.5 rounded ${item.id === activeItem ? 'bg-slate-800 text-[#C3FF00]' : 'bg-slate-200 text-slate-700'} font-bold">${item.badge}</span>` : '';

                navHtml += `
                    <a href="${item.href}" class="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs sm:text-sm my-0.5 transition-all ${isActive}">
                        <i class="ph ${item.icon} text-lg shrink-0 ${item.id === activeItem ? 'text-[#C3FF00]' : 'text-slate-500'}"></i> 
                        <span class="truncate">${item.label}</span>
                        ${badgeHtml}
                    </a>
                `;
            });
        });

        this.innerHTML = `
            <aside id="studio-sidebar" class="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform -translate-x-full lg:translate-x-0 transition-transform duration-200 flex flex-col justify-between shadow-xs">
                <div class="flex-1 overflow-y-auto no-scrollbar">
                    <div class="h-16 flex items-center px-6 border-b border-slate-200 sticky top-0 bg-white z-10">
                        <a href="${adminRoot}dashboard.html" class="text-base font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
                            <div class="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center shadow">
                                <div class="w-2 h-2 bg-[#C3FF00] rounded-full"></div>
                            </div>
                            bangjeje<span class="text-slate-400 font-normal">.dev</span> Studio
                        </a>
                    </div>
                    <nav class="p-3.5 space-y-1">${navHtml}</nav>
                </div>
                
                <div class="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-slate-900 text-[#C3FF00] font-mono font-extrabold flex items-center justify-center text-xs shadow-xs">JJ</div>
                        <div class="truncate">
                            <div class="text-xs font-bold text-slate-900">Jajang</div>
                            <div class="text-[10px] text-slate-500 font-mono uppercase font-bold">Executive Owner</div>
                        </div>
                    </div>
                    <a href="${adminRoot}login.html" title="Sign Out" class="text-slate-400 hover:text-red-600 p-2 transition-colors"><i class="ph ph-sign-out text-base"></i></a>
                </div>
            </aside>
        `;

        setTimeout(() => {
            const toggle = document.getElementById('sidebar-toggle');
            const aside = this.querySelector('aside');
            if (toggle && aside) toggle.addEventListener('click', () => aside.classList.toggle('-translate-x-full'));
        }, 30);
    }
}
customElements.define('studio-sidebar', StudioSidebarElement);

// 4. UNIVERSAL HEADER COMPONENT (+ NEW DROPDOWN & BREADCRUMBS)
class StudioHeaderElement extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute('title') || 'Overview';
        const breadcrumb = this.getAttribute('breadcrumb') || 'Executive Hub';
        const hideActions = this.getAttribute('hide-actions') === 'true';

        const currPath = window.location.pathname.replace(/\\/g, '/');
        let adminRoot = '../';
        if (currPath.endsWith('/admin/dashboard.html') || currPath.endsWith('/admin/index.html') || currPath.endsWith('/admin/login.html')) {
            adminRoot = './';
        } else if (currPath.includes('/content/articles') || currPath.includes('/content/case-studies') || currPath.includes('/content/documentation')) {
            adminRoot = '../../';
        } else {
            adminRoot = '../';
        }

        const actionsHtml = hideActions ? '' : `
            <div class="relative inline-block text-left" id="new-dropdown-container">
                <button type="button" onclick="const menu = document.getElementById('universal-new-dropdown-menu'); menu.classList.toggle('hidden');" class="btn-studio-primary px-4 py-2 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 bg-[#C3FF00] text-slate-900 rounded-lg hover:bg-[#b8f000] shadow-xs transition-colors">
                    <i class="ph ph-plus-circle text-base"></i>
                    <span>New</span>
                    <i class="ph ph-caret-down text-xs ml-0.5"></i>
                </button>
                
                <div id="universal-new-dropdown-menu" class="hidden absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-slate-200 focus:outline-none z-50 p-2 space-y-1 text-xs font-semibold text-slate-700">
                    <a href="${adminRoot}content/articles/create.html" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"><i class="ph ph-feather text-blue-600 text-base"></i> New Article (Zen Writer)</a>
                    <a href="${adminRoot}content/case-studies/create.html" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"><i class="ph ph-briefcase text-purple-600 text-base"></i> New Case Study</a>
                    <a href="${adminRoot}digital-assets/create.html" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"><i class="ph ph-package text-emerald-600 text-base"></i> New Digital Asset (3-Step)</a>
                    <!-- Marketing Campaign option reserved for future release -->
                </div>
            </div>
        `;

        this.innerHTML = `
            <header class="h-16 bg-white border-b border-slate-200 px-6 sticky top-0 z-30 flex items-center justify-between shadow-xs">
                <div class="flex items-center gap-3.5">
                    <button id="sidebar-toggle" class="lg:hidden text-slate-500 hover:text-slate-900 text-xl p-1" aria-label="Toggle Navigation"><i class="ph ph-list"></i></button>
                    <div class="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
                        <span class="hover:text-slate-800 transition-colors hidden sm:inline">${breadcrumb}</span>
                        <span class="hidden sm:inline">/</span>
                        <span class="text-slate-900 font-bold">${title}</span>
                    </div>
                </div>
                
                <div class="flex items-center gap-3">
                    <button onclick="StudioCommandPalette.open()" title="Global Command Palette (Ctrl+K)" class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors border border-slate-200/60">
                        <i class="ph ph-magnifying-glass text-slate-500 text-sm"></i>
                        <span class="hidden md:inline">Command Palette...</span>
                        <kbd class="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded shadow-2xs text-slate-500 font-extrabold ml-1">Ctrl+K</kbd>
                    </button>
                    ${actionsHtml}
                </div>
            </header>
        `;

        // Close dropdown when clicking outside
        setTimeout(() => {
            document.addEventListener('click', (e) => {
                const cont = this.querySelector('#new-dropdown-container');
                const menu = this.querySelector('#universal-new-dropdown-menu');
                if (cont && menu && !cont.contains(e.target)) {
                    menu.classList.add('hidden');
                }
            });
        }, 50);
    }
}
customElements.define('studio-header', StudioHeaderElement);

// 5. BULK ACTIONS TABLE HELPER
class StudioTableManager {
    static init() {
        const selectAll = document.getElementById('table-select-all');
        const rowCheckboxes = document.querySelectorAll('.studio-row-checkbox');
        const toolbar = document.getElementById('bulk-action-toolbar');
        const countSpan = document.getElementById('bulk-selected-count');

        if (!toolbar || rowCheckboxes.length === 0) return;

        const updateToolbar = () => {
            let count = 0;
            rowCheckboxes.forEach(cb => { if (cb.checked) count++; });
            if (count > 0) {
                toolbar.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
                if (countSpan) countSpan.textContent = `${count} ${count === 1 ? 'item' : 'items'} selected`;
            } else {
                toolbar.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
            }
            if (selectAll) selectAll.checked = (count === rowCheckboxes.length);
        };

        if (selectAll) {
            selectAll.addEventListener('change', (e) => {
                rowCheckboxes.forEach(cb => cb.checked = e.target.checked);
                updateToolbar();
            });
        }

        rowCheckboxes.forEach(cb => cb.addEventListener('change', updateToolbar));
    }

    static batchAction(actionName) {
        let count = 0;
        document.querySelectorAll('.studio-row-checkbox:checked').forEach(cb => count++);
        if (count === 0) return;
        
        StudioToast.show(`Successfully executed "${actionName}" on ${count} items.`, 'success', 'Bulk Action');
        document.querySelectorAll('.studio-row-checkbox').forEach(cb => cb.checked = false);
        const selectAll = document.getElementById('table-select-all');
        if (selectAll) selectAll.checked = false;
        const toolbar = document.getElementById('bulk-action-toolbar');
        if (toolbar) toolbar.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    StudioToast.init();
    StudioCommandPalette.init();
    StudioTableManager.init();
});
