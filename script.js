// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set initial body opacity for loading animation
    gsap.set('body', { opacity: 0 });
    
    // Disable ScrollTrigger markers globally
    gsap.config({
        autoSleep: 60,
        force3D: true,
        nullTargetWarn: false
    });
    
    ScrollTrigger.defaults({
        markers: false
    });
    
    initNavbarAnimation();
    initHeroAnimation();
    initProjectsAnimation();
    initAboutAnimation();
    initResumeAnimation();
    initTextAnimation();
    initTestimonialCarousel();
    initSmoothScrolling();
});

// 1. Navbar Animation
function initNavbarAnimation() {
    const navIcon = document.getElementById('navIcon');
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    let isNavVisible = false;
    
    // Initial icon drop animation
    gsap.fromTo(navIcon, 
        { y: -150, opacity: 0, scale: 0.5, rotation: -180 },
        { 
            y: 0, 
            opacity: 1, 
            scale: 1,
            rotation: 0,
            duration: 1.2, 
            ease: "elastic.out(1, 0.5)",
            delay: 0.3
        }
    );
    
    // Expand to navbar after icon lands
    gsap.to(navIcon, {
        opacity: 0,
        scale: 0,
        y: -20,
        duration: 0.5,
        delay: 1.8,
        ease: "back.in(1.7)"
    });
    
    gsap.fromTo(navbar,
        { 
            scaleX: 0,
            scaleY: 0.3,
            borderRadius: "50%",
            opacity: 0,
            y: 10
        },
        {
            scaleX: 1,
            scaleY: 1,
            borderRadius: "25px",
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 2.1,
            ease: "back.out(1.4)"
        }
    );
    
    // Scroll direction detection
    function handleScroll() {
        const currentScrollY = window.scrollY;
        const aboutSection = document.querySelector('.about');
        const aboutTop = aboutSection.offsetTop;
        const aboutBottom = aboutTop + aboutSection.offsetHeight;
        
        // Check if we're in the about section
        const isInAboutSection = currentScrollY >= aboutTop - 100 && currentScrollY <= aboutBottom + 100;
        
        if (isInAboutSection) {
            // Always show navbar in about section
            if (!isNavVisible) {
                gsap.to(navbar, {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    ease: "back.out(1.2)"
                });
                isNavVisible = true;
            }
        } else if (currentScrollY > 100) {
            if (currentScrollY > lastScrollY && isNavVisible) {
                // Scrolling down - hide navbar
                gsap.to(navbar, {
                    y: -120,
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.4,
                    ease: "power3.in"
                });
                isNavVisible = false;
            } else if (currentScrollY < lastScrollY && !isNavVisible) {
                // Scrolling up - show navbar
                gsap.to(navbar, {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    ease: "back.out(1.2)"
                });
                isNavVisible = true;
            }
        } else {
            // At top - always show
            if (!isNavVisible) {
                gsap.to(navbar, {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    ease: "back.out(1.2)"
                });
                isNavVisible = true;
            }
        }
        
        lastScrollY = currentScrollY;
    }
    
    // Water fill animation on scroll
    const navLinks = document.querySelectorAll('.nav-link:not(.contact-btn)');
    navLinks.forEach((link, index) => {
        const fill = link.querySelector('.nav-fill');
        
        gsap.to(fill, {
            height: "100%",
            scrollTrigger: {
                trigger: document.body,
                start: `${(index + 1) * 200}px top`,
                end: `${(index + 1) * 400}px top`,
                scrub: 1,
                onEnter: () => {
                    gsap.to(fill, {
                        height: "100%",
                        duration: 0.6,
                        ease: "power3.out"
                    });
                },
                onLeave: () => {
                    gsap.to(fill, {
                        height: "0%",
                        duration: 0.4,
                        ease: "power3.in"
                    });
                }
            }
        });
    });
    
    window.addEventListener('scroll', handleScroll);
    
    // Set initial state
    setTimeout(() => {
        isNavVisible = true;
    }, 3000);
}

