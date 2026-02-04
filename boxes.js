/**
 * Gift Box Logic
 * Handles the mystery gift box interactions and reveals
 */

const GiftBoxes = {
    // Gift data for each box
    gifts: [
        {
            emoji: '🌸',
            title: 'Flowers',
            caption: 'Because every day with you deserves a little extra color.'
        },
        {
            emoji: '🍬',
            title: 'PB&J M&Ms',
            caption: 'Because you love PB&Js… and now they love you back.'
        },
        {
            emoji: '🍓',
            title: 'Chocolate covered raspberries',
            caption: 'Because berries are good, but berries in chocolate are elite.'
        }
    ],

    // State for each box
    boxStates: {},

    // Configuration
    clicksToOpen: 5,
    scaleIncrement: 0.06,
    baseScale: 1,

    // Callback when all boxes are opened
    onAllOpened: null,

    /**
     * Initialize the gift boxes
     */
    init() {
        const boxes = document.querySelectorAll('.gift-box');

        boxes.forEach((box, index) => {
            // Initialize state
            this.boxStates[index] = {
                clicks: 0,
                opened: false,
                scale: this.baseScale
            };

            // Add click handler
            box.addEventListener('click', (e) => this.handleBoxClick(box, index, e));
            box.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleBoxClick(box, index, e);
            });
        });
    },

    /**
     * Handle box click
     * @param {HTMLElement} box - The box element
     * @param {number} index - Box index
     * @param {Event} event - Click event
     */
    handleBoxClick(box, index, event) {
        const state = this.boxStates[index];

        // Ignore if already opened
        if (state.opened) return;

        // Increment click count
        state.clicks++;

        // Update scale
        state.scale += this.scaleIncrement;
        box.style.transform = `scale(${state.scale})`;

        // Play click animation
        const wrapper = box.querySelector('.box-wrapper');
        AnimationUtils.animate(wrapper, 'animate-shake', 400);

        // Add glow effect on progress
        const glowIntensity = (state.clicks / this.clicksToOpen) * 0.8;
        box.style.boxShadow = `0 0 ${20 + state.clicks * 8}px rgba(255, 107, 157, ${glowIntensity})`;

        // Check if box should open
        if (state.clicks >= this.clicksToOpen) {
            this.openBox(box, index);
        }
    },

    /**
     * Open a gift box and reveal content
     * @param {HTMLElement} box - The box element
     * @param {number} index - Box index
     */
    async openBox(box, index) {
        const state = this.boxStates[index];
        state.opened = true;

        const wrapper = box.querySelector('.box-wrapper');
        const reveal = box.querySelector('.gift-reveal');
        const gift = this.gifts[index];

        // Mark as opened
        box.classList.add('opened');

        // Play pop animation on wrapper
        await AnimationUtils.animate(wrapper, 'animate-pop', 400);

        // Hide wrapper, show reveal
        wrapper.style.display = 'none';
        reveal.classList.remove('hidden');

        // Reset box transform
        box.style.transform = 'scale(1)';
        box.style.boxShadow = '';

        // Animate reveal content
        AnimationUtils.animate(reveal, 'animate-slide-up', 500);

        // Create particle burst at box center
        const rect = box.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        AnimationUtils.createParticleBurst(centerX, centerY, document.body);

        // Check if all boxes are opened
        this.checkAllOpened();
    },

    /**
     * Check if all boxes have been opened
     */
    checkAllOpened() {
        const allOpened = Object.values(this.boxStates).every(state => state.opened);

        if (allOpened && this.onAllOpened) {
            // Delay before transitioning to end screen
            setTimeout(() => {
                this.onAllOpened();
            }, 2000);
        }
    },

    /**
     * Reset all boxes (for testing)
     */
    reset() {
        const boxes = document.querySelectorAll('.gift-box');

        boxes.forEach((box, index) => {
            this.boxStates[index] = {
                clicks: 0,
                opened: false,
                scale: this.baseScale
            };

            box.classList.remove('opened');
            box.style.transform = '';
            box.style.boxShadow = '';

            const wrapper = box.querySelector('.box-wrapper');
            const reveal = box.querySelector('.gift-reveal');

            wrapper.style.display = '';
            reveal.classList.add('hidden');
        });
    }
};

// Make available globally
window.GiftBoxes = GiftBoxes;
