/**
 * bangjeje.dev Studio V2 — Reusable Media Library & Cloudflare R2 Engine
 * Single source of truth for media across Articles, Case Studies, Digital Assets, and Profiles.
 * Pure Vanilla JavaScript Web Component & DOM Engine.
 */

class StudioMediaLibraryEngine {
    constructor() {
        this.storageKey = 'bangjeje_studio_v2_media_vault';
        this.assets = [];
        this.activeView = 'grid'; // 'grid' | 'list'
        this.activeTab = 'all'; // 'all' | 'recent_upload' | 'recent_used' | 'r2_vault'
        this.searchQuery = '';
        this.selectedId = null;
        this.onSelectCallback = null;
        this.isOpen = false;

        this.init();
    }

    init() {
        this.loadVaultState();
        this.injectModalDOM();
        this.bindGlobalEvents();
        window.StudioMediaLibrary = this;
    }

    loadVaultState() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            try {
                this.assets = JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse Media Vault state:', e);
            }
        }

        // Initialize with default high-quality bangjeje.dev starter assets if empty
        if (!this.assets || this.assets.length === 0) {
            const now = new Date();
            this.assets = [
                {
                    id: 'asset-r2-001',
                    filename: 'COTIT_Enterprise_Hero_V2.webp',
                    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1440&q=80',
                    r2CdnUrl: 'https://cdn.bangjeje.dev/vault/COTIT_Enterprise_Hero_V2.webp',
                    alt: 'COTIT Enterprise ERP Supply Chain Dashboard Preview on MacBook',
                    caption: 'Figure 1.1: COTIT Real-Time Factory Floor Telemetry & Edge Logistics Hub',
                    size: '284 KB',
                    resolution: '1920 x 1080 px',
                    format: 'WebP (Cloudflare R2 Edge)',
                    uploadedAt: new Date(now - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
                    recentlyUploaded: true,
                    recentlyUsed: true
                },
                {
                    id: 'asset-r2-002',
                    filename: 'AgriTech_IoT_Sensor_Matrix.webp',
                    url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1440&q=80',
                    r2CdnUrl: 'https://cdn.bangjeje.dev/vault/AgriTech_IoT_Sensor_Matrix.webp',
                    alt: 'AgriTech automated irrigation and soil moisture real time analysis chart',
                    caption: 'AgriTech IoT node distribution map across Java farming infrastructure',
                    size: '196 KB',
                    resolution: '1440 x 900 px',
                    format: 'WebP (Cloudflare R2 Edge)',
                    uploadedAt: new Date(now - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
                    recentlyUploaded: true,
                    recentlyUsed: false
                },
                {
                    id: 'asset-r2-003',
                    filename: 'Aura_SaaS_UI_Kit_Starter.webp',
                    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1440&q=80',
                    r2CdnUrl: 'https://cdn.bangjeje.dev/vault/Aura_SaaS_UI_Kit_Starter.webp',
                    alt: 'Aura SaaS Design System component library with dark mode toggle cards',
                    caption: 'Aura UI Kit: TailAdmin token architecture and atomic component matrix',
                    size: '310 KB',
                    resolution: '1600 x 1200 px',
                    format: 'WebP (Cloudflare R2 Edge)',
                    uploadedAt: new Date(now - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
                    recentlyUploaded: false,
                    recentlyUsed: true
                },
                {
                    id: 'asset-r2-004',
                    filename: 'Bangjeje_Author_Executive_Avatar.webp',
                    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
                    r2CdnUrl: 'https://cdn.bangjeje.dev/profiles/Bangjeje_Avatar.webp',
                    alt: 'Verified Executive Developer Profile Portrait of bangjeje.dev Founder',
                    caption: 'Principal Architect & Full-Stack Systems Specialist',
                    size: '98 KB',
                    resolution: '800 x 800 px (1:1 Square)',
                    format: 'WebP (Cloudflare R2 Edge)',
                    uploadedAt: new Date(now - 1000 * 60 * 60 * 120).toISOString(),
                    recentlyUploaded: false,
                    recentlyUsed: false
                },
                {
                    id: 'asset-r2-005',
                    filename: 'Cloudflare_Workers_Edge_Topology.webp',
                    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1440&q=80',
                    r2CdnUrl: 'https://cdn.bangjeje.dev/architecture/Cloudflare_Workers_Edge.webp',
                    alt: 'Global distributed edge networking topology diagram with ultra-low latency nodes',
                    caption: 'Zero-Latency CDN Distribution architecture over Cloudflare Workers & R2 Storage',
                    size: '220 KB',
                    resolution: '1920 x 1080 px',
                    format: 'WebP (Cloudflare R2 Edge)',
                    uploadedAt: new Date(now - 1000 * 60 * 30).toISOString(), // 30 mins ago
                    recentlyUploaded: true,
                    recentlyUsed: true
                }
            ];
            this.saveState();
        }

        if (this.assets.length > 0 && !this.selectedId) {
            this.selectedId = this.assets[0].id;
        }
    }

    saveState() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.assets));
    }

    // --- MODAL INJECTION & ARCHITECTURE ---
    injectModalDOM() {
        if (document.getElementById('studio-media-library-modal')) return;

        const overlay = document.createElement('div');
        overlay.id = 'studio-media-library-modal';
        overlay.className = 'fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-10 hidden opacity-0 transition-opacity duration-150 font-["Outfit"] text-slate-900';
        overlay.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-6xl h-[85vh] max-h-[820px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                
                <!-- TOP HEADER: TITLE, SEARCH, VIEW & R2 UPLOAD -->
                <header class="h-16 border-b border-slate-200 px-6 flex items-center justify-between bg-slate-50/70 shrink-0">
                    <div class="flex items-center gap-3">
                        <span class="w-10 h-10 rounded-xl bg-slate-900 text-[#C3FF00] flex items-center justify-center text-xl font-bold shadow-md">
                            <i class="ph ph-images-square text-2xl"></i>
                        </span>
                        <div>
                            <h2 class="text-base font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
                                Studio V2 Media Library
                                <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-black uppercase">Cloudflare R2 Active ⚡</span>
                            </h2>
                            <p class="text-xs font-semibold text-slate-400">Single source of truth for Articles, Case Studies & Digital Assets</p>
                        </div>
                    </div>

                    <div class="flex items-center gap-3">
                        <!-- Upload File Input Hidden & Action Button -->
                        <input type="file" id="media-r2-upload-input" accept="image/*,video/*,.pdf,.zip" class="hidden" multiple>
                        <button id="btn-trigger-r2-upload" class="h-10 px-5 rounded-xl bg-slate-900 text-[#C3FF00] hover:bg-slate-800 hover:text-white font-extrabold text-xs tracking-wider uppercase shadow-md transition-all flex items-center gap-2 cursor-pointer">
                            <i class="ph ph-cloud-arrow-up text-lg font-bold"></i> <span>Upload to R2 Vault</span>
                        </button>
                        
                        <button id="btn-close-media-library" class="w-9 h-9 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center justify-center text-xl font-bold cursor-pointer" title="Close Vault (ESC)">
                            <i class="ph ph-x"></i>
                        </button>
                    </div>
                </header>

                <!-- MIDDLE TOOLBAR: TABS, SEARCH & GRID/LIST TOGGLE -->
                <div class="h-12 border-b border-slate-200 px-6 flex items-center justify-between bg-white shrink-0">
                    <!-- Filter Tabs -->
                    <div class="flex items-center gap-1 overflow-x-auto no-scrollbar">
                        <button onclick="StudioMediaLibrary.setTab('all')" id="tab-media-all" class="media-tab-btn px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all bg-slate-900 text-[#C3FF00]">All Media</button>
                        <button onclick="StudioMediaLibrary.setTab('recent_upload')" id="tab-media-recent_upload" class="media-tab-btn px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all">Recently Uploaded 🚀</button>
                        <button onclick="StudioMediaLibrary.setTab('recent_used')" id="tab-media-recent_used" class="media-tab-btn px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all">Recently Used 🕒</button>
                        <button onclick="StudioMediaLibrary.setTab('r2_vault')" id="tab-media-r2_vault" class="media-tab-btn px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all">Cloudflare R2 Edge ⚡</button>
                    </div>

                    <!-- Search Input & Grid/List View Controls -->
                    <div class="flex items-center gap-3 shrink-0">
                        <div class="relative w-64">
                            <i class="ph ph-magnifying-glass absolute left-3 top-2 text-slate-400 text-sm"></i>
                            <input type="text" id="media-search-input" placeholder="Search filename, alt, caption..." class="w-full h-8 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 focus:bg-white transition-all">
                        </div>

                        <div class="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
                            <button onclick="StudioMediaLibrary.setView('grid')" id="view-toggle-grid" class="w-7 h-7 rounded-md bg-white shadow-2xs text-slate-900 font-bold flex items-center justify-center text-sm transition-all" title="Grid View"><i class="ph ph-squares-four font-bold"></i></button>
                            <button onclick="StudioMediaLibrary.setView('list')" id="view-toggle-list" class="w-7 h-7 rounded-md text-slate-500 hover:text-slate-900 flex items-center justify-center text-sm transition-all" title="List View"><i class="ph ph-list-dashes font-bold"></i></button>
                        </div>
                    </div>
                </div>

                <!-- MAIN WORKSPACE: 2-COLUMN (VIEWPORT CANVAS + REAL-TIME INSPECTOR) -->
                <div class="flex-1 flex overflow-hidden bg-slate-50/40">
                    
                    <!-- LEFT/CENTER: MEDIA ASSET GALLERY -->
                    <div id="media-gallery-container" class="flex-1 overflow-y-auto p-6 no-scrollbar relative">
                        <!-- Dynamically injected grid or list cards -->
                    </div>

                    <!-- RIGHT: REAL-TIME ASSET INSPECTOR & METADATA VAULT (w-80 / 340px) -->
                    <aside id="media-inspector-pane" class="w-80 xl:w-[360px] border-l border-slate-200 bg-white flex flex-col justify-between overflow-y-auto shrink-0 no-scrollbar">
                        <!-- Inspector dynamically populated when an item is selected -->
                    </aside>

                </div>

                <!-- FOOTER: DROP-ZONE ADVICE & EXECUTION BUTTON -->
                <footer class="h-14 border-t border-slate-200 px-6 flex items-center justify-between bg-slate-50/90 shrink-0">
                    <div class="flex items-center gap-2 text-xs font-medium text-slate-500 font-mono">
                        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>Drag & Drop files anywhere into the vault to trigger instant Cloudflare R2 compression.</span>
                    </div>

                    <div class="flex items-center gap-3">
                        <button onclick="StudioMediaLibrary.close()" class="h-9 px-4 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-200/60 transition-colors">Cancel</button>
                        <button onclick="StudioMediaLibrary.confirmSelection()" id="btn-confirm-insert-media" class="h-10 px-6 rounded-xl bg-slate-900 text-[#C3FF00] hover:bg-slate-800 hover:text-white font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                            <i class="ph ph-check-circle text-base"></i> <span>Insert into Article</span>
                        </button>
                    </div>
                </footer>

            </div>
        </div>
        `;

        document.body.appendChild(overlay);
        this.bindModalListeners();
    }

    bindGlobalEvents() {
        // Drag & Drop anywhere inside modal to upload to R2
        const modal = document.getElementById('studio-media-library-modal');
        if (!modal) return;

        ['dragenter', 'dragover'].forEach(eventName => {
            modal.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            modal.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (eventName === 'drop' && e.dataTransfer.files.length > 0) {
                    this.handleR2FileUpload(e.dataTransfer.files);
                }
            });
        });
    }

    bindModalListeners() {
        const closeBtn = document.getElementById('btn-close-media-library');
        const uploadTrigger = document.getElementById('btn-trigger-r2-upload');
        const fileInput = document.getElementById('media-r2-upload-input');
        const searchInput = document.getElementById('media-search-input');

        if (closeBtn) closeBtn.addEventListener('click', () => this.close());
        
        if (uploadTrigger && fileInput) {
            uploadTrigger.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleR2FileUpload(e.target.files);
                    fileInput.value = ''; // Reset input
                }
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                this.renderGallery();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (this.isOpen && e.key === 'Escape') this.close();
        });
    }

    // --- UPLOAD PIPELINE (CLOUDFLARE R2 SIMULATION) ---
    handleR2FileUpload(fileList) {
        const files = Array.from(fileList);
        let count = 0;

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const now = new Date();
                const cleanName = file.name.replace(/\.[^/.]+$/, "") + "_r2.webp";
                const newAsset = {
                    id: `asset-r2-${Date.now()}-${Math.floor(Math.random()*1000)}`,
                    filename: cleanName,
                    url: e.target.result, // Local Blob/Base64 simulated edge proxy
                    r2CdnUrl: `https://cdn.bangjeje.dev/vault/${cleanName}`,
                    alt: file.name.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, ""),
                    caption: `Uploaded asset: ${cleanName}`,
                    size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
                    resolution: '1600 x 1200 px (Compressed)',
                    format: 'WebP (Cloudflare R2 Edge)',
                    uploadedAt: now.toISOString(),
                    recentlyUploaded: true,
                    recentlyUsed: false
                };

                this.assets.unshift(newAsset);
                this.selectedId = newAsset.id;
                count++;

                if (count === files.length) {
                    this.saveState();
                    this.setTab('recent_upload');
                    this.renderGallery();
                    this.renderInspector();
                    StudioToast?.show(`Successfully uploaded ${count} file(s) directly to Cloudflare R2 Edge Vault!`, 'success', 'Studio V2 Media');
                }
            };
            reader.readAsDataURL(file);
        });
    }

    // --- VIEW & TAB RENDERING ---
    setTab(tab) {
        this.activeTab = tab;
        document.querySelectorAll('.media-tab-btn').forEach(btn => {
            btn.className = 'media-tab-btn px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer';
        });
        const activeBtn = document.getElementById(`tab-media-${tab}`);
        if (activeBtn) activeBtn.className = 'media-tab-btn px-3 py-1.5 rounded-lg text-xs font-extrabold bg-slate-900 text-[#C3FF00] shadow-2xs cursor-pointer';
        this.renderGallery();
    }

    setView(view) {
        this.activeView = view;
        const gridBtn = document.getElementById('view-toggle-grid');
        const listBtn = document.getElementById('view-toggle-list');
        if (gridBtn && listBtn) {
            if (view === 'grid') {
                gridBtn.className = 'w-7 h-7 rounded-md bg-white shadow-2xs text-slate-900 font-bold flex items-center justify-center text-sm transition-all';
                listBtn.className = 'w-7 h-7 rounded-md text-slate-500 hover:text-slate-900 flex items-center justify-center text-sm transition-all';
            } else {
                listBtn.className = 'w-7 h-7 rounded-md bg-white shadow-2xs text-slate-900 font-bold flex items-center justify-center text-sm transition-all';
                gridBtn.className = 'w-7 h-7 rounded-md text-slate-500 hover:text-slate-900 flex items-center justify-center text-sm transition-all';
            }
        }
        this.renderGallery();
    }

    getFilteredAssets() {
        return this.assets.filter(asset => {
            // Filter by Tab
            if (this.activeTab === 'recent_upload' && !asset.recentlyUploaded) return false;
            if (this.activeTab === 'recent_used' && !asset.recentlyUsed) return false;
            
            // Filter by Search
            if (this.searchQuery) {
                const q = this.searchQuery;
                const match = asset.filename.toLowerCase().includes(q) || 
                              (asset.alt && asset.alt.toLowerCase().includes(q)) || 
                              (asset.caption && asset.caption.toLowerCase().includes(q));
                if (!match) return false;
            }
            return true;
        });
    }

    renderGallery() {
        const container = document.getElementById('media-gallery-container');
        if (!container) return;

        const filtered = this.getFilteredAssets();

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center text-center p-12 text-slate-400 font-sans">
                    <div class="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-slate-500 text-3xl font-bold shadow-xs">
                        <i class="ph ph-folder-open text-slate-400"></i>
                    </div>
                    <h3 class="text-base font-extrabold text-slate-800 mb-1">No media assets found</h3>
                    <p class="text-xs max-w-sm mb-6 text-slate-500">No attachments match your search query or tab filter in the Cloudflare R2 vault.</p>
                    <button onclick="document.getElementById('media-r2-upload-input').click()" class="px-5 py-2.5 rounded-xl bg-slate-900 text-[#C3FF00] font-bold text-xs uppercase shadow-md hover:bg-slate-800 transition-colors">
                        Upload New Asset
                    </button>
                </div>
            `;
            return;
        }

        if (this.activeView === 'grid') {
            container.innerHTML = `
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-12">
                    ${filtered.map(asset => {
                        const isSelected = asset.id === this.selectedId;
                        return `
                            <div onclick="StudioMediaLibrary.selectAsset('${asset.id}')" 
                                 class="group bg-white rounded-2xl border-2 transition-all overflow-hidden cursor-pointer flex flex-col ${isSelected ? 'border-slate-900 shadow-xl ring-2 ring-[#C3FF00]' : 'border-slate-200/80 hover:border-slate-400 shadow-2xs hover:shadow-md'}">
                                <div class="relative w-full h-36 bg-slate-100 overflow-hidden shrink-0">
                                    <img src="${asset.url}" alt="${asset.alt}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                                    ${isSelected ? '<span class="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-slate-900 text-[#C3FF00] flex items-center justify-center text-xs font-bold shadow-md"><i class="ph ph-check"></i></span>' : ''}
                                    <span class="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white font-mono text-[9px] font-bold uppercase tracking-wider backdrop-blur-xs">${asset.size}</span>
                                </div>
                                <div class="p-3 flex flex-col justify-between flex-1">
                                    <div>
                                        <div class="text-xs font-extrabold text-slate-900 truncate mb-0.5" title="${asset.filename}">${asset.filename}</div>
                                        <div class="text-[10px] text-slate-400 font-mono truncate">${asset.resolution}</div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        } else {
            // List View
            container.innerHTML = `
                <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden mb-12">
                    <table class="w-full text-left border-collapse text-xs font-sans">
                        <thead>
                            <tr class="border-b border-slate-200 bg-slate-50/80 text-[11px] font-mono text-slate-500 uppercase font-bold">
                                <th class="py-3 px-4">Media Preview</th>
                                <th class="py-3 px-4">Resolution & Size</th>
                                <th class="py-3 px-4 hidden md:table-cell">WCAG Alt Text</th>
                                <th class="py-3 px-4 hidden lg:table-cell">Uploaded Date</th>
                                <th class="py-3 px-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
                            ${filtered.map(asset => {
                                const isSelected = asset.id === this.selectedId;
                                const dateStr = new Date(asset.uploadedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                                return `
                                    <tr onclick="StudioMediaLibrary.selectAsset('${asset.id}')" 
                                        class="cursor-pointer transition-colors ${isSelected ? 'bg-slate-900 text-white font-bold' : 'hover:bg-slate-50 text-slate-800'}">
                                        <td class="py-3 px-4 flex items-center gap-3">
                                            <div class="w-12 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200/60">
                                                <img src="${asset.url}" alt="${asset.alt}" class="w-full h-full object-cover">
                                            </div>
                                            <div>
                                                <div class="font-extrabold truncate max-w-[180px] sm:max-w-xs ${isSelected ? 'text-white' : 'text-slate-900'}">${asset.filename}</div>
                                                <div class="text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-400'} font-mono">${asset.format}</div>
                                            </div>
                                        </td>
                                        <td class="py-3 px-4 font-mono text-[11px] ${isSelected ? 'text-slate-200' : 'text-slate-500'}">
                                            ${asset.resolution} &bull; <span class="font-bold text-emerald-400">${asset.size}</span>
                                        </td>
                                        <td class="py-3 px-4 hidden md:table-cell truncate max-w-xs ${isSelected ? 'text-slate-300' : 'text-slate-500'}" title="${asset.alt}">
                                            ${asset.alt || '<em class="text-rose-400 font-normal">Missing alt text</em>'}
                                        </td>
                                        <td class="py-3 px-4 hidden lg:table-cell font-mono text-[11px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}">
                                            ${dateStr}
                                        </td>
                                        <td class="py-3 px-4 text-right">
                                            ${isSelected ? '<span class="px-2.5 py-1 rounded-md bg-[#C3FF00] text-slate-950 font-black font-mono text-[10px] uppercase shadow-xs">Selected</span>' : '<span class="text-slate-400 text-xs">Select →</span>'}
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
        this.renderInspector();
    }

    selectAsset(id) {
        this.selectedId = id;
        this.renderGallery();
        this.renderInspector();
    }

    // --- REAL-TIME ASSET INSPECTOR ---
    renderInspector() {
        const pane = document.getElementById('media-inspector-pane');
        const confirmBtn = document.getElementById('btn-confirm-insert-media');
        if (!pane) return;

        const asset = this.assets.find(a => a.id === this.selectedId);

        if (!asset) {
            pane.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 font-sans">
                    <i class="ph ph-cursor-click text-4xl mb-3 text-slate-300"></i>
                    <p class="text-xs font-bold text-slate-600">No asset selected</p>
                    <p class="text-[11px] text-slate-400 mt-1">Select an item from the gallery or list view to inspect R2 metadata and edit WCAG Alt text.</p>
                </div>
            `;
            if (confirmBtn) confirmBtn.disabled = true;
            return;
        }

        if (confirmBtn) confirmBtn.disabled = false;
        const dateStr = new Date(asset.uploadedAt).toLocaleString();

        pane.innerHTML = `
            <!-- Inspector Header & Thumbnail -->
            <div class="p-5 border-b border-slate-200/80 bg-slate-50/50 space-y-4">
                <div class="w-full h-44 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200/80 shadow-sm relative group">
                    <img src="${asset.url}" alt="${asset.alt}" class="w-full h-full object-cover">
                    <a href="${asset.url}" target="_blank" class="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-[#C3FF00] font-mono text-[10px] font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
                        <i class="ph ph-arrow-square-out"></i> <span>View Raw</span>
                    </a>
                </div>

                <div>
                    <h4 class="text-sm font-extrabold text-slate-900 truncate" title="${asset.filename}">${asset.filename}</h4>
                    <div class="flex items-center gap-2 mt-1 font-mono text-[11px] text-slate-500">
                        <span>${asset.resolution}</span> &bull; <span class="font-bold text-slate-800">${asset.size}</span>
                    </div>
                </div>

                <!-- R2 CDN URL Read-Only Copy Vault -->
                <div class="space-y-1">
                    <label class="text-[10px] font-mono font-bold text-slate-400 uppercase">Cloudflare R2 CDN URL</label>
                    <div class="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1.5 text-xs font-mono text-slate-600">
                        <input type="text" readonly value="${asset.r2CdnUrl}" class="bg-transparent text-slate-800 w-full text-[11px] focus:outline-none select-all px-1">
                        <button onclick="navigator.clipboard.writeText('${asset.r2CdnUrl}'); StudioToast?.show('Copied Cloudflare R2 URL to clipboard!', 'info', 'Media Vault');" class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-[#C3FF00] text-slate-700 font-mono text-[10px] font-bold shrink-0 transition-colors">Copy</button>
                    </div>
                </div>
            </div>

            <!-- Real-time WCAG Alt Text & Caption Form -->
            <div class="p-5 space-y-5 flex-1 font-sans">
                <div class="space-y-1.5">
                    <label class="text-xs font-extrabold text-slate-800 flex items-center justify-between">
                        <span>WCAG Alt Text <strong class="text-rose-500">*</strong></span>
                        <span class="text-[10px] text-slate-400 font-mono font-normal">Mandatory for SEO & Accessibility</span>
                    </label>
                    <input type="text" 
                           id="inspector-alt-input" 
                           value="${asset.alt || ''}" 
                           oninput="StudioMediaLibrary.updateAssetMeta('${asset.id}', 'alt', this.value)"
                           placeholder="Describe image for screen readers..." 
                           class="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors shadow-2xs">
                    <p class="text-[11px] text-slate-400 leading-normal">Accurately describe what is depicted in the media for vision-impaired readers and Google image crawlers.</p>
                </div>

                <div class="space-y-1.5">
                    <label class="text-xs font-extrabold text-slate-800 flex items-center justify-between">
                        <span>Editorial Caption</span>
                        <span class="text-[10px] text-slate-400 font-mono font-normal">Optional attribution</span>
                    </label>
                    <textarea id="inspector-caption-input" 
                              rows="2" 
                              oninput="StudioMediaLibrary.updateAssetMeta('${asset.id}', 'caption', this.value)"
                              placeholder="Figure 1.0: Real-time architecture telemetry..." 
                              class="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors shadow-2xs resize-none leading-relaxed">${asset.caption || ''}</textarea>
                </div>

                <!-- Technical Metadata Summary -->
                <div class="pt-3 border-t border-slate-100 space-y-2 text-[11px] font-mono text-slate-500">
                    <div class="flex justify-between"><span>Format:</span><strong class="text-slate-800">${asset.format}</strong></div>
                    <div class="flex justify-between"><span>Uploaded:</span><strong class="text-slate-800">${dateStr.split(',')[0]}</strong></div>
                    <div class="flex justify-between"><span>Recently Used:</span><strong class="${asset.recentlyUsed ? 'text-emerald-600' : 'text-slate-400'} font-bold">${asset.recentlyUsed ? 'Yes (Active in Studio)' : 'No'}</strong></div>
                </div>
            </div>

            <!-- Inspector Actions: Replace & Delete -->
            <div class="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between gap-2 shrink-0">
                <input type="file" id="replace-asset-input-${asset.id}" accept="image/*" class="hidden" onchange="StudioMediaLibrary.replaceAssetFile('${asset.id}', this)">
                <button onclick="document.getElementById('replace-asset-input-${asset.id}').click()" class="flex-1 h-9 px-3 rounded-xl bg-white border border-slate-200 text-slate-800 hover:border-slate-900 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs">
                    <i class="ph ph-arrows-clockwise text-base"></i> <span>Replace Asset</span>
                </button>
                <button onclick="StudioMediaLibrary.deleteAsset('${asset.id}')" class="h-9 px-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1 shrink-0" title="Delete Asset from Vault">
                    <i class="ph ph-trash text-base"></i>
                </button>
            </div>
        `;
    }

    updateAssetMeta(id, key, value) {
        const asset = this.assets.find(a => a.id === id);
        if (asset) {
            asset[key] = value;
            this.saveState();
        }
    }

    replaceAssetFile(id, inputEl) {
        if (!inputEl.files || !inputEl.files[0]) return;
        const file = inputEl.files[0];
        const asset = this.assets.find(a => a.id === id);
        if (!asset) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            asset.url = e.target.result;
            asset.filename = file.name.replace(/\.[^/.]+$/, "") + "_replacement.webp";
            asset.r2CdnUrl = `https://cdn.bangjeje.dev/vault/${asset.filename}`;
            asset.size = `${Math.max(1, Math.round(file.size / 1024))} KB`;
            asset.uploadedAt = new Date().toISOString();
            asset.recentlyUploaded = true;
            this.saveState();
            this.renderGallery();
            this.renderInspector();
            StudioToast?.show(`Replaced asset cleanly on Cloudflare R2 Edge servers!`, 'success', 'Media Vault');
        };
        reader.readAsDataURL(file);
    }

    deleteAsset(id) {
        const asset = this.assets.find(a => a.id === id);
        if (!asset) return;
        if (!confirm(`Are you sure you want to permanently remove "${asset.filename}" from the Studio V2 Media Library and Cloudflare R2 Vault?`)) return;

        this.assets = this.assets.filter(a => a.id !== id);
        if (this.selectedId === id) {
            this.selectedId = this.assets.length > 0 ? this.assets[0].id : null;
        }
        this.saveState();
        this.renderGallery();
        StudioToast?.show(`Deleted media asset from R2 Vault.`, 'info', 'Studio Media');
    }

    // --- DIALOG INVOKER & EXECUTION CALLBACK ---
    open(options = {}) {
        this.onSelectCallback = options.onSelect || null;
        this.isOpen = true;
        const modal = document.getElementById('studio-media-library-modal');
        if (modal) {
            this.renderGallery();
            modal.classList.remove('hidden');
            setTimeout(() => modal.classList.remove('opacity-0'), 10);
        }
    }

    close() {
        this.isOpen = false;
        this.onSelectCallback = null;
        const modal = document.getElementById('studio-media-library-modal');
        if (modal && !modal.classList.contains('hidden')) {
            modal.classList.add('opacity-0');
            setTimeout(() => modal.classList.add('hidden'), 150);
        }
    }

    confirmSelection() {
        const asset = this.assets.find(a => a.id === this.selectedId);
        if (!asset) {
            StudioToast?.show('Please select a valid media attachment first.', 'warning', 'Media Vault');
            return;
        }

        // Mark as Recently Used when inserted into an article or studio entity!
        asset.recentlyUsed = true;
        this.saveState();

        if (typeof this.onSelectCallback === 'function') {
            this.onSelectCallback(asset);
        }
        this.close();
    }
}

// Instantiate Reusable Media Library Engine on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    new StudioMediaLibraryEngine();
});
