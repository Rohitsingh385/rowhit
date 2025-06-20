# 🚀 Modern Developer Portfolio

A sleek, modern, and fully responsive developer portfolio website built with vanilla HTML, CSS, and JavaScript. Features a futuristic design with smooth animations, dark/light theme toggle, and a command palette interface.

## ✨ Features

### 🎨 Design & UX
- **Futuristic Aesthetic**: Modern, hacker-inspired design with elegant typography
- **Dual Theme Support**: Light and dark mode with smooth transitions
- **Fully Responsive**: Optimized for all devices and screen sizes
- **Smooth Animations**: CSS animations and micro-interactions throughout
- **Accessibility**: WCAG compliant with proper focus states and keyboard navigation

### 🖥️ Sections
- **Hero Section**: Animated typing effect with floating 3D object
- **About**: Developer background with stats and social links
- **Projects**: Interactive project cards with hover effects
- **Blog**: Recent posts with emoji prefixes
- **Contact**: Functional contact form with validation

### 🎯 Interactive Features
- **Command Palette**: Press `Ctrl+Enter` or click terminal icon
- **Theme Toggle**: Animated sun/moon icon in top corner
- **Smooth Scrolling**: Navigation with smooth scroll behavior
- **Scroll Animations**: Elements animate in as they enter viewport
- **Micro-interactions**: Hover effects on buttons, cards, and links

### 🛠️ Technical Features
- **Vanilla JavaScript**: No frameworks or dependencies
- **CSS Custom Properties**: Dynamic theming with CSS variables
- **Local Storage**: Theme preference persistence
- **Performance Optimized**: Fast loading with minimal bundle size
- **SEO Friendly**: Semantic HTML and meta tags

## 🚀 Quick Start

1. **Clone or Download**
   ```bash
   git clone <repository-url>
   cd developer-portfolio
   ```

2. **Open in Browser**
   ```bash
   # Using Python (if installed)
   python -m http.server 8000
   
   # Using Node.js (if installed)
   npx serve .
   
   # Or simply open index.html in your browser
   ```

3. **Customize Content**
   - Edit `index.html` to update your information
   - Modify `styles.css` for design changes
   - Update `script.js` for functionality changes

## 📁 File Structure

```
developer-portfolio/
├── index.html          # Main HTML structure
├── styles.css          # All styles and animations
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 🎨 Customization Guide

### Personal Information
Edit the following sections in `index.html`:

```html
<!-- Hero Section -->
<h1 class="hero-title">
    <span class="greeting">Hello, I'm</span>
    <span class="name">Your Name</span>
</h1>

<!-- About Section -->
<p class="about-description">
    Your personal description here...
</p>

<!-- Contact Information -->
<a href="mailto:your@email.com">your@email.com</a>
```

### Typing Effect
Modify the typing text in `script.js`:

```javascript
const typingEffect = new TypingEffect(
    typingText,
    [
        'Your First Title',
        'Your Second Title',
        'Your Third Title',
        'Your Fourth Title'
    ],
    100
);
```

### Projects
Add or modify project cards in `index.html`:

```html
<div class="project-card" data-aos="fade-up">
    <div class="project-image">
        <div class="project-placeholder">
            <i class="fas fa-code"></i>
        </div>
    </div>
    <div class="project-content">
        <h3 class="project-title">Project Name</h3>
        <p class="project-description">Project description...</p>
        <div class="project-tags">
            <span class="tag">React</span>
            <span class="tag">Node.js</span>
        </div>
        <div class="project-actions">
            <a href="#" class="btn btn-sm btn-primary">Live Demo</a>
            <a href="#" class="btn btn-sm btn-secondary">Source</a>
        </div>
    </div>
</div>
```

### Colors & Theme
Modify CSS variables in `styles.css`:

```css
:root {
    /* Light Theme */
    --bg-primary: #ffffff;
    --bg-secondary: #f8fafc;
    --text-primary: #1a202c;
    --accent-primary: #3b82f6;  /* Change this for your brand color */
    --accent-secondary: #1e40af;
}

[data-theme="dark"] {
    /* Dark Theme */
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --text-primary: #f1f5f9;
    --accent-primary: #60a5fa;  /* Change this for your brand color */
    --accent-secondary: #3b82f6;
}
```

### Fonts
Change fonts in `index.html` head section:

```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

Then update in `styles.css`:

```css
body {
    font-family: 'Your Font', sans-serif;
}
```

## 🎯 Command Palette

The command palette (accessible via `Ctrl+Enter` or terminal icon) includes:

- **Download CV**: Simulates CV download
- **Go to Projects**: Smooth scroll to projects section
- **Email me**: Smooth scroll to contact section
- **Toggle Theme**: Switch between light/dark modes

### Adding Custom Commands
Add new commands in `script.js`:

```javascript
// Add to command list in HTML
<div class="command-item" data-action="custom-action">
    <i class="fas fa-star"></i>
    <span>Custom Action</span>
</div>

// Add to executeCommand method
case 'custom-action':
    // Your custom action here
    break;
```

## 📱 Mobile Optimization

The website is fully responsive with:

- **Mobile-first design**: Optimized for small screens
- **Touch-friendly**: Large buttons and touch targets
- **Simplified animations**: Reduced complexity on mobile
- **Full-screen modals**: Command palette adapts to mobile

## 🔧 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🚀 Performance Tips

1. **Optimize Images**: Use WebP format and compress images
2. **Minify CSS/JS**: Use build tools to minify for production
3. **CDN Fonts**: Consider self-hosting fonts for better performance
4. **Lazy Loading**: Add lazy loading for images if needed

## 🎨 Design System

### Typography
- **Primary Font**: Space Grotesk (modern, geometric)
- **Monospace Font**: JetBrains Mono (for code elements)
- **Font Weights**: 300, 400, 500, 600, 700

### Spacing
- **Container**: max-width 1200px
- **Section Padding**: 5rem (80px)
- **Grid Gap**: 2rem (32px)
- **Button Padding**: 0.75rem 1.5rem

### Animations
- **Duration**: 0.3s (standard), 0.6s (scroll animations)
- **Easing**: ease (standard), ease-in-out (floating)
- **Transform**: translateY, scale, rotate

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Fonts: Google Fonts (Space Grotesk, JetBrains Mono)
- Icons: Font Awesome
- Inspiration: Modern web design trends and developer portfolios

---

**Built with ❤️ and lots of ☕**

Feel free to customize this portfolio to match your personal brand and style! 