// BANGJEJE.DEV STUDIO — Interactivity & Live Engine Framework (Frontend UI Only)

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sidebar Toggle for Mobile
    const sidebar = document.getElementById('studio-sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (sidebar && toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
        });
    }

    // 2. SEO Manager & SERP Preview Realtime Generators
    const titleInput = document.getElementById('seo-meta-title');
    const descInput = document.getElementById('seo-meta-desc');
    const slugInput = document.getElementById('seo-slug');
    const serpTitle = document.getElementById('serp-preview-title');
    const serpDesc = document.getElementById('serp-preview-desc');
    const serpUrl = document.getElementById('serp-preview-url');

    if (titleInput && serpTitle) {
        titleInput.addEventListener('input', (e) => {
            serpTitle.textContent = e.target.value || 'Designing for Enterprise Growth | bangjeje.dev Insights';
            updateCharacterCounter(e.target, 'title-count', 60);
        });
    }

    if (descInput && serpDesc) {
        descInput.addEventListener('input', (e) => {
            serpDesc.textContent = e.target.value || 'How enterprise tech leaders integrate headless architecture and glassmorphic design systems to drive measurable conversion metrics.';
            updateCharacterCounter(e.target, 'desc-count', 160);
        });
    }

    if (slugInput && serpUrl) {
        slugInput.addEventListener('input', (e) => {
            const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
            serpUrl.textContent = `https://bangjeje.dev/insights/${slug || 'article-slug'}`;
        });
    }

    // Auto slug generator from Title
    const mainTitle = document.getElementById('main-title-input');
    if (mainTitle && slugInput) {
        mainTitle.addEventListener('input', (e) => {
            if (!slugInput.dataset.manual) {
                const generated = e.target.value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
                slugInput.value = generated;
                if (serpUrl) serpUrl.textContent = `https://bangjeje.dev/insights/${generated || 'article-slug'}`;
            }
        });
        slugInput.addEventListener('change', () => { slugInput.dataset.manual = 'true'; });
    }

    // 3. Tab Switcher for SERP Preview (Desktop / Mobile / Social Cards)
    const viewTabs = document.querySelectorAll('.serp-tab-btn');
    const viewPanels = document.querySelectorAll('.serp-view-panel');
    viewTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            viewTabs.forEach(t => t.classList.remove('bg-slate-900', 'text-white', 'font-semibold'));
            tab.classList.add('bg-slate-900', 'text-white', 'font-semibold');
            const targetId = tab.dataset.target;
            if (viewPanels) {
                viewPanels.forEach(p => p.classList.add('hidden'));
                const showPanel = document.getElementById(targetId);
                if (showPanel) showPanel.classList.remove('hidden');
            }
        });
    });
});

function updateCharacterCounter(inputEl, counterId, max) {
    const counter = document.getElementById(counterId);
    if (counter) {
        const len = inputEl.value.length;
        counter.textContent = `${len}/${max}`;
        if (len > max) {
            counter.classList.add('text-red-500', 'font-bold');
        } else {
            counter.classList.remove('text-red-500', 'font-bold');
        }
    }
}