// 2. Hero Section Animation
function initHeroAnimation() {
    const heroIntro = document.querySelector('.hero-intro');
    const heroText = document.querySelector('.hero-text');
    
    // Split text into words for animation
    const words = heroIntro.innerHTML.split(' ');
    heroIntro.innerHTML = '';
    
    // Wrap each word in a span
    words.forEach((word, index) => {
        const span = document.createElement('span');
        span.className = 'hero-word';
        span.style.color = '#999999'; // Ensure all text starts as grey
        span.textContent = word;
        heroIntro.appendChild(span);
        if (index < words.length - 1) {
            heroIntro.appendChild(document.createTextNode(' '));
        }
    });
    
    // Get all word spans
    const wordSpans = document.querySelectorAll('.hero-word');
    
    // Create a text fill animation
    let textFillTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.hero',
            start: 'top 20%',
            end: '+=1000', // Fixed scroll distance for the animation
            pin: true,
            pinSpacing: true,
            scrub: 0.5
        }
    });
    
    // Animate each word from gray to black
    wordSpans.forEach((span, index) => {
        textFillTimeline.to(span, {
            color: '#000000',
            duration: 0.5,
            ease: 'power1.inOut'
        }, index * 0.1);
    });
    
    // Add a small delay at the end before unpinning
    textFillTimeline.to({}, {duration: 0.5});
    
    // Initial fade in
    gsap.fromTo(heroIntro, 
        { opacity: 0, y: 30 }, 
        { 
            opacity: 1, 
            y: 0, 
            duration: 1.2, 
            delay: 0.5,
            ease: "power2.out"
        }
    );
}

