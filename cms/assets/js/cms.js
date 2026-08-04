// BANGJEJE.DEV CMS Foundation Interactive Scripts
// Note: Pure UI interactions only (Version 1 architecture foundation)

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Sidebar Toggle
    const sidebar = document.getElementById('cms-sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
        });
    }

    // Interactive SEO Preview generators for Article creation/editing
    const titleInput = document.getElementById('meta-title');
    const descInput = document.getElementById('meta-desc');
    const slugInput = document.getElementById('article-slug');
    const previewTitle = document.getElementById('preview-seo-title');
    const previewDesc = document.getElementById('preview-seo-desc');
    const previewUrl = document.getElementById('preview-seo-url');

    if (titleInput && previewTitle) {
        titleInput.addEventListener('input', (e) => {
            previewTitle.textContent = e.target.value || 'Your Meta Title Will Appear Here | bangjeje.dev';
        });
    }

    if (descInput && previewDesc) {
        descInput.addEventListener('input', (e) => {
            previewDesc.textContent = e.target.value || 'This is how your article description will show up in search engine results pages...';
        });
    }

    if (slugInput && previewUrl) {
        slugInput.addEventListener('input', (e) => {
            const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
            previewUrl.textContent = `https://bangjeje.dev/insights/${slug || 'article-slug'}`;
        });
    }

    // Auto-generate Slug from Article Title if slug is empty or user is typing title
    const mainTitle = document.getElementById('article-title');
    if (mainTitle && slugInput) {
        mainTitle.addEventListener('input', (e) => {
            if (!slugInput.dataset.manualEdit) {
                const generated = e.target.value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
                slugInput.value = generated;
                if (previewUrl) {
                    previewUrl.textContent = `https://bangjeje.dev/insights/${generated || 'article-slug'}`;
                }
            }
        });
        slugInput.addEventListener('change', () => {
            slugInput.dataset.manualEdit = 'true';
        });
    }
});
