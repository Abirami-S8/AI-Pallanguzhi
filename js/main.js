/**
 * Main application entry point for Pallanguzhi Game
 * Initializes game components and starts the application
 */

// Global game instances
let game;
let ai;
let ui;

/**
 * Initialize the game when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
    setupGlobalEventListeners();
    showWelcomeMessage();
});

/**
 * Initialize all game components
 */
function initializeGame() {
    try {
        // Create game instances
        game = new PallanguzhiGame();
        ai = new PallanguzhiAI('medium');
        ui = new PallanguzhiUI(game, ai);
        
        console.log('Pallanguzhi game initialized successfully');
    } catch (error) {
        console.error('Error initializing game:', error);
        showErrorMessage('Failed to initialize game. Please refresh the page.');
    }
}

/**
 * Setup global event listeners
 */
function setupGlobalEventListeners() {
    // Handle window resize for responsive design
    window.addEventListener('resize', handleWindowResize);
    
    // Handle visibility change (pause/resume)
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Handle beforeunload for game state warning
    window.addEventListener('beforeunload', handleBeforeUnload);
}

/**
 * Show welcome message with game instructions
 */
function showWelcomeMessage() {
    const welcomeMessage = `
        <div style="text-align: center; padding: 20px; background: rgba(255, 215, 0, 0.1); border-radius: 10px; margin-bottom: 20px;">
            <h3>வணக்கம்! Welcome to Pallanguzhi!</h3>
            <p><strong>How to play:</strong></p>
            <ul style="text-align: left; display: inline-block;">
                <li>Click on your pits (bottom row) to move stones</li>
                <li>Stones move counter-clockwise around the board</li>
                <li>Capture stones by landing in empty opponent pits</li>
                <li>Get bonus turns by landing in your own pits with even numbers</li>
                <li>Game ends when one side is empty</li>
            </ul>
            <p><strong>Controls:</strong> Use number keys 1-7, 'H' for hints, 'N' for new game</p>
        </div>
    `;
    
    const gameContainer = document.querySelector('.game-container');
    const welcomeDiv = document.createElement('div');
    welcomeDiv.innerHTML = welcomeMessage;
    welcomeDiv.id = 'welcome-message';
    
    gameContainer.insertBefore(welcomeDiv, gameContainer.firstChild);
    
    // Auto-hide welcome message after 10 seconds
    setTimeout(() => {
        const welcomeEl = document.getElementById('welcome-message');
        if (welcomeEl) {
            welcomeEl.style.transition = 'opacity 1s ease-out';
            welcomeEl.style.opacity = '0';
            setTimeout(() => welcomeEl.remove(), 1000);
        }
    }, 10000);
}

/**
 * Handle window resize events
 */
function handleWindowResize() {
    // Adjust game board layout for different screen sizes
    const gameBoard = document.querySelector('.game-board');
    const container = document.querySelector('.game-container');
    
    if (window.innerWidth < 768) {
        gameBoard.classList.add('mobile-layout');
        container.classList.add('mobile-container');
    } else {
        gameBoard.classList.remove('mobile-layout');
        container.classList.remove('mobile-container');
    }
}

/**
 * Handle page visibility changes
 */
function handleVisibilityChange() {
    if (document.hidden) {
        // Page is hidden - pause any ongoing animations
        if (ui && ui.animationInProgress) {
            console.log('Page hidden - pausing animations');
        }
    } else {
        // Page is visible - resume if needed
        console.log('Page visible - resuming game');
    }
}

/**
 * Handle before page unload
 */
function handleBeforeUnload(e) {
    // Warn user if game is in progress
    if (game && !game.gameOver && (game.playerScore > 0 || game.aiScore > 0)) {
        e.preventDefault();
        e.returnValue = 'You have a game in progress. Are you sure you want to leave?';
        return e.returnValue;
    }
}

/**
 * Show error message to user
 * @param {string} message - Error message to display
 */
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
        <div style="background: #ffebee; border: 2px solid #f44336; border-radius: 8px; padding: 15px; margin: 20px; color: #c62828;">
            <strong>Error:</strong> ${message}
        </div>
    `;
    
    document.body.insertBefore(errorDiv, document.body.firstChild);
    
    // Auto-remove error after 5 seconds
    setTimeout(() => errorDiv.remove(), 5000);
}

/**
 * Debug function to log game state (for development)
 */
function debugGameState() {
    if (game) {
        console.log('=== Game State Debug ===');
        console.log('Board:', game.board);
        console.log('Player Score:', game.playerScore);
        console.log('AI Score:', game.aiScore);
        console.log('Current Player:', game.currentPlayer);
        console.log('Game Over:', game.gameOver);
        console.log('Valid Moves:', game.getValidMoves());
        console.log('=====================');
    }
}

/**
 * Export debug function to global scope for console access
 */
window.debugGameState = debugGameState;

/**
 * Performance monitoring
 */
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }
}

// Initialize performance monitoring
monitorPerformance();

/**
 * Service Worker registration for offline support (future enhancement)
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}

// Uncomment to enable service worker
// registerServiceWorker();

/**
 * Game analytics (placeholder for future implementation)
 */
const GameAnalytics = {
    trackGameStart: () => {
        console.log('Game started');
    },
    
    trackGameEnd: (winner, duration) => {
        console.log(`Game ended - Winner: ${winner}, Duration: ${duration}ms`);
    },
    
    trackMove: (player, pit, captured) => {
        console.log(`Move - Player: ${player}, Pit: ${pit}, Captured: ${captured}`);
    },
    
    trackDifficultyChange: (difficulty) => {
        console.log(`Difficulty changed to: ${difficulty}`);
    }
};

// Export analytics for use in other modules
window.GameAnalytics = GameAnalytics;