// 3. Projects Animation
function initProjectsAnimation() {
    const projectsSection = document.querySelector('.projects');
    const projectsTrack = document.querySelector('.projects-track');
    const projects = document.querySelectorAll('.project-item');
    const progressBar = document.querySelector('.progress-bar');
    
    // Calculate the total width of all projects plus gaps
    const totalWidth = Array.from(projects).reduce((width, project) => {
        return width + project.offsetWidth + parseFloat(getComputedStyle(project).marginRight);
    }, 0);
    
    // Set the width of the track
    projectsTrack.style.width = `${totalWidth}px`;
    
    // Create horizontal scroll animation
    let horizontalScroll = gsap.timeline({
        scrollTrigger: {
            trigger: projectsSection,
            pin: true,
            start: 'top top',
            end: () => `+=${totalWidth}`,
            scrub: 1,
            anticipatePin: 1,
            onUpdate: (self) => {
                // Update progress bar
                gsap.to(progressBar, {
                    width: `${self.progress * 100}%`,
                    duration: 0.1
                });
            }
        }
    });
    
    // Animate the track horizontally
    horizontalScroll.to(projectsTrack, {
        x: () => -(totalWidth - window.innerWidth + 100),
        ease: 'none'
    });
    
    // Hover animations for each project
    projects.forEach(project => {
        project.addEventListener("mouseenter", () => {
            gsap.to(project, { 
                scale: 1.03, 
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        project.addEventListener("mouseleave", () => {
            gsap.to(project, { 
                scale: 1, 
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
    
    // Special animation for Encounter Stories thumbnails
    const encounterStories = document.querySelector('.encounter-stories');
    if (encounterStories) {
        const thumbnails = encounterStories.querySelectorAll('.thumbnail');
        
        encounterStories.addEventListener('mouseenter', () => {
            gsap.fromTo(thumbnails, 
                { opacity: 0, x: 20 },
                { 
                    opacity: 1, 
                    x: 0, 
                    duration: 0.3, 
                    stagger: 0.1,
                    ease: "power2.out"
                }
            );
        });
    }
}

// 4. About Section Animation with Text Color Fill
function initAboutAnimation() {
    const aboutSection = document.querySelector('.about');
    const aboutTexts = document.querySelectorAll('.about-text');
    const aboutStats = document.querySelector('.about-stats');
    
    // Initially hide stats
    gsap.set(aboutStats, { opacity: 0, y: 30 });
    
    // Prepare text for animation
    aboutTexts.forEach(textElement => {
        // Split text into characters
        const text = textElement.innerHTML;
        let newHtml = '';
        
        // Create spans for each character
        for (let i = 0; i < text.length; i++) {
            // Check if we're inside a tag
            if (text[i] === '<') {
                // Find the end of the tag
                let tagEnd = text.indexOf('>', i);
                if (tagEnd !== -1) {
                    // Add the entire tag
                    newHtml += text.substring(i, tagEnd + 1);
                    i = tagEnd;
                    continue;
                }
            }
            
            // Regular character, wrap in span
            if (text[i] !== '>' && text[i-1] !== '<') {
                newHtml += `<span>${text[i]}</span>`;
            } else {
                newHtml += text[i];
            }
        }
        
        textElement.innerHTML = newHtml;
    });
    
    // Create scroll animation
    ScrollTrigger.create({
        trigger: aboutSection,
        start: 'top 20%',
        end: 'bottom 20%',
        pin: true,
        onUpdate: (self) => {
            // Get all spans
            const allSpans = [];
            aboutTexts.forEach(text => {
                const spans = text.querySelectorAll('span');
                spans.forEach(span => allSpans.push(span));
            });
            
            // Calculate how many characters to color based on scroll progress
            const totalSpans = allSpans.length;
            const progress = self.progress;
            const charsToColor = Math.floor(progress * totalSpans);
            
            // Color the characters
            allSpans.forEach((span, index) => {
                if (index < charsToColor) {
                    span.style.color = '#000000';
                } else {
                    span.style.color = '#999999';
                }
            });
            
            // Show stats when text is almost complete (80%)
            if (progress > 0.8) {
                const statsProgress = (progress - 0.8) * 5; // Scale 0.8-1.0 to 0-1
                gsap.to(aboutStats, {
                    opacity: statsProgress,
                    y: 30 - (statsProgress * 30),
                    duration: 0.1
                });
            }
        }
    });
}

// 5. Resume Animation
function initResumeAnimation() {
    const resumeItems = document.querySelectorAll('.resume-item');
    const skillItems = document.querySelectorAll('.skill-item');
    
    // Animate resume items
    gsap.from(resumeItems, {
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
            trigger: '.resume-content',
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });
    
    // Animate skill items
    gsap.from(skillItems, {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
            trigger: '.skills-grid',
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });
    
    // Animate download button
    gsap.from('.download-btn', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: {
            trigger: '.resume-download',
            start: "top 90%",
            toggleActions: "play none none none"
        }
    });
}

// 6. Animated Text Sections
function initTextAnimation() {
    const textItems = document.querySelectorAll('.text-item');
    
    textItems.forEach((item, index) => {
        gsap.to(item, {
            color: "#000000",
            scrollTrigger: {
                trigger: item,
                start: "top bottom",
                end: "top center",
                scrub: true,
                markers: false,
                onEnter: () => {
                    gsap.to(item, {
                        scale: 1.05,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                },
                onLeave: () => {
                    gsap.to(item, {
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            }
        });
    });
}

// 7. Testimonial Carousel
function initTestimonialCarousel() {
    const testimonials = document.querySelectorAll('.testimonial');
    let currentIndex = 0;
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            if (i === index) {
                gsap.to(testimonial, {
                    autoAlpha: 1,
                    duration: 0.5,
                    ease: "power2.out"
                });
                testimonial.classList.add('active');
            } else {
                gsap.to(testimonial, {
                    autoAlpha: 0,
                    duration: 0.5,
                    ease: "power2.out"
                });
                testimonial.classList.remove('active');
            }
        });
    }
    
    // Auto-rotate testimonials
    setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }, 4000);
    
    // Initialize first testimonial
    showTestimonial(0);
}

// 8. Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            
            if (target) {
                window.scrollTo({
                    top: target.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Fade in body after loading
    gsap.to('body', { opacity: 1, duration: 1, ease: "power2.out" });
}

// Loading animation
window.addEventListener('load', () => {
    gsap.to('body', {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
    });
});

// Scroll progress indicator
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 2px;
    background: #667eea;
    z-index: 9999;
    transition: width 0.1s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = scrolled + '%';
});
