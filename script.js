// Canvas Animation Classes
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
        this.bindEvents();
    }

    init() {
        this.resize();
        this.createParticles();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        this.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                life: Math.random() * 100 + 100
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    updateParticles() {
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx += (dx / distance) * force * 0.01;
                particle.vy += (dy / distance) * force * 0.01;
            }

            // Boundary check
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            // Keep particles in bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));

            // Update life
            particle.life--;
            if (particle.life <= 0) {
                this.particles[index] = {
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.5 + 0.2,
                    life: Math.random() * 100 + 100
                };
            }
        });
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.particles.forEach((particle, i) => {
            this.particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 80) {
                    const opacity = (80 - distance) / 80 * 0.1;
                    this.ctx.strokeStyle = `rgba(102, 126, 234, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                }
            });
        });

        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(102, 126, 234, ${particle.opacity})`;
            this.ctx.fill();
        });
    }

    animate() {
        this.updateParticles();
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}

class GeometryAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.shapes = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
        this.bindEvents();
    }

    init() {
        this.resize();
        this.createShapes();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createShapes() {
        const shapeCount = 8;
        this.shapes = [];
        
        for (let i = 0; i < shapeCount; i++) {
            this.shapes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 50 + 20,
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                type: Math.floor(Math.random() * 3), // 0: triangle, 1: square, 2: hexagon
                opacity: 0.1,
                targetOpacity: 0.1,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    drawShape(shape) {
        this.ctx.save();
        this.ctx.translate(shape.x, shape.y);
        this.ctx.rotate(shape.rotation);
        this.ctx.strokeStyle = `rgba(118, 75, 162, ${shape.opacity})`;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        switch (shape.type) {
            case 0: // Triangle
                this.ctx.moveTo(0, -shape.size);
                this.ctx.lineTo(-shape.size * 0.866, shape.size * 0.5);
                this.ctx.lineTo(shape.size * 0.866, shape.size * 0.5);
                this.ctx.closePath();
                break;
            case 1: // Square
                this.ctx.rect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
                break;
            case 2: // Hexagon
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI) / 3;
                    const x = Math.cos(angle) * shape.size;
                    const y = Math.sin(angle) * shape.size;
                    if (i === 0) this.ctx.moveTo(x, y);
                    else this.ctx.lineTo(x, y);
                }
                this.ctx.closePath();
                break;
        }
        
        this.ctx.stroke();
        this.ctx.restore();
    }

    updateShapes() {
        this.shapes.forEach(shape => {
            // Update position
            shape.x += shape.vx;
            shape.y += shape.vy;
            
            // Boundary check
            if (shape.x < 0 || shape.x > this.canvas.width) shape.vx *= -1;
            if (shape.y < 0 || shape.y > this.canvas.height) shape.vy *= -1;
            
            // Update rotation
            shape.rotation += shape.rotationSpeed;
            
            // Mouse interaction
            const dx = this.mouse.x - shape.x;
            const dy = this.mouse.y - shape.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                shape.targetOpacity = 0.8;
                shape.rotationSpeed = (Math.random() - 0.5) * 0.1;
            } else {
                shape.targetOpacity = 0.1;
                shape.rotationSpeed = (Math.random() - 0.5) * 0.02;
            }
            
            // Smooth opacity transition
            shape.opacity += (shape.targetOpacity - shape.opacity) * 0.1;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateShapes();
        this.shapes.forEach(shape => this.drawShape(shape));
        requestAnimationFrame(() => this.animate());
    }
}

class WaveAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.waves = [];
        this.time = 0;
        this.init();
    }

    init() {
        this.resize();
        this.createWaves();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createWaves() {
        this.waves = [
            {
                amplitude: 30,
                frequency: 0.01,
                speed: 0.02,
                offset: 0,
                color: 'rgba(102, 126, 234, 0.1)'
            },
            {
                amplitude: 20,
                frequency: 0.015,
                speed: 0.025,
                offset: Math.PI / 3,
                color: 'rgba(118, 75, 162, 0.1)'
            },
            {
                amplitude: 25,
                frequency: 0.008,
                speed: 0.015,
                offset: Math.PI / 2,
                color: 'rgba(240, 147, 251, 0.1)'
            }
        ];
    }

    drawWave(wave) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = wave.color;
        this.ctx.lineWidth = 3;
        
        for (let x = 0; x <= this.canvas.width; x += 5) {
            const y = this.canvas.height / 2 + 
                     Math.sin(x * wave.frequency + this.time * wave.speed + wave.offset) * wave.amplitude;
            
            if (x === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.stroke();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.time++;
        
        this.waves.forEach(wave => this.drawWave(wave));
        requestAnimationFrame(() => this.animate());
    }
}

// Intersection Observer for scroll animations
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.createObserver();
        this.addAnimationClasses();
    }

    createObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, options);
    }

    addAnimationClasses() {
        // Add animation classes to elements
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            const animationClass = index % 2 === 0 ? 'fade-in' : 'slide-in-left';
            section.classList.add(animationClass);
            this.observer.observe(section);
        });

        // Animate project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.classList.add('scale-in');
            card.style.transitionDelay = `${index * 0.1}s`;
            this.observer.observe(card);
        });

        // Animate skill tags
        const skillTags = document.querySelectorAll('.skill-tag');
        skillTags.forEach((tag, index) => {
            tag.classList.add('fade-in');
            tag.style.transitionDelay = `${index * 0.05}s`;
            this.observer.observe(tag);
        });
    }
}

