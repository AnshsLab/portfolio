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
    animateStats();
});

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
        '.stat-card, .project-card, .contribution-item'
    );

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
        observer.observe(el);
    });
}

// Animate stat numbers
function animateStats() {
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                const number = entry.target.querySelector('.stat-number');
                if (number) {
                    animateNumber(number);
                }
            }
        });
    }, { threshold: 0.5 });

    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        statObserver.observe(card);
    });
}

function animateNumber(element) {
    const text = element.textContent;
    const target = parseInt(text.replace(/\D/g, ''));
    const hasPlus = text.includes('+');
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (hasPlus ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (hasPlus ? '+' : '');
        }
    }, 16);
}

// Project Card Hover Effects
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Stat Card Hover Effects
const statCards = document.querySelectorAll('.stat-card');

statCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.stat-icon');
        if (icon) {
            icon.style.transform = 'scale(1.2) rotate(5deg)';
            icon.style.transition = 'transform 0.3s ease';
        }
    });

    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.stat-icon');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    });
});

// Navigation Active State Management
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

// Smooth Page Transitions for Navigation
const navLinks = document.querySelectorAll('.projects-nav a:not([href^="#"])');

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

// Project Links - prevent page transition on external links
const projectLinks = document.querySelectorAll('.project-link');

projectLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});

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

// Add ripple effect on click
function createRipple(event) {
    const element = event.currentTarget;
    
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple effect to clickable cards
projectCards.forEach(card => {
    card.addEventListener('click', createRipple);
});

statCards.forEach(card => {
    card.addEventListener('click', createRipple);
});

// Keyboard Accessibility
const interactiveElements = document.querySelectorAll(
    '.project-card, .stat-card, .contribution-item, .project-link'
);

interactiveElements.forEach(el => {
    if (!el.hasAttribute('tabindex')) {
        el.setAttribute('tabindex', '0');
    }
    
    el.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            el.click();
        }
    });
});

// Add ripple effect styles
const style = document.createElement('style');
style.textContent = `
    .project-card, .stat-card {
        position: relative;
        overflow: hidden;
    }
    
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-section');
    
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - (scrolled / 500);
    }
});

// Tag click interaction
const tags = document.querySelectorAll('.tag');

tags.forEach(tag => {
    tag.addEventListener('click', function(e) {
        e.stopPropagation();
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
});

// Contribution item hover effect
const contributionItems = document.querySelectorAll('.contribution-item');

contributionItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.contribution-icon');
        if (icon) {
            icon.style.transform = 'scale(1.2)';
            icon.style.transition = 'transform 0.3s ease';
        }
    });

    item.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.contribution-icon');
        if (icon) {
            icon.style.transform = 'scale(1)';
        }
    });
});

// Log initialization
console.log('Open Source page initialized successfully');