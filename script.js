const canvas = document.getElementById('tech-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// Configuration for the "IT/Data" look
const properties = {
    particleColor: 'rgba(255, 255, 255, 0.5)', // White dots
    lineColor: 'rgba(157, 0, 255,', // Purple lines base
    particleCount: 70,
    connectionDistance: 150,
    mouseDistance: 200
}

// Mouse interaction
let mouse = { x: null, y: null };
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

// Resize handling
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Particle Class
class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1; // Slow floating speed
        this.vy = (Math.random() - 0.5) * 1;
        this.size = Math.random() * 2 + 1;
        // Randomly assign one of the neon colors to the dot
        const colors = ['#9D00FF', '#D500F9', '#FF6D00', '#FFFFFF'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction (move away slightly)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < properties.mouseDistance) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (properties.mouseDistance - distance) / properties.mouseDistance;
            const directionX = forceDirectionX * force * 2; // Repel strength
            const directionY = forceDirectionY * force * 2;
            this.x -= directionX;
            this.y -= directionY;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// Create initial particles
function init() {
    particles = [];
    for (let i = 0; i < properties.particleCount; i++) {
        particles.push(new Particle());
    }
}

// Animation Loop
function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Draw Connections (Lines)
        for (let j = i; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < properties.connectionDistance) {
                ctx.beginPath();
                // Opacity based on distance
                let opacity = 1 - (distance / properties.connectionDistance);
                ctx.strokeStyle = properties.lineColor + opacity + ')';
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

init();
animate();
