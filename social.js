// Social Media Launcher Animation
document.addEventListener('DOMContentLoaded', () => {
    const mainButton = document.querySelector('.main-button');
    const socialItems = document.querySelectorAll('.social-item');
    const socialLauncher = document.querySelector('.social-launcher');
    
    // Hide social items initially
    gsap.set(socialItems, { 
        opacity: 0, 
        y: 20,
        display: 'none'
    });
    
    // Create animation timeline
    const tl = gsap.timeline({ paused: true });
    
    // Add animations to timeline
    tl.to(socialItems, {
        opacity: 1,
        y: 0,
        display: 'flex',
        duration: 0.3,
        stagger: 0.1,
        ease: "power2.out"
    });
    
    // Toggle animation on hover/click
    let isOpen = false;
    
    function toggleSocial() {
        if (isOpen) {
            tl.reverse();
        } else {
            tl.play();
        }
        isOpen = !isOpen;
    }
    
    // Desktop: hover behavior
    if (!('ontouchstart' in window)) {
        socialLauncher.addEventListener('mouseenter', () => {
            if (!isOpen) toggleSocial();
        });
        
        socialLauncher.addEventListener('mouseleave', () => {
            if (isOpen) toggleSocial();
        });
    } 
    // Mobile: click behavior
    else {
        mainButton.addEventListener('click', (e) => {
            e.preventDefault();
            toggleSocial();
        });
    }
    
    // Individual button hover effect
    socialItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                scale: 1.1,
                duration: 0.2,
                ease: "power1.out"
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                scale: 1,
                duration: 0.2,
                ease: "power1.out"
            });
        });
    });
});