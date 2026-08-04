/**
 * bangjeje.dev Studio — Vanilla Web Components & UX Engine (Phase 7B.5)
 * Pure HTML5 Custom Elements, Editorial Toast Notifications & Command Palette (Ctrl+K)
 * No React/Next.js overhead required.
 */

// 1. EDITORIAL TOAST NOTIFICATIONS ENGINE
class StudioToast {
    static init() {
        if (!document.getElementById('studio-toast-container')) {
            const container = document.createElement('div');
            container.id = 'studio-toast-container';
            container.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none transition-all';
            document.body.appendChild(container);
        }
    }

    static show(message, type = 'success', title = 'Studio Notification') {
        this.init();
        const container = document.getElementById('studio-toast-container');
        
        const toast = document.createElement('div');
        toast.className = 'pointer-events-auto p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700/80 backdrop-blur-md transform translate-y-4 opacity-0 transition-all duration-300 flex items-start gap-3.5';
        
        let iconHtml = '<i class="ph ph-check-circle text-2xl text-[#C3FF00]"></i>';
        if (type === 'error') iconHtml = '<i class="ph ph-warning-circle text-2xl text-red-500"></i>';
        if (type === 'info') iconHtml = '<i class="ph ph-info text-2xl text-blue-400"></i>';

        toast.innerHTML = `
            <div class="shrink-0 pt-0.5">${iconHtml}</div>
            <div class="flex-1">
                <div class="text-xs font-mono uppercase font-bold text-slate-400">${title}</div>
                <div class="text-sm font-semibold text-white mt-0.5">${message}</div>
            </div>
            <button class="text-slate-400 hover:text-white p-1 text-sm shrink-0 font-mono" onclick="this.parentElement.remove()">✕</button>
        `;
        
        container.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-y-4', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');
        }, 10);

        // Auto remove
        setTimeout(() => {
            if (toast && toast.parentElement) {
                toast.classList.add('translate-y-2', 'opacity-0');
                setTimeout(() => toast.remove(), 300);
            }
        }, 4500);
    }
}

