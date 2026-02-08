// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis smooth scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Connect Lenis with ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

// Wait for DOM to load
window.addEventListener('DOMContentLoaded', () => {
    
    // Get all sections
    const sections = gsap.utils.toArray('section');
    
    // Animate each section's image with wipe effect
    sections.forEach((section, index) => {
        const img = section.querySelector('img');
        
        if (img && index < sections.length - 1) {
            // Calculate the gap spacing
            const imgHeight = img.offsetHeight;
            const viewportHeight = window.innerHeight;
            const gap = (viewportHeight - imgHeight) / 2;
            
            gsap.to(img, {
                clipPath: 'inset(0 0 100% 0)',
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: `bottom+=${gap}px bottom`,
                    end: `bottom+=${viewportHeight - gap}px bottom`,
                    scrub: true,
                    // markers: true // Uncomment to debug
                }
            });
        }
    });
    
    // Page Transition
    const overlay = document.querySelector('.page-transition-overlay');
    if (overlay) {
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 500);
        }, 100);
    }
    
    // Back to Home Button
    const backHome = document.getElementById('backHome');
    if (backHome) {
        backHome.addEventListener('click', (e) => {
            e.preventDefault();
            const overlay = document.querySelector('.page-transition-overlay');
            overlay.style.display = 'block';
            overlay.style.opacity = '1';
            setTimeout(() => {
                window.location.href = 'index.html#grid';
            }, 500);
        });
    }
});

// Refresh ScrollTrigger on resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});