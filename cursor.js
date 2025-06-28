// Custom cursor functionality
document.addEventListener('DOMContentLoaded', () => {
    // Get cursor elements
    const cursorOuter = document.querySelector('.cursor-outer');
    const cursorInner = document.querySelector('.cursor-inner');
    
    // Track mouse position
    let mouseX = 0;
    let mouseY = 0;
    
    // Section-specific cursor styles
    const sections = [
        { id: 'hero', color: '#667eea', borderColor: '#667eea' },
        { id: 'work', color: '#764ba2', borderColor: '#764ba2' },
        { id: 'services', color: '#000000', borderColor: '#000000' },
        { id: 'about', color: '#667eea', borderColor: '#667eea' },
        { id: 'contact', color: '#ffffff', borderColor: '#ffffff' }
    ];
    
    // Update mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Update cursor position
        cursorOuter.style.left = mouseX + 'px';
        cursorOuter.style.top = mouseY + 'px';
        cursorInner.style.left = mouseX + 'px';
        cursorInner.style.top = mouseY + 'px';
    });
    
    // Change cursor style based on section
    const updateCursorStyle = () => {
        const scrollY = window.scrollY;
        
        // Find current section
        for (const section of sections) {
            const element = document.getElementById(section.id);
            if (element) {
                const rect = element.getBoundingClientRect();
                const sectionTop = rect.top + window.scrollY;
                const sectionBottom = sectionTop + rect.height;
                
                if (scrollY >= sectionTop - 100 && scrollY < sectionBottom) {
                    cursorInner.style.backgroundColor = section.color;
                    cursorOuter.style.borderColor = section.borderColor;
                    cursorOuter.style.backgroundColor = section.color + '33'; // 20% opacity
                    break;
                }
            }
        }
    };
    
    // Update cursor on scroll
    window.addEventListener('scroll', updateCursorStyle);
    
    // Initial update
    updateCursorStyle();
    
    // Hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-item, .footer-link');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOuter.style.width = '60px';
            cursorOuter.style.height = '60px';
            cursorInner.style.width = '12px';
            cursorInner.style.height = '12px';
        });
        
        el.addEventListener('mouseleave', () => {
            cursorOuter.style.width = '40px';
            cursorOuter.style.height = '40px';
            cursorInner.style.width = '8px';
            cursorInner.style.height = '8px';
        });
    });
    
    // Handle touch devices
    if ('ontouchstart' in window) {
        document.body.style.cursor = 'auto';
        cursorOuter.style.display = 'none';
        cursorInner.style.display = 'none';
    }
});