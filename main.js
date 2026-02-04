/**
 * Main App Controller
 * Handles screen transitions and button interactions
 */

const App = {
    // State
    currentScreen: 1,
    noClickCount: 0,
    maxNoClicks: 5,
    heartAnimationInterval: null,

    // Button scaling
    yesButtonScale: 1,
    yesButtonScaleIncrement: 0.15,
    noButtonScale: 1,
    noButtonScaleDecrement: 0.1,

    // Elements
    elements: {},

    /**
     * Initialize the app
     */
    init() {
        // Cache DOM elements
        this.elements = {
            screen0: document.getElementById('screen0'),
            screen1: document.getElementById('screen1'),
            screen2: document.getElementById('screen2'),
            screen3: document.getElementById('screen3'),
            continueBtn: document.getElementById('continueBtn'),
            yesBtn: document.getElementById('yesBtn'),
            noBtn: document.getElementById('noBtn'),
            restartBtn: document.getElementById('restartBtn'),
            heartsContainer: document.getElementById('heartsContainer')
        };

        // Set up event listeners
        this.setupEventListeners();

        // Initialize gift boxes
        GiftBoxes.init();
        GiftBoxes.onAllOpened = () => this.transitionToScreen(3);
    },

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Continue button (start screen)
        this.elements.continueBtn.addEventListener('click', () => this.transitionToScreen(1));
        this.elements.continueBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.transitionToScreen(1);
        });

        // Yes button
        this.elements.yesBtn.addEventListener('click', () => this.handleYesClick());
        this.elements.yesBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.handleYesClick();
        });

        // No button
        this.elements.noBtn.addEventListener('click', (e) => this.handleNoClick(e));
        this.elements.noBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.handleNoClick(e);
        });

        // Restart button
        this.elements.restartBtn.addEventListener('click', () => this.restartApp());
        this.elements.restartBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.restartApp();
        });
    },

    /**
     * Handle Yes button click
     */
    handleYesClick() {
        AnimationUtils.animate(this.elements.yesBtn, 'animate-bounce', 500);
        setTimeout(() => this.transitionToScreen(2), 300);
    },

    /**
     * Handle No button click
     * @param {Event} event - Click event
     */
    handleNoClick(event) {
        this.noClickCount++;

        // Check if No button should convert to Yes
        if (this.noClickCount >= this.maxNoClicks) {
            this.convertNoToYes();
            return;
        }

        // Grow Yes button
        this.yesButtonScale += this.yesButtonScaleIncrement;
        this.elements.yesBtn.style.transform = `scale(${this.yesButtonScale})`;
        AnimationUtils.animate(this.elements.yesBtn, 'animate-grow', 300);

        // Shrink No button
        this.noButtonScale = Math.max(0.6, this.noButtonScale - this.noButtonScaleDecrement);

        // Move No button to random position
        this.moveNoButton();

        // Animate No button
        AnimationUtils.animate(this.elements.noBtn, 'animate-wiggle', 300);
    },

    /**
     * Move No button to a random position within viewport
     */
    moveNoButton() {
        const btn = this.elements.noBtn;
        const btnRect = btn.getBoundingClientRect();

        // Get viewport dimensions with padding
        const padding = 20;
        const maxX = window.innerWidth - btnRect.width - padding;
        const maxY = window.innerHeight - btnRect.height - padding;

        // Calculate random position
        let newX = padding + Math.random() * (maxX - padding);
        let newY = padding + Math.random() * (maxY - padding);

        // Avoid the Yes button area
        const yesRect = this.elements.yesBtn.getBoundingClientRect();
        const avoidPadding = 100;

        // Check if new position overlaps with Yes button
        const overlapsYes = (
            newX < yesRect.right + avoidPadding &&
            newX + btnRect.width > yesRect.left - avoidPadding &&
            newY < yesRect.bottom + avoidPadding &&
            newY + btnRect.height > yesRect.top - avoidPadding
        );

        // If overlapping, try to move away
        if (overlapsYes) {
            if (newX < yesRect.left) {
                newX = Math.max(padding, yesRect.left - btnRect.width - avoidPadding);
            } else {
                newX = Math.min(maxX, yesRect.right + avoidPadding);
            }
        }

        // Apply new position
        if (!btn.classList.contains('repositioned')) {
            btn.classList.add('repositioned');
        }

        btn.style.left = newX + 'px';
        btn.style.top = newY + 'px';
        btn.style.transform = `scale(${this.noButtonScale})`;
    },

    /**
     * Convert No button to Yes button after max clicks
     */
    convertNoToYes() {
        const btn = this.elements.noBtn;

        // Update text and style
        btn.textContent = 'Yes 💖';
        btn.classList.add('converted');

        // Add click handler to behave like Yes button
        btn.removeEventListener('click', this.handleNoClick);
        btn.addEventListener('click', () => this.handleYesClick());

        // Animate the transformation
        AnimationUtils.animate(btn, 'animate-bounce', 500);
    },

    /**
     * Transition to a specific screen
     * @param {number} screenNumber - Screen to transition to (1, 2, or 3)
     */
    transitionToScreen(screenNumber) {
        const currentScreenEl = document.querySelector('.screen.active');
        const nextScreenEl = document.getElementById(`screen${screenNumber}`);

        if (!nextScreenEl || currentScreenEl === nextScreenEl) return;

        // Animate out current screen
        currentScreenEl.classList.add('animate-screen-out');

        setTimeout(() => {
            // Hide current screen
            currentScreenEl.classList.remove('active', 'animate-screen-out');

            // Show next screen
            nextScreenEl.classList.add('active', 'animate-screen-in');

            // Update state
            this.currentScreen = screenNumber;

            // Start heart animation on screen 3
            if (screenNumber === 3) {
                this.startEndScreenEffects();
            }

            // Clean up animation class
            setTimeout(() => {
                nextScreenEl.classList.remove('animate-screen-in');
            }, 500);
        }, 400);
    },

    /**
     * Start end screen visual effects
     */
    startEndScreenEffects() {
        this.heartAnimationInterval = AnimationUtils.startHeartAnimation(
            this.elements.heartsContainer,
            400
        );
    },

    /**
     * Restart the app from the beginning
     */
    restartApp() {
        // Stop heart animation
        if (this.heartAnimationInterval) {
            clearInterval(this.heartAnimationInterval);
            this.heartAnimationInterval = null;
        }

        // Clear hearts container
        this.elements.heartsContainer.innerHTML = '';

        // Reset state
        this.currentScreen = 0;
        this.noClickCount = 0;
        this.yesButtonScale = 1;
        this.noButtonScale = 1;

        // Reset Yes button
        this.elements.yesBtn.style.transform = 'scale(1)';

        // Reset No button
        const noBtn = this.elements.noBtn;
        noBtn.textContent = 'No, I hate you';
        noBtn.classList.remove('converted', 'repositioned');
        noBtn.style.cssText = '';

        // Reset gift boxes
        GiftBoxes.reset();

        // Transition to start screen
        this.transitionToScreen(0);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Make available globally for debugging
window.App = App;