// Smooth scrolling and navigation
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupSmoothScrolling();
    }

    bindEvents() {
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });

        // Mobile menu toggle
        this.hamburger.addEventListener('click', () => {
            this.hamburger.classList.toggle('active');
            this.navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.hamburger.classList.remove('active');
                this.navMenu.classList.remove('active');
            });
        });
    }

    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Form handling
class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        this.showSuccessMessage();
        this.form.reset();
    }

    showSuccessMessage() {
        const button = this.form.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        
        button.textContent = 'Message Sent!';
        button.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 3000);
    }
}

// Mouse cursor effects
class CursorEffects {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursorFollower = document.createElement('div');
        this.init();
    }

    init() {
        this.createCursor();
        this.bindEvents();
    }

    createCursor() {
        this.cursor.className = 'cursor';
        this.cursorFollower.className = 'cursor-follower';
        
        const style = document.createElement('style');
        style.textContent = `
            .cursor {
                position: fixed;
                width: 10px;
                height: 10px;
                background: rgba(102, 126, 234, 0.8);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: transform 0.1s ease;
            }
            .cursor-follower {
                position: fixed;
                width: 30px;
                height: 30px;
                border: 2px solid rgba(102, 126, 234, 0.3);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                transition: all 0.3s ease;
            }
            .cursor.active {
                transform: scale(1.5);
                background: rgba(118, 75, 162, 1);
            }
            .cursor-follower.active {
                transform: scale(1.5);
                border-color: rgba(118, 75, 162, 0.8);
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorFollower);
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX - 5 + 'px';
            this.cursor.style.top = e.clientY - 5 + 'px';
            
            setTimeout(() => {
                this.cursorFollower.style.left = e.clientX - 15 + 'px';
                this.cursorFollower.style.top = e.clientY - 15 + 'px';
            }, 100);
        });

        // Add hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-tag');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.classList.add('active');
                this.cursorFollower.classList.add('active');
            });
            
            element.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('active');
                this.cursorFollower.classList.remove('active');
            });
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize canvas animations
    const particleCanvas = document.getElementById('particleCanvas');
    const geometryCanvas = document.getElementById('geometryCanvas');
    const waveCanvas = document.getElementById('waveCanvas');
    
    if (particleCanvas) new ParticleSystem(particleCanvas);
    if (geometryCanvas) new GeometryAnimation(geometryCanvas);
    if (waveCanvas) new WaveAnimation(waveCanvas);
    
    // Initialize other features
    new ScrollAnimations();
    new Navigation();
    new ContactForm();
    
    // Initialize cursor effects only on desktop
    if (window.innerWidth > 768) {
        new CursorEffects();
    }
    
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Handle window resize
window.addEventListener('resize', () => {
    // Recreate cursor effects if switching between mobile/desktop
    const existingCursor = document.querySelector('.cursor');
    if (window.innerWidth <= 768 && existingCursor) {
        existingCursor.remove();
        document.querySelector('.cursor-follower').remove();
    } else if (window.innerWidth > 768 && !existingCursor) {
        new CursorEffects();
    }
});
