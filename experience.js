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
    const animatedElements = document.querySelectorAll('.timeline-item');

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Timeline Item Hover Effects
const timelineItems = document.querySelectorAll('.timeline-item');

timelineItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
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

// Counter animation for timeline numbers
function animateNumber(element, target) {
    const duration = 1000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Trigger counter animation when timeline is visible
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const number = entry.target.querySelector('.item-number');
            if (number) {
                const target = parseInt(number.textContent);
                animateNumber(number, target);
            }
        }
    });
}, { threshold: 0.5 });

timelineItems.forEach(item => {
    timelineObserver.observe(item);
});

// Section header decoration animation
const decorationCircles = document.querySelectorAll('.deco-circle');

decorationCircles.forEach(circle => {
    setInterval(() => {
        circle.style.transform = 'scale(1.1)';
        setTimeout(() => {
            circle.style.transform = 'scale(1)';
        }, 300);
    }, 3000);
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

// Keyboard Accessibility
const interactiveElements = document.querySelectorAll('.timeline-item');

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

// Add ripple effect to clickable timeline items
timelineItems.forEach(item => {
    item.addEventListener('click', createRipple);
});

// Add ripple effect styles
const style = document.createElement('style');
style.textContent = `
    .timeline-item {
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
    
    .deco-circle {
        transition: transform 0.3s ease;
    }
`;
document.head.appendChild(style);

// Log initialization
console.log('Experience page initialized successfully');