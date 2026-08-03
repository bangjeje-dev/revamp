document.addEventListener('DOMContentLoaded', () => {
            // Mobile Menu
            const menuBtn = document.querySelector('.md\\:hidden');
            
            if (menuBtn) {
                // Deteksi base path secara dinamis dari menu desktop agar rute mobile menu selalu akurat (baik di root, pages/, atau sub-folder)
                const refLink = document.querySelector('nav a[href*="services.html"], nav a[href*="contact.html"], nav a[href*="about.html"]');
                let basePath = '';
                if (refLink) {
                    const href = refLink.getAttribute('href');
                    const match = href.match(/^(.*?)(?:services|contact|about)\.html/);
                    if (match) {
                        basePath = match[1];
                    }
                }

                const mobileMenuHTML = `
                    <div id="mobile-menu" class="fixed inset-0 bg-dark/95 backdrop-blur-xl z-40 hidden flex-col justify-center items-center space-y-8 text-2xl font-medium tracking-tight">
                        <a href="${basePath}services.html" class="mobile-link text-textSecondary hover:text-white transition-colors">Services</a>
                        <a href="${basePath}industries.html" class="mobile-link text-textSecondary hover:text-white transition-colors">Industries</a>
                        <a href="${basePath}case-studies.html" class="mobile-link text-textSecondary hover:text-white transition-colors">Case Studies</a>
                        <a href="${basePath}insights.html" class="mobile-link text-textSecondary hover:text-white transition-colors">Insights</a>
                        <a href="${basePath}about.html" class="mobile-link text-textSecondary hover:text-white transition-colors">About</a>
                        <a href="${basePath}contact.html" class="mobile-link text-textSecondary hover:text-white transition-colors mt-4 text-xl border border-glass px-6 py-2 rounded-full">Contact</a>
                        <button aria-label="Close" id="close-menu" class="absolute top-6 right-6 p-2 text-textSecondary hover:text-white"><i class="ph ph-x text-3xl"></i></button>
                    </div>
                `;
                
                // Only insert if it doesn't already exist
                if (!document.getElementById('mobile-menu')) {
                    document.body.insertAdjacentHTML('beforeend', mobileMenuHTML);
                }
                
                const mobileMenu = document.getElementById('mobile-menu');
                const closeBtn = document.getElementById('close-menu');
                const mobileLinks = document.querySelectorAll('.mobile-link');

                if (mobileMenu) {
                    menuBtn.addEventListener('click', () => {
                        mobileMenu.classList.remove('hidden');
                        mobileMenu.classList.add('flex');
                        document.body.style.overflow = 'hidden';
                    });

                    const closeMenu = () => {
                        mobileMenu.classList.add('hidden');
                        mobileMenu.classList.remove('flex');
                        document.body.style.overflow = 'auto';
                    };

                    if (closeBtn) {
                        closeBtn.addEventListener('click', closeMenu);
                    }
                    
                    if (mobileLinks.length > 0) {
                        mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
                    }
                }
            }

            // Scroll Reveal Observer
            const revealElements = document.querySelectorAll('.reveal-up');
            
            if (revealElements.length > 0) {
                const revealOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };

                const revealOnScroll = new IntersectionObserver(function(entries, observer) {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('is-visible');
                            observer.unobserve(entry.target);
                        }
                    });
                }, revealOptions);

                revealElements.forEach(el => revealOnScroll.observe(el));
                
                // Trigger initial reveal
                setTimeout(() => {
                    document.querySelectorAll('.reveal-up:not(.is-visible)').forEach(el => {
                        if(el.getBoundingClientRect().top < window.innerHeight) {
                            el.classList.add('is-visible');
                        }
                    });
                }, 100);
            }
        });