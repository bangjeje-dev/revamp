document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Sticky Table of Contents (Scroll Spy) ---
    const tocLinks = document.querySelectorAll('.toc-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    if (tocLinks.length > 0 && contentSections.length > 0) {
        // Observer options for scroll spy
        const spyOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px', 
            threshold: 0
        };

        const tocObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    tocLinks.forEach(link => {
                        link.classList.remove('active', 'border-accent');
                        link.classList.add('border-transparent');
                    });
                    
                    const id = entry.target.getAttribute('id');
                    const activeLink = document.querySelector(`.toc-link[href="#${id}"]`);
                    
                    if (activeLink) {
                        activeLink.classList.add('active', 'border-accent');
                        activeLink.classList.remove('border-transparent');
                    }
                }
            });
        }, spyOptions);

        contentSections.forEach(section => {
            tocObserver.observe(section);
        });
    }

    // --- 2. Lightbox Interaction ---
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxTriggers = Array.from(document.querySelectorAll('.lightbox-trigger'));
    
    let currentImageIndex = -1;

    if (lightboxModal && lightboxImg) {
        
        const openLightbox = (index) => {
            if (index < 0 || index >= lightboxTriggers.length) return;
            currentImageIndex = index;
            
            const trigger = lightboxTriggers[currentImageIndex];
            
            let imgSrc = trigger.dataset.src;
            if (!imgSrc) {
                const imgInside = trigger.querySelector('img');
                if (imgInside) imgSrc = imgInside.src;
            }
            if (!imgSrc) {
                imgSrc = 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2070&auto=format&fit=crop';
            }
            
            // Extract caption text
            let captionText = "";
            const captionSpan = trigger.querySelector('span');
            if (captionSpan) {
                captionText = captionSpan.textContent.trim();
            } else if (trigger.dataset.caption) {
                captionText = trigger.dataset.caption;
            }
            
            lightboxImg.src = imgSrc;
            
            if (lightboxCaption) {
                lightboxCaption.textContent = captionText;
            }

            // Show prev/next if applicable
            if (lightboxPrev) {
                if (currentImageIndex > 0) lightboxPrev.classList.remove('hidden');
                else lightboxPrev.classList.add('hidden');
            }
            if (lightboxNext) {
                if (currentImageIndex < lightboxTriggers.length - 1) lightboxNext.classList.remove('hidden');
                else lightboxNext.classList.add('hidden');
            }
            
            lightboxModal.classList.remove('hidden');
            lightboxModal.classList.add('flex');
            
            requestAnimationFrame(() => {
                lightboxModal.classList.remove('opacity-0');
                lightboxImg.classList.remove('scale-95');
                lightboxImg.classList.add('scale-100');
                if (lightboxCaption) lightboxCaption.classList.remove('opacity-0');
            });
            
            document.body.style.overflow = 'hidden';
            
            // Add focus to modal for accessibility
            lightboxClose.focus();
        };

        const closeLightbox = () => {
            lightboxModal.classList.add('opacity-0');
            lightboxImg.classList.remove('scale-100');
            lightboxImg.classList.add('scale-95');
            if (lightboxCaption) lightboxCaption.classList.add('opacity-0');
            
            setTimeout(() => {
                lightboxModal.classList.remove('flex');
                lightboxModal.classList.add('hidden');
                lightboxImg.src = '';
                if (lightboxCaption) lightboxCaption.textContent = '';
                currentImageIndex = -1;
                
                // Return focus to the trigger that opened it
                if (currentImageIndex !== -1 && lightboxTriggers[currentImageIndex]) {
                    lightboxTriggers[currentImageIndex].focus();
                }
            }, 300);
            
            document.body.style.overflow = '';
        };

        // Attach click & keyboard events to triggers
        lightboxTriggers.forEach((trigger, index) => {
            trigger.addEventListener('click', () => openLightbox(index));
            trigger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(index);
                }
            });
        });

        // Navigation functions
        const goPrev = () => {
            if (currentImageIndex > 0) openLightbox(currentImageIndex - 1);
        };
        const goNext = () => {
            if (currentImageIndex < lightboxTriggers.length - 1) openLightbox(currentImageIndex + 1);
        };

        if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); goPrev(); });
        if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); goNext(); });
        
        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal || e.target.tagName.toLowerCase() === 'figure') {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (lightboxModal.classList.contains('hidden')) return;
            
            if (e.key === 'Escape') closeLightbox();
            else if (e.key === 'ArrowLeft') goPrev();
            else if (e.key === 'ArrowRight') goNext();
        });
    }
});