// 2. COMMAND PALETTE & GLOBAL SEARCH (CTRL+K / CMD+K)
class StudioCommandPalette {
    static init() {
        if (!document.getElementById('studio-cmd-modal')) {
            const modal = document.createElement('div');
            modal.id = 'studio-cmd-modal';
            modal.className = 'fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 hidden opacity-0 transition-opacity duration-200';
            
            modal.innerHTML = `
                <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden transform scale-95 transition-transform duration-200" id="cmd-box">
                    <div class="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50/80">
                        <i class="ph ph-magnifying-glass text-2xl text-slate-400"></i>
                        <input type="text" id="cmd-input" class="bg-transparent border-none text-base font-medium text-slate-900 focus:outline-none w-full placeholder:text-slate-400" placeholder="Type to search Articles, Digital Assets, Media, or commands (e.g., 'new article')...">
                        <span class="px-2 py-1 rounded bg-slate-200 text-slate-600 font-mono text-[10px] font-bold">ESC</span>
                    </div>
                    
                    <div class="p-4 max-h-96 overflow-y-auto space-y-4 text-xs" id="cmd-results">
                        <!-- Quick Actions -->
                        <div>
                            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">⚡ Quick Actions & Navigation</div>
                            <div class="space-y-1">
                                <a href="javascript:void(0)" onclick="StudioCommandPalette.navigate('/admin/content/articles/create.html')" class="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-800 font-semibold transition-colors group">
                                    <span class="flex items-center gap-2.5"><i class="ph ph-plus-circle text-lg text-[#C3FF00] bg-slate-900 rounded-md p-1"></i> Write New Article (Zen Mode)</span>
                                    <span class="text-slate-400 font-mono text-[10px] group-hover:text-slate-900">Content Studio &rarr;</span>
                                </a>
                                <a href="javascript:void(0)" onclick="StudioCommandPalette.navigate('/admin/digital-assets/create.html')" class="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-800 font-semibold transition-colors group">
                                    <span class="flex items-center gap-2.5"><i class="ph ph-package text-lg text-[#C3FF00] bg-slate-900 rounded-md p-1"></i> Launch 3-Step Asset Packager (22+ Categories)</span>
                                    <span class="text-slate-400 font-mono text-[10px] group-hover:text-slate-900">Digital Products &rarr;</span>
                                </a>
                                <a href="javascript:void(0)" onclick="StudioCommandPalette.navigate('/admin/marketing/calendar.html')" class="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-800 font-semibold transition-colors group">
                                    <span class="flex items-center gap-2.5"><i class="ph ph-kanban text-lg text-slate-700 bg-slate-200 rounded-md p-1"></i> View Kanban Marketing Pipeline</span>
                                    <span class="text-slate-400 font-mono text-[10px] group-hover:text-slate-900">Growth &rarr;</span>
                                </a>
                            </div>
                        </div>

                        <!-- Global Search Index Sample -->
                        <div id="cmd-global-index">
                            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 mt-4">📑 Global Index (Articles, Assets, Media & Leads)</div>
                            <div class="space-y-1">
                                <a href="javascript:void(0)" onclick="StudioCommandPalette.navigate('/admin/digital-assets/edit.html')" class="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-900 font-medium transition-colors">
                                    <span class="flex items-center gap-2 font-bold"><i class="ph ph-file-zip text-emerald-600 text-lg"></i> Aura SaaS Landing Page Template <span class="text-slate-400 font-mono text-[11px] font-normal">v2.1.0</span></span>
                                    <span class="badge-tier-free text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Free Asset</span>
                                </a>
                                <a href="javascript:void(0)" onclick="StudioCommandPalette.navigate('/admin/content/articles/edit.html')" class="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-900 font-medium transition-colors">
                                    <span class="flex items-center gap-2 font-bold"><i class="ph ph-newspaper text-blue-600 text-lg"></i> Designing for Enterprise Growth <span class="text-slate-400 font-mono text-[11px] font-normal">/insights/...</span></span>
                                    <span class="text-green-600 font-mono font-extrabold text-[11px]">95/100 SEO</span>
                                </a>
                                <a href="javascript:void(0)" onclick="StudioCommandPalette.navigate('/admin/content/case-studies/edit.html')" class="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-900 font-medium transition-colors">
                                    <span class="flex items-center gap-2 font-bold"><i class="ph ph-briefcase text-purple-600 text-lg"></i> COTIT: Next-Gen Fashion Tech OS <span class="text-slate-400 font-mono text-[11px] font-normal">Enterprise Portfolio</span></span>
                                    <span class="badge-pub text-[10px] px-2 py-0.5 rounded-full font-mono uppercase font-bold">Published</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span>💡 Tip: Type 'asset', 'seo', 'leads', or 'ga4' for instant indexing</span>
                        <div class="flex gap-3"><span>↑↓ to navigate</span><span>ENTER to execute</span></div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);

            // Close listeners
            modal.addEventListener('click', (e) => {
                if (e.target === modal) StudioCommandPalette.close();
            });

            const input = document.getElementById('cmd-input');
            input.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                const indexContainer = document.getElementById('cmd-global-index');
                if (query) {
                    indexContainer.style.display = 'block';
                }
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
            setTimeout(() => modal.classList.add('hidden'), 200);
        }
    }

    static navigate(targetPath) {
        this.close();
        // Handle relative vs absolute path matching in preview environments
        const prefix = window.location.pathname.includes('/admin/') ? 
            window.location.pathname.substring(0, window.location.pathname.indexOf('/admin/')) : '';
        window.location.href = prefix + targetPath;
    }
}

// Global keyboard event listener for Ctrl+K / Cmd+K and ESC
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        StudioCommandPalette.open();
    }
    if (e.key === 'Escape') {
        StudioCommandPalette.close();
        // Also close any side drawers if open
        const drawer = document.getElementById('seo-zen-drawer');
        if (drawer) drawer.classList.add('translate-x-full');
    }
});

// 3. VANILLA WEB COMPONENT: <studio-sidebar active="dashboard">
class StudioSidebarElement extends HTMLElement {
    connectedCallback() {
        const activeItem = this.getAttribute('active') || 'dashboard';
        
        // Compute path prefix to root /admin folder
        const currPath = window.location.pathname;
        let adminRoot = '../';
        if (currPath.endsWith('/admin/dashboard.html') || currPath.endsWith('/admin/index.html') || currPath.endsWith('/admin/login.html')) {
            adminRoot = './';
        } else if (currPath.includes('/content/') || currPath.includes('/analytics/') || currPath.includes('/marketing/')) {
            adminRoot = '../../';
        }

        const nav = [
            { group: '1. Executive Hub', items: [
                { id: 'dashboard', label: 'Dashboard Overview', icon: 'ph-squares-four', href: `${adminRoot}dashboard.html` }
            ]},
            { group: '2. Content Studio', items: [
                { id: 'articles', label: 'Articles & SEO Suite', icon: 'ph-newspaper', href: `${adminRoot}content/articles/index.html` },
                { id: 'case-studies', label: 'Portfolio Case Studies', icon: 'ph-briefcase', href: `${adminRoot}content/case-studies/index.html` },
                { id: 'digital-assets', label: 'Digital Assets (22+ Types)', icon: 'ph-package', href: `${adminRoot}digital-assets/index.html` }
            ]},
            { group: '3. Growth & Marketing', items: [
                { id: 'calendar', label: 'Omnichannel Calendar', icon: 'ph-calendar-check', href: `${adminRoot}marketing/calendar.html` },
                { id: 'composer', label: 'Social Composer & Linker', icon: 'ph-share-network', href: `${adminRoot}marketing/composer.html` }
            ]},
            { group: '4. Vault & Taxonomy', items: [
                { id: 'media-library', label: 'Media Library Vault', icon: 'ph-folder-open', href: `${adminRoot}media-library/index.html` },
                { id: 'organization', label: 'Taxonomy (Categories)', icon: 'ph-tag', href: `${adminRoot}organization/index.html` }
            ]},
            { group: '5. Intelligence & Config', items: [
                { id: 'downloads', label: 'Download Analytics', icon: 'ph-chart-line-up', href: `${adminRoot}analytics/downloads.html` },
                { id: 'leads', label: 'Lead CRM Manager', icon: 'ph-users', href: `${adminRoot}analytics/leads.html` },
                { id: 'settings', label: 'Website Configuration', icon: 'ph-gear-six', href: `${adminRoot}settings/index.html` }
            ]}
        ];

        let navHtml = '';
        nav.forEach(section => {
            navHtml += `<div class="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2 first:mt-0">${section.group}</div>`;
            section.items.forEach(item => {
                const isActive = item.id === activeItem ? 'active font-bold' : 'font-medium text-slate-600';
                navHtml += `
                    <a href="${item.href}" class="studio-nav-item ${isActive} flex items-center gap-3 px-3 py-2.2 rounded-xl text-xs sm:text-sm my-0.5 transition-colors">
                        <i class="ph ${item.icon} text-lg shrink-0"></i> <span>${item.label}</span>
                    </a>
                `;
            });
        });

        this.innerHTML = `
            <aside id="studio-sidebar" class="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 flex flex-col justify-between shadow-sm">
                <div class="flex-1 overflow-y-auto no-scrollbar">
                    <div class="h-20 flex items-center px-6 border-b border-slate-200/80 sticky top-0 bg-white z-10">
                        <a href="${adminRoot}dashboard.html" class="text-lg font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
                            <div class="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center shadow">
                                <div class="w-2 h-2 bg-[#C3FF00] rounded-full"></div>
                            </div>
                            bangjeje<span class="text-slate-400 font-normal">.dev</span> Studio
                        </a>
                    </div>
                    <nav class="p-3 space-y-0.5">${navHtml}</nav>
                </div>
                
                <div class="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow">JJ</div>
                        <div>
                            <div class="text-sm font-semibold text-slate-900">Jajang</div>
                            <div class="text-[10px] text-slate-500 font-mono uppercase font-bold">Executive Owner</div>
                        </div>
                    </div>
                    <a href="${adminRoot}login.html" title="Sign Out" class="text-slate-400 hover:text-red-600 p-2 transition-colors"><i class="ph ph-sign-out text-lg"></i></a>
                </div>
            </aside>
        `;

        // Attach sidebar toggle listener if mobile menu exists
        setTimeout(() => {
            const toggle = document.getElementById('sidebar-toggle');
            const aside = this.querySelector('aside');
            if (toggle && aside) {
                toggle.addEventListener('click', () => aside.classList.toggle('-translate-x-full'));
            }
        }, 50);
    }
}
customElements.define('studio-sidebar', StudioSidebarElement);

// 4. BULK ACTIONS TABLE HELPER
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

        rowCheckboxes.forEach(cb => {
            cb.addEventListener('change', updateToolbar);
        });
    }

    static batchAction(actionName) {
        let count = 0;
        document.querySelectorAll('.studio-row-checkbox:checked').forEach(cb => count++);
        if (count === 0) return;
        
        StudioToast.show(`Successfully performed "${actionName}" on ${count} selected items.`, 'success', 'Bulk Action Executed');
        
        // Clear selection
        document.querySelectorAll('.studio-row-checkbox').forEach(cb => cb.checked = false);
        const selectAll = document.getElementById('table-select-all');
        if (selectAll) selectAll.checked = false;
        const toolbar = document.getElementById('bulk-action-toolbar');
        if (toolbar) toolbar.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
    }
}

// Initialize components when DOM is content loaded
document.addEventListener('DOMContentLoaded', () => {
    StudioToast.init();
    StudioCommandPalette.init();
    StudioTableManager.init();

    // Attach Ctrl+K trigger button to search boxes if present
    const globalSearchTrigger = document.getElementById('trigger-cmd-palette');
    if (globalSearchTrigger) {
        globalSearchTrigger.addEventListener('click', () => StudioCommandPalette.open());
    }
});
