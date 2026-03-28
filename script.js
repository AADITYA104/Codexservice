// --- PARTICLES ENGINE ---
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
        this.vx = (Math.random() - 0.5) * 0.3; // Very slow drift
        this.vy = (Math.random() - 0.5) * 0.3;
        // Not too small, not too big (between 1.5px and 3.5px)
        this.size = Math.random() * 2 + 1.5; 
        
        // Soft white glow
        const opacity = Math.random() * 0.4 + 0.1;
        this.color = `rgba(255, 255, 255, ${opacity})`;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Infinite screen wrap
        if (this.x < -10) this.x = width + 10;
        if (this.x > width + 10) this.x = -10;
        if (this.y < -10) this.y = height + 10;
        if (this.y > height + 10) this.y = -10;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        
        // Subtle glow simulation on particle
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
        ctx.shadowBlur = 0; // reset
    }
}

function initParticles() {
    particles = [];
    // Amount scales with screen size for uniform density
    const count = window.innerWidth < 768 ? 35 : 80; 
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    requestAnimationFrame(animateParticles);
}

// Start visual engine
initParticles();
animateParticles();

// Initialize Lucide Icons
lucide.createIcons();

// Elements
const bentoItems = document.querySelectorAll('.bento-item');
const grid = document.querySelector('.bento-grid');

// Stagger fade-in animation based on position
bentoItems.forEach((card, index) => {
    // Starts fading in after 0.2s, sequence
    card.style.animationDelay = `${0.2 + (index * 0.06)}s`;
});

// Check if device supports hover (Desktop vs Mobile/Tablet touch devices)
const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (isDesktop) {
    // --- DESKTOP 3D TILT & LASER GLOW ---
    bentoItems.forEach((item) => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            // Calculate mouse position relative to card boundaries
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Update CSS variables for ambient glow and laser borders
            item.style.setProperty('--mouse-x', `${x}px`);
            item.style.setProperty('--mouse-y', `${y}px`);
            
            // Calculate 3D Tilt perspective based on mouse location
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -3; 
            const rotateY = ((x - centerX) / centerX) * 3;
            
            item.classList.remove('tilt-snapback'); 
            item.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
        });
        
        item.addEventListener('mouseleave', () => {
             // Hide glowing border/orbitals safely out of bounds
            item.style.setProperty('--mouse-x', `-1000px`);
            item.style.setProperty('--mouse-y', `-1000px`);
            
            // Re-enable smooth transition and snap 3D transform back
            item.classList.add('tilt-snapback');
            item.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            
            // Clean up transition class
            setTimeout(() => {
                item.classList.remove('tilt-snapback');
            }, 600);
        });
    });
} else {
    // --- MOBILE / TABLET PREMIUM SCROLL-FOCUS REVEAL ---
    
    // We wait 1 second for the initial fly-in animations to finish before activating the intersection blur
    setTimeout(() => {
        grid.classList.add('has-focus');
    }, 1200);

    // Observer options: focus only on the card resting in the middle 40% of the screen
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -30% 0px', 
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Feature focuses the card into the center frame
                entry.target.classList.add('mobile-focus');
                
                // Read the inline accent color assigned to this specific card mathematically
                const accent = getComputedStyle(entry.target).getPropertyValue('--accent').trim();
                
                // Apply a gorgeous contextual 3D glow matching the active card
                entry.target.style.boxShadow = `0 15px 40px rgba(0,0,0,0.6), inset 0 0 20px ${accent}`;
                entry.target.style.borderColor = accent;
            } else {
                // Dim down, shrink and blur as it scrolls away
                entry.target.classList.remove('mobile-focus');
                entry.target.style.boxShadow = '';
                entry.target.style.borderColor = '';
            }
        });
    }, observerOptions);

    bentoItems.forEach(item => {
        // Enforce a really smooth transition system for the blur and scale transforms
        item.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease, filter 0.6s ease, box-shadow 0.6s ease, border-color 0.6s ease';
        observer.observe(item);
    });
}
