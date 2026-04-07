// --- SMOOTH SCROLL ENGINE (LENIS) ---
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// --- PARTICLES ENGINE ---
// Simplified and refined for a monolithic business aesthetic
const canvas = document.getElementById('particles-bg');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4; // Slightly faster for visual interest
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 1.5 + 0.5; 
        
        const opacity = Math.random() * 0.5 + 0.1;
        this.color = `rgba(255, 255, 255, ${opacity})`;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -20) this.x = width + 20;
        if (this.x > width + 20) this.x = -20;
        if (this.y < -20) this.y = height + 20;
        if (this.y > height + 20) this.y = -20;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = window.innerWidth < 768 ? 40 : 120; // Enough for a good mesh
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    // Neural mesh connection logic
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = dx * dx + dy * dy;

            // Connect if close enough (approx 122px)
            if (dist < 15000) {
                const opacity = 1 - (dist / 15000);
                // Subtle line connecting nodes
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.15})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// --- DEFINITIONS ---
const bentoItems = document.querySelectorAll('.bento-item');
const grid = document.querySelector('.bento-grid');
const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// --- BENTO GRID INTERACTIONS (LUXURY MINIMAL) ---

// 1. Staggered fade-in
bentoItems.forEach((card, index) => {
    card.style.animationDelay = `${0.1 + (index * 0.04)}s`;
});

// Linear-style subtle card highlighting
if (isDesktop) {
    document.getElementById('cards-wrapper').addEventListener('mousemove', (e) => {
        for(const card of bentoItems) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        }
    });

    // Subtle 3D Depth
    bentoItems.forEach((item) => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -1.5; // Very subtle
            const rotateY = ((x - centerX) / centerX) * 1.5;
            
            item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.005, 1.005, 1.005)`;
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

} else {
    setTimeout(() => grid.classList.add('has-focus'), 1000);

    const observerOptions = {
        root: null,
        rootMargin: '-35% 0px -35% 0px', 
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('mobile-focus');
            } else {
                entry.target.classList.remove('mobile-focus');
            }
        });
    }, observerOptions);

    bentoItems.forEach(item => {
        item.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.4s ease, border-color 0.4s ease';
        observer.observe(item);
    });
}

// --- INITIALIZATION ---
lucide.createIcons();
