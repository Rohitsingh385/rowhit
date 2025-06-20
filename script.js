// DOM Elements
const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const commandBtn = document.getElementById('commandBtn');
const commandModal = document.getElementById('commandModal');
const commandClose = document.getElementById('commandClose');
const commandSearch = document.getElementById('commandSearch');
const commandList = document.getElementById('commandList');
const typingText = document.getElementById('typingText');
const cursor = document.getElementById('cursor');
const floatingObject = document.getElementById('floatingObject');
const contactForm = document.getElementById('contactForm');
const downloadCv = document.getElementById('downloadCv');

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.updateThemeIcon();
    }

    applyTheme(theme) {
        body.className = `${theme}-mode`;
        body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const icon = themeToggle.querySelector('i');
        if (this.currentTheme === 'light') {
            icon.className = 'fas fa-moon';
        } else {
            icon.className = 'fas fa-sun';
        }
    }
}

// Typing Effect
class TypingEffect {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        this.type();
    }

    type() {
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            typeSpeed = 500; // Pause before starting next word
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Command Menu
class CommandMenu {
    constructor() {
        this.isOpen = false;
        this.selectedIndex = 0;
        this.allItems = [];
        this.filteredItems = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.getAllItems();
    }

    bindEvents() {
        // Open command menu
        commandBtn.addEventListener('click', () => this.open());
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                this.open();
            }
        });

        // Close command menu
        commandClose.addEventListener('click', () => this.close());
        commandModal.addEventListener('click', (e) => {
            if (e.target === commandModal) {
                this.close();
            }
        });

        // Search functionality
        commandSearch.addEventListener('input', () => this.filterCommands());
        commandSearch.addEventListener('keydown', (e) => this.handleKeydown(e));

        // Command item clicks
        commandList.addEventListener('click', (e) => {
            const commandItem = e.target.closest('.command-item');
            if (commandItem) {
                this.executeCommand(commandItem.dataset.action);
            }
        });
    }

    getAllItems() {
        this.allItems = Array.from(commandList.querySelectorAll('.command-item'));
        this.filteredItems = [...this.allItems];
    }

    open() {
        this.isOpen = true;
        commandModal.classList.add('active');
        commandSearch.focus();
        this.resetFilter();
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.isOpen = false;
        commandModal.classList.remove('active');
        commandSearch.value = '';
        this.selectedIndex = 0;
        this.resetFilter();
        document.body.style.overflow = '';
    }

    resetFilter() {
        this.filteredItems = [...this.allItems];
        this.selectedIndex = 0;
        this.updateDisplay();
    }

    filterCommands() {
        const searchTerm = commandSearch.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            this.resetFilter();
            return;
        }

        this.filteredItems = this.allItems.filter(item => {
            const text = item.textContent.toLowerCase();
            return text.includes(searchTerm);
        });

        this.selectedIndex = 0;
        this.updateDisplay();
    }

    updateDisplay() {
        // Hide all items first
        this.allItems.forEach(item => {
            item.style.display = 'none';
            item.classList.remove('selected');
        });

        // Show only filtered items
        this.filteredItems.forEach((item, index) => {
            item.style.display = 'flex';
            if (index === this.selectedIndex) {
                item.classList.add('selected');
            }
        });
    }

    handleKeydown(e) {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (this.filteredItems.length > 0) {
                    this.selectedIndex = (this.selectedIndex + 1) % this.filteredItems.length;
                    this.updateDisplay();
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (this.filteredItems.length > 0) {
                    this.selectedIndex = this.selectedIndex === 0 
                        ? this.filteredItems.length - 1 
                        : this.selectedIndex - 1;
                    this.updateDisplay();
                }
                break;
            case 'Enter':
                e.preventDefault();
                if (this.filteredItems[this.selectedIndex]) {
                    this.executeCommand(this.filteredItems[this.selectedIndex].dataset.action);
                }
                break;
            case 'Escape':
                this.close();
                break;
        }
    }

    executeCommand(action) {
        switch (action) {
            case 'download-cv':
                this.downloadCV();
                break;
            case 'go-projects':
                this.scrollToSection('#projects');
                break;
            case 'email-me':
                this.scrollToSection('#contact');
                break;
            case 'toggle-theme':
                themeManager.toggleTheme();
                break;
        }
        this.close();
    }

    downloadCV() {
        // Simulate CV download
        const link = document.createElement('a');
        link.href = '#';
        link.download = 'Alex_Chen_CV.pdf';
        link.click();
        
        // Show success message
        this.showNotification('CV downloaded successfully!', 'success');
    }

    scrollToSection(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Smooth Scrolling
class SmoothScroller {
    constructor() {
        this.init();
    }

    init() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.observeElements();
        this.handleScroll();
    }

    observeElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                }
            });
        }, observerOptions);

        const elements = document.querySelectorAll('[data-aos]');
        elements.forEach(el => observer.observe(el));
    }

    handleScroll() {
        const navbar = document.querySelector('.navbar');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                if (body.classList.contains('dark-mode')) {
                    navbar.style.background = 'rgba(15, 23, 42, 0.98)';
                }
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                if (body.classList.contains('dark-mode')) {
                    navbar.style.background = 'rgba(15, 23, 42, 0.95)';
                }
            }

            lastScroll = currentScroll;
        });
    }
}

