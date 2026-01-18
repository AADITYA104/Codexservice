document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.service-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate rotation (max 10 degrees)
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            card.style.zIndex = '10';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            card.style.zIndex = '1';

            // Add a slight delay to the reset transition for smoothness
            card.style.transition = 'transform 0.5s ease';
            setTimeout(() => {
                card.style.transition = 'all 0.1s ease'; // Reset transition to fast for mousemove
            }, 500);
        });

        // Remove transition during movement for instant response
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });
});
