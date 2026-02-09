// Page Transition on Load
window.addEventListener('DOMContentLoaded', () => {
    const overlay = document.querySelector('.page-transition-overlay');
    
    if (overlay) {
        setTimeout(() => {
            overlay.style.transition = 'opacity 0.5s ease';
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.pointerEvents = 'none';
            }, 500);
        }, 100);
    }

    // Initialize animations
    initScrollAnimations();
});

// Footer Functionality
const contactLink = document.getElementById('contactLink');
const footer = document.getElementById('footer');
const closeFooter = document.getElementById('closeFooter');

// Open footer on contact link click
if (contactLink) {
    contactLink.addEventListener('click', (e) => {
        e.preventDefault();
        footer.classList.add('active');
    });
}

// Close footer
if (closeFooter) {
    closeFooter.addEventListener('click', () => {
        footer.classList.remove('active');
    });
}

// Close footer on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && footer.classList.contains('active')) {
        footer.classList.remove('active');
    }
});

// Close footer when clicking outside
if (footer) {
    footer.addEventListener('click', (e) => {
        if (e.target === footer) {
            footer.classList.remove('active');
        }
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll(
        '.hero-content, .bio-column, .stat-item, .value-card, .cta-content'
    );

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax effect on hero image
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.profile-image');
    
    if (heroImage && scrolled < 1000) {
        heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Add hover effect enhancement for value cards
const valueCards = document.querySelectorAll('.value-card');

valueCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Navigation active state management
function setActiveNav() {
    const navLinks = document.querySelectorAll('.projects-nav a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('#')[0];
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

setActiveNav();

// Smooth page transitions for navigation
const navLinks = document.querySelectorAll('.projects-nav a:not([href^="#"]):not(#contactLink)');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Skip if it's the home button with hash
        if (href.includes('#') && !href.startsWith('#')) {
            return;
        }

        // Skip if it's an external link
        if (link.hostname !== window.location.hostname) {
            return;
        }

        e.preventDefault();
        
        const overlay = document.querySelector('.page-transition-overlay');
        overlay.style.pointerEvents = 'all';
        overlay.style.transition = 'opacity 0.5s ease';
        overlay.style.opacity = '1';
        
        setTimeout(() => {
            window.location.href = href;
        }, 500);
    });
});

// Add subtle animation to section titles
const sectionTitles = document.querySelectorAll('.section-title');

const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
        }
    });
}, { threshold: 0.5 });

sectionTitles.forEach(title => {
    titleObserver.observe(title);
});

// Add CSS animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll handler
const debouncedScroll = debounce(() => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.profile-image');
    
    if (heroImage && scrolled < 1000) {
        heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Accessibility: Add keyboard navigation for cards
valueCards.forEach(card => {
    card.setAttribute('tabindex', '0');
    
    card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            card.click();
        }
    });
});

// Log initialization
console.log('About page initialized successfully');