// Form Handler
class FormHandler {
    constructor() {
        this.init();
    }

    init() {
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showSuccessMessage();
            contactForm.reset();
        } catch (error) {
            this.showErrorMessage();
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    showSuccessMessage() {
        const notification = document.createElement('div');
        notification.className = 'notification notification-success';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Message sent successfully!</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    showErrorMessage() {
        const notification = document.createElement('div');
        notification.className = 'notification notification-error';
        notification.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>Failed to send message. Please try again.</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Fox Face Animation
class FoxFace {
    constructor() {
        this.init();
    }

    init() {
        if (floatingObject) {
            this.createFoxFace();
            this.addMouseInteraction();
        }
    }

    createFoxFace() {
        floatingObject.innerHTML = `
            <div class="fox-face">
                <div class="fox-ears">
                    <div class="fox-ear left"></div>
                    <div class="fox-ear right"></div>
                </div>
                <div class="fox-head">
                    <div class="fox-whiskers">
                        <div class="fox-whisker left-1"></div>
                        <div class="fox-whisker left-2"></div>
                        <div class="fox-whisker left-3"></div>
                        <div class="fox-whisker right-1"></div>
                        <div class="fox-whisker right-2"></div>
                        <div class="fox-whisker right-3"></div>
                    </div>
                    <div class="fox-eyes">
                        <div class="fox-eye left">
                            <div class="fox-pupil"></div>
                        </div>
                        <div class="fox-eye right">
                            <div class="fox-pupil"></div>
                        </div>
                    </div>
                    <div class="fox-nose"></div>
                    <div class="fox-mouth"></div>
                </div>
            </div>
        `;
    }

    addMouseInteraction() {
        let mouseX = 0;
        let mouseY = 0;
        let foxX = 0;
        let foxY = 0;
        let foxRotationX = 0;
        let foxRotationY = 0;

        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth fox movement
        const animate = () => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            // Calculate distance from center
            const deltaX = mouseX - centerX;
            const deltaY = mouseY - centerY;
            
            // Limit movement range
            const maxMove = 25;
            const maxRotation = 15;
            
            // Calculate movement
            const targetMoveX = Math.max(-maxMove, Math.min(maxMove, deltaX * 0.08));
            const targetMoveY = Math.max(-maxMove, Math.min(maxMove, deltaY * 0.08));
            
            // Calculate rotation for more realistic movement
            const targetRotationX = Math.max(-maxRotation, Math.min(maxRotation, deltaY * 0.02));
            const targetRotationY = Math.max(-maxRotation, Math.min(maxRotation, deltaX * 0.02));
            
            // Smooth interpolation
            foxX += (targetMoveX - foxX) * 0.08;
            foxY += (targetMoveY - foxY) * 0.08;
            foxRotationX += (targetRotationX - foxRotationX) * 0.05;
            foxRotationY += (targetRotationY - foxRotationY) * 0.05;
            
            // Apply movement and rotation to the entire fox face
            floatingObject.style.transform = `translate(${foxX}px, ${foxY}px) rotateX(${foxRotationX}deg) rotateY(${foxRotationY}deg)`;
            
            // Move pupils to follow cursor more precisely
            const pupils = floatingObject.querySelectorAll('.fox-pupil');
            const eyes = floatingObject.querySelectorAll('.fox-eye');
            
            pupils.forEach((pupil, index) => {
                const eye = eyes[index];
                const eyeRect = eye.getBoundingClientRect();
                const eyeCenterX = eyeRect.left + eyeRect.width / 2;
                const eyeCenterY = eyeRect.top + eyeRect.height / 2;
                
                const pupilDeltaX = mouseX - eyeCenterX;
                const pupilDeltaY = mouseY - eyeCenterY;
                
                // More responsive pupil movement
                const pupilMoveX = Math.max(-4, Math.min(4, pupilDeltaX * 0.015));
                const pupilMoveY = Math.max(-4, Math.min(4, pupilDeltaY * 0.015));
                
                pupil.style.transform = `translate(${pupilMoveX}px, ${pupilMoveY}px)`;
            });
            
            // Add subtle ear movement based on cursor position
            const ears = floatingObject.querySelectorAll('.fox-ear');
            ears.forEach((ear, index) => {
                const earDeltaX = mouseX - (window.innerWidth / 2);
                const earRotation = Math.max(-8, Math.min(8, earDeltaX * 0.01));
                const baseRotation = index === 0 ? -2 : 2; // Slight natural tilt
                ear.style.transform = `rotate(${baseRotation + earRotation}deg)`;
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
}

// Notification Styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 1rem 1.5rem;
        box-shadow: var(--shadow-medium);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left: 4px solid #10b981;
    }
    
    .notification-error {
        border-left: 4px solid #ef4444;
    }
    
    .notification i {
        font-size: 1.2rem;
    }
    
    .notification-success i {
        color: #10b981;
    }
    
    .notification-error i {
        color: #ef4444;
    }
`;

// Add notification styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Testimonial Chat Bubble System
class TestimonialBubble {
    constructor() {
        this.testimonials = [
            {
                name: "Priya Sharma",
                role: "Principal, DAV Public School",
                quote: "Rohit delivered our School ERP system on time and exceeded expectations. The payment integration is seamless and parents love the convenience.",
                avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM4YjVhZmYiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyeiIvPgo8cGF0aCBkPSJNMTIgNkM4LjY5IDYgNiA4LjY5IDYgMTJzMi42OSA2IDYgNiA2LTIuNjkgNi02LTIuNjktNi02LTZ6Ii8+Cjwvc3ZnPgo8L3N2Zz4K"
            },
            {
                name: "Rajesh Kumar",
                role: "CEO, Bright Lighting Co.",
                quote: "Our new website increased online sales by 40%. Rohit's attention to detail and professional approach made the entire process smooth.",
                avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNmNTczNzMiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyeiIvPgo8cGF0aCBkPSJNMTIgNkM4LjY5IDYgNiA4LjY5IDYgMTJzMi42OSA2IDYgNiA2LTIuNjkgNi02LTIuNjktNi02LTZ6Ii8+Cjwvc3ZnPgo8L3N2Zz4K"
            },
            {
                name: "Amit Patel",
                role: "Director, SpiceMart India",
                quote: "The payment gateway integration was flawless. Rohit's technical expertise saved us significant time and the system handles high transaction volumes perfectly.",
                avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMxMGI5ODEiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyeiIvPgo8cGF0aCBkPSJNMTIgNkM4LjY5IDYgNiA4LjY5IDYgMTJzMi42OSA2IDYgNiA2LTIuNjkgNi02LTIuNjktNi02LTZ6Ii8+Cjwvc3ZnPgo8L3N2Zz4K"
            },
            {
                name: "Dr. Meera Singh",
                role: "Founder, Excel Coaching Center",
                quote: "Professional, reliable, and delivers quality work. The admin panel makes content management effortless and the website perfectly represents our brand.",
                avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNmNTkzYjMiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyeiIvPgo8cGF0aCBkPSJNMTIgNkM4LjY5IDYgNiA4LjY5IDYgMTJzMi42OSA2IDYgNiA2LTIuNjkgNi02LTIuNjktNi02LTZ6Ii8+Cjwvc3ZnPgo8L3N2Zz4K"
            }
        ];
        
        this.currentIndex = 0;
        this.isExpanded = false;
        this.isVisible = false;
        this.timer = null;
        this.init();
    }

    init() {
        this.bubbleDot = document.getElementById('bubbleDot');
        this.bubbleCard = document.getElementById('bubbleCard');
        this.bubbleClose = document.getElementById('bubbleClose');
        this.bubbleNext = document.getElementById('bubbleNext');
        
        this.bindEvents();
        this.startTimer();
    }

    bindEvents() {
        // Click bubble dot to expand
        this.bubbleDot.addEventListener('click', () => {
            this.expandBubble();
        });

        // Close button
        this.bubbleClose.addEventListener('click', (e) => {
            e.stopPropagation();
            this.collapseBubble();
        });

        // Next button
        this.bubbleNext.addEventListener('click', (e) => {
            e.stopPropagation();
            this.nextTestimonial();
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isExpanded) {
                this.collapseBubble();
            }
        });
    }

    startTimer() {
        // Show first bubble after 3 seconds
        setTimeout(() => {
            this.showBubble();
        }, 3000);

        // Then show every 20-30 seconds
        this.timer = setInterval(() => {
            if (!this.isExpanded) {
                this.showBubble();
            }
        }, 20000 + Math.random() * 10000);
    }

    showBubble() {
        if (this.isVisible) return;
        
        this.isVisible = true;
        this.bubbleDot.classList.add('visible');
        
        // Add glow effect for first few appearances
        if (this.currentIndex < 2) {
            this.bubbleDot.style.animation = 'bubbleGlow 2s ease-in-out infinite';
        }
        
        // Auto-hide after 6 seconds if not clicked
        setTimeout(() => {
            if (!this.isExpanded) {
                this.hideBubble();
            }
        }, 6000);
    }

    hideBubble() {
        this.isVisible = false;
        this.bubbleDot.classList.remove('visible');
        this.bubbleDot.style.animation = 'bubblePulse 2s ease-in-out infinite';
    }

    expandBubble() {
        this.isExpanded = true;
        this.bubbleCard.classList.add('expanded');
        this.updateTestimonial();
        
        // Add subtle sound effect (optional)
        this.playNotificationSound();
    }

    collapseBubble() {
        this.isExpanded = false;
        this.bubbleCard.classList.remove('expanded');
        this.hideBubble();
    }

    nextTestimonial() {
        this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
        this.updateTestimonial();
        
        // Add transition effect
        this.bubbleCard.style.opacity = '0.7';
        setTimeout(() => {
            this.bubbleCard.style.opacity = '1';
        }, 200);
    }

    updateTestimonial() {
        const testimonial = this.testimonials[this.currentIndex];
        
        document.getElementById('testimonialName').textContent = testimonial.name;
        document.getElementById('testimonialRole').textContent = testimonial.role;
        document.getElementById('testimonialQuote').textContent = testimonial.quote;
        document.getElementById('testimonialAvatar').src = testimonial.avatar;
    }

    playNotificationSound() {
        // Create a subtle notification sound
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Fallback for browsers that don't support AudioContext
            console.log('Audio notification not supported');
        }
    }
}

// Cookie Consent System
class CookieConsent {
    constructor() {
        this.cookieBanner = document.getElementById('cookieBanner');
        this.cookieModal = document.getElementById('cookieModal');
        this.cookiePreferences = document.getElementById('cookiePreferences');
        this.acceptAllCookies = document.getElementById('acceptAllCookies');
        this.cookieModalClose = document.getElementById('cookieModalClose');
        this.saveCookiePreferences = document.getElementById('saveCookiePreferences');
        this.rejectAllCookies = document.getElementById('rejectAllCookies');
        this.analyticsCookies = document.getElementById('analyticsCookies');
        this.functionalCookies = document.getElementById('functionalCookies');
        this.marketingCookies = document.getElementById('marketingCookies');
        
        this.cookieSettings = {
            essential: true,
            analytics: false,
            functional: false,
            marketing: false
        };
        
        this.init();
    }
    
    init() {
        // Check if user has already made a choice
        const consent = this.getCookie('cookie_consent');
        if (!consent) {
            // Show banner after 2 seconds
            setTimeout(() => {
                this.showBanner();
            }, 2000);
        } else {
            // Load saved preferences
            this.loadPreferences();
        }
        
        this.bindEvents();
    }
    
    bindEvents() {
        this.cookiePreferences.addEventListener('click', () => this.showModal());
        this.acceptAllCookies.addEventListener('click', () => this.acceptAll());
        this.cookieModalClose.addEventListener('click', () => this.hideModal());
        this.saveCookiePreferences.addEventListener('click', () => this.savePreferences());
        this.rejectAllCookies.addEventListener('click', () => this.rejectAll());
        
        // Close modal on outside click
        this.cookieModal.addEventListener('click', (e) => {
            if (e.target === this.cookieModal) {
                this.hideModal();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.cookieModal.classList.contains('show')) {
                this.hideModal();
            }
        });
    }
    
    showBanner() {
        this.cookieBanner.classList.add('show');
        this.cookieBanner.classList.add('slide-in');
        
        // Add floating settings button
        this.addSettingsButton();
    }
    
    hideBanner() {
        this.cookieBanner.classList.add('slide-out');
        setTimeout(() => {
            this.cookieBanner.classList.remove('show', 'slide-in', 'slide-out');
        }, 400);
    }
    
    showModal() {
        this.cookieModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Set current preferences
        this.analyticsCookies.checked = this.cookieSettings.analytics;
        this.functionalCookies.checked = this.cookieSettings.functional;
        this.marketingCookies.checked = this.cookieSettings.marketing;
        
        // Add event listeners for toggles
        this.analyticsCookies.addEventListener('change', (e) => {
            this.cookieSettings.analytics = e.target.checked;
        });
        
        this.functionalCookies.addEventListener('change', (e) => {
            this.cookieSettings.functional = e.target.checked;
        });
        
        this.marketingCookies.addEventListener('change', (e) => {
            this.cookieSettings.marketing = e.target.checked;
        });
    }
    
    hideModal() {
        this.cookieModal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    acceptAll() {
        this.cookieSettings = {
            essential: true,
            analytics: true,
            functional: true,
            marketing: true
        };
        this.saveConsent();
        this.hideBanner();
        this.showSuccessMessage('All cookies accepted');
        this.initializeAnalytics();
    }
    
    rejectAll() {
        this.cookieSettings = {
            essential: true,
            analytics: false,
            functional: false,
            marketing: false
        };
        this.saveConsent();
        this.hideModal();
        this.hideBanner();
        this.showSuccessMessage('Non-essential cookies rejected');
    }
    
    savePreferences() {
        this.cookieSettings = {
            essential: true,
            analytics: this.analyticsCookies.checked,
            functional: this.functionalCookies.checked,
            marketing: this.marketingCookies.checked
        };
        this.saveConsent();
        this.hideModal();
        this.hideBanner();
        this.showSuccessMessage('Cookie preferences saved');
        
        if (this.cookieSettings.analytics) {
            this.initializeAnalytics();
        }
    }
    
    saveConsent() {
        const consentData = {
            ...this.cookieSettings,
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
        
        this.setCookie('cookie_consent', JSON.stringify(consentData), 365);
        
        // Save individual preferences
        if (this.cookieSettings.functional) {
            this.setCookie('theme_preference', document.body.classList.contains('dark-mode') ? 'dark' : 'light', 365);
        }
    }
    
    loadPreferences() {
        const consent = this.getCookie('cookie_consent');
        if (consent) {
            try {
                const data = JSON.parse(consent);
                this.cookieSettings = {
                    essential: data.essential || true,
                    analytics: data.analytics || false,
                    functional: data.functional || false,
                    marketing: data.marketing || false
                };
                
                // Apply functional preferences
                if (this.cookieSettings.functional) {
                    const theme = this.getCookie('theme_preference');
                    if (theme === 'dark') {
                        document.body.classList.add('dark-mode');
                    }
                }
                
                // Initialize analytics if accepted
                if (this.cookieSettings.analytics) {
                    this.initializeAnalytics();
                }
                
                // Show settings button
                this.addSettingsButton();
            } catch (e) {
                console.error('Error loading cookie preferences:', e);
            }
        }
    }
    
    addSettingsButton() {
        // Remove existing button if any
        const existingBtn = document.querySelector('.cookie-settings-btn');
        if (existingBtn) {
            existingBtn.remove();
        }
        
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'cookie-settings-btn show';
        settingsBtn.innerHTML = '<i class="fas fa-cog"></i>';
        settingsBtn.title = 'Cookie Settings';
        settingsBtn.addEventListener('click', () => this.showModal());
        
        document.body.appendChild(settingsBtn);
    }
    
    showSuccessMessage(message) {
        // Remove existing message if any
        const existingMsg = document.querySelector('.cookie-success');
        if (existingMsg) {
            existingMsg.remove();
        }
        
        const successMsg = document.createElement('div');
        successMsg.className = 'cookie-success';
        successMsg.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(successMsg);
        
        // Show message
        setTimeout(() => {
            successMsg.classList.add('show');
        }, 100);
        
        // Hide message after 3 seconds
        setTimeout(() => {
            successMsg.classList.remove('show');
            setTimeout(() => {
                successMsg.remove();
            }, 300);
        }, 3000);
    }
    
    initializeAnalytics() {
        // Track page view
        this.trackEvent('page_view', {
            page: window.location.pathname,
            title: document.title
        });
        
        // Track user engagement
        this.trackEvent('user_engagement', {
            session_start: new Date().toISOString()
        });
    }
    
    trackEvent(eventName, data = {}) {
        if (!this.cookieSettings.analytics) return;
        
        const eventData = {
            event: eventName,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            ...data
        };
        
        // Store analytics data in localStorage (in real app, send to analytics service)
        const analytics = JSON.parse(localStorage.getItem('analytics') || '[]');
        analytics.push(eventData);
        localStorage.setItem('analytics', JSON.stringify(analytics.slice(-100))); // Keep last 100 events
        
        console.log('Analytics Event:', eventData);
    }
    
    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }
    
    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
}

// Initialize cookie consent system
const cookieConsent = new CookieConsent();

// Track user interactions for analytics
document.addEventListener('DOMContentLoaded', () => {
    if (cookieConsent.cookieSettings.analytics) {
        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll % 25 === 0) { // Track every 25%
                    cookieConsent.trackEvent('scroll_depth', { depth: maxScroll });
                }
            }
        });
        
        // Track time on page
        let startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            cookieConsent.trackEvent('time_on_page', { seconds: timeSpent });
        });
        
        // Track clicks on important elements
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button, .project-card, .skill-item');
            if (target) {
                const elementType = target.tagName.toLowerCase();
                const elementText = target.textContent.trim().substring(0, 50);
                cookieConsent.trackEvent('element_click', {
                    type: elementType,
                    text: elementText,
                    href: target.href || null
                });
            }
        });
    }
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme manager
    const themeManager = new ThemeManager();
    
    // Initialize typing effect
    const typingEffect = new TypingEffect(
        typingText,
        [
            'Full Stack Developer',
            'ERP System Specialist',
            'Payment Gateway Expert',
            'Business Solution Architect'
        ],
        100
    );
    
    // Initialize command menu
    const commandMenu = new CommandMenu();
    
    // Initialize smooth scrolling
    const smoothScroller = new SmoothScroller();
    
    // Initialize scroll animations
    const scrollAnimations = new ScrollAnimations();
    
    // Initialize form handler
    const formHandler = new FormHandler();
    
    // Initialize fox face
    const foxFace = new FoxFace();
    
    // Initialize testimonial bubble
    const testimonialBubble = new TestimonialBubble();
    
    // Theme toggle event
    themeToggle.addEventListener('click', () => {
        themeManager.toggleTheme();
    });
    
    // Download CV event
    if (downloadCv) {
        downloadCv.addEventListener('click', (e) => {
            e.preventDefault();
            commandMenu.downloadCV();
        });
    }
    
    // Add some micro-interactions
    addMicroInteractions();
});

// Micro-interactions
function addMicroInteractions() {
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Social link hover effects
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-3px) rotate(5deg)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0) rotate(0deg)';
        });
    });
    
    // Project card hover effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Blog emoji hover effects
    const blogEmojis = document.querySelectorAll('.blog-emoji');
    blogEmojis.forEach(emoji => {
        emoji.addEventListener('mouseenter', () => {
            emoji.style.transform = 'rotate(10deg) scale(1.1)';
        });
        
        emoji.addEventListener('mouseleave', () => {
            emoji.style.transform = 'rotate(0deg) scale(1)';
        });
    });
}

// Performance optimization
window.addEventListener('load', () => {
    // Preload critical resources
    const criticalImages = [
        // Add any critical images here
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
} 