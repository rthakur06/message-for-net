/**
 * Animation Utilities
 * Helper functions for managing animations and effects
 */

const AnimationUtils = {
    /**
     * Apply a CSS animation to an element
     * @param {HTMLElement} element - The element to animate
     * @param {string} animationClass - The animation class to apply
     * @param {number} duration - Duration in milliseconds (optional)
     * @returns {Promise} - Resolves when animation completes
     */
    animate(element, animationClass, duration = 400) {
        return new Promise((resolve) => {
            element.classList.add(animationClass);

            const handleAnimationEnd = () => {
                element.classList.remove(animationClass);
                element.removeEventListener('animationend', handleAnimationEnd);
                resolve();
            };

            element.addEventListener('animationend', handleAnimationEnd);

            // Fallback timeout in case animationend doesn't fire
            setTimeout(() => {
                element.classList.remove(animationClass);
                resolve();
            }, duration + 100);
        });
    },

    /**
     * Force restart an animation by removing and re-adding the class
     * @param {HTMLElement} element - The element to reset
     * @param {string} animationClass - The animation class
     */
    restartAnimation(element, animationClass) {
        element.classList.remove(animationClass);
        // Trigger reflow to restart animation
        void element.offsetWidth;
        element.classList.add(animationClass);
    },

    /**
     * Create a floating heart element
     * @returns {HTMLElement} - The heart element
     */
    createFloatingHeart() {
        const heart = document.createElement('span');
        heart.className = 'floating-heart';
        heart.textContent = ['💖', '💕', '💗', '💓', '❤️', '💘'][Math.floor(Math.random() * 6)];

        // Random horizontal position
        heart.style.left = Math.random() * 100 + '%';

        // Random starting position from bottom
        heart.style.bottom = '-50px';

        // Random size
        const size = 0.8 + Math.random() * 1.2;
        heart.style.fontSize = size + 'rem';

        // Random animation duration
        const duration = 3 + Math.random() * 3;
        heart.style.animationDuration = duration + 's';

        // Random delay for natural feel
        heart.style.animationDelay = Math.random() * 0.5 + 's';

        return heart;
    },

    /**
     * Start the floating hearts animation for the end screen
     * @param {HTMLElement} container - The container for hearts
     * @param {number} interval - Interval between hearts in ms
     */
    startHeartAnimation(container, interval = 300) {
        if (!container) return;

        const spawnHeart = () => {
            const heart = this.createFloatingHeart();
            container.appendChild(heart);

            // Remove heart after animation completes
            heart.addEventListener('animationend', () => {
                heart.remove();
            });
        };

        // Initial burst of hearts
        for (let i = 0; i < 5; i++) {
            setTimeout(spawnHeart, i * 200);
        }

        // Continuous spawning
        return setInterval(spawnHeart, interval);
    },

    /**
     * Stop the floating hearts animation
     * @param {number} intervalId - The interval ID to clear
     */
    stopHeartAnimation(intervalId) {
        if (intervalId) {
            clearInterval(intervalId);
        }
    },

    /**
     * Create a particle burst effect at a position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {HTMLElement} container - Container element
     */
    createParticleBurst(x, y, container) {
        const particles = ['✨', '⭐', '💫', '🌟'];
        const count = 6;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('span');
            particle.className = 'particle';
            particle.textContent = particles[Math.floor(Math.random() * particles.length)];
            particle.style.position = 'fixed';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            particle.style.fontSize = '1.5rem';

            // Random direction
            const angle = (i / count) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            particle.style.transition = 'all 0.5s ease-out';

            container.appendChild(particle);

            // Trigger animation
            requestAnimationFrame(() => {
                particle.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
                particle.style.opacity = '0';
            });

            // Remove after animation
            setTimeout(() => particle.remove(), 600);
        }
    }
};

// Make available globally
window.AnimationUtils = AnimationUtils;
