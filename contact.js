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
    const animatedElements = document.querySelectorAll('.contact-card, .info-card');

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Enhanced Card Hover Effects with 3D Tilt
const contactCards = document.querySelectorAll('.contact-card');

contactCards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        
        // Update glow position
        const glow = this.querySelector('.card-glow');
        if (glow) {
            const glowX = ((x / rect.width) * 100) - 50;
            const glowY = ((y / rect.height) * 100) - 50;
            glow.style.transform = `translate(${glowX}%, ${glowY}%)`;
        }
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        
        const glow = this.querySelector('.card-glow');
        if (glow) {
            glow.style.transform = 'translate(0, 0)';
        }
    });
});

// Info Card Hover Effects
const infoCards = document.querySelectorAll('.info-card');

infoCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
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

// Keyboard Accessibility
contactCards.forEach(card => {
    card.setAttribute('tabindex', '0');
    
    card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
        }
    });
});

// Add subtle parallax effect to background circles
window.addEventListener('mousemove', (e) => {
    const circles = document.querySelectorAll('.decoration-circle');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    circles.forEach((circle, index) => {
        const speed = (index + 1) * 10;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        
        circle.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Smooth scroll reveal for section divider
const divider = document.querySelector('.section-divider');
if (divider) {
    const observerOptions = {
        threshold: 0.5
    };
    
    const dividerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);
    
    divider.style.opacity = '0';
    divider.style.transition = 'opacity 0.8s ease';
    dividerObserver.observe(divider);
}

// Add ripple effect on card click
contactCards.forEach(card => {
    card.addEventListener('click', function(e) {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        const rect = this.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top = (e.clientY - rect.top) + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(20);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Log initialization
console.log('Contact page initialized successfully');
console.log('User info loaded: Ansh Singhal');