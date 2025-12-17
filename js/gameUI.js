/**
 * Game UI Controller for Pallanguzhi
 * Handles all user interface interactions and visual updates
 */

class PallanguzhiUI {
    constructor(game, ai) {
        this.game = game;
        this.ai = ai;
        this.showAIExplanations = true;
        this.animationInProgress = false;
        
        this.initializeElements();
        this.attachEventListeners();
        this.updateDisplay();
    }

    /**
     * Initialize DOM element references
     */
    initializeElements() {
        // Game controls
        this.difficultySelect = document.getElementById('difficulty');
        this.newGameBtn = document.getElementById('new-game');
        this.hintBtn = document.getElementById('hint-btn');
        this.aiExplanationToggle = document.getElementById('ai-explanation-toggle');
        
        // Score display
        this.playerScoreEl = document.getElementById('player-score');
        this.aiScoreEl = document.getElementById('ai-score');
        
        // Game status
        this.currentPlayerEl = document.getElementById('current-player');
        this.gameMessageEl = document.getElementById('game-message');
        this.aiExplanationEl = document.getElementById('ai-explanation');
        this.hintMessageEl = document.getElementById('hint-message');
        
        // Game board
        this.pits = document.querySelectorAll('.pit');
        this.playerPits = document.querySelectorAll('.player-pit');
        this.aiPits = document.querySelectorAll('.ai-pit');
    }

    /**
     * Attach event listeners to UI elements
     */
    attachEventListeners() {
        // Game controls
        this.newGameBtn.addEventListener('click', () => this.startNewGame());
        this.hintBtn.addEventListener('click', () => this.showHint());
        this.aiExplanationToggle.addEventListener('click', () => this.toggleAIExplanations());
        
        this.difficultySelect.addEventListener('change', (e) => {
            this.ai.setDifficulty(e.target.value);
            this.showMessage(`Difficulty changed to ${e.target.value}`);
        });

        // Player pit clicks
        this.playerPits.forEach(pit => {
            pit.addEventListener('click', (e) => this.handlePlayerMove(e));
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    /**
     * Handle player move clicks
     * @param {Event} e - Click event
     */
    handlePlayerMove(e) {
        if (this.animationInProgress || this.game.gameOver || this.game.currentPlayer !== 'player') {
            return;
        }

        const pitIndex = parseInt(e.target.dataset.pit);
        
        if (this.game.isValidMove(pitIndex)) {
            this.executePlayerMove(pitIndex);
        } else {
            this.showMessage('Invalid move! Choose a pit with stones.');
        }
    }

    /**
     * Execute a player move with animation
     * @param {number} pitIndex - The pit to move from
     */
    async executePlayerMove(pitIndex) {
        this.animationInProgress = true;
        this.hideMessages();
        
        const moveResult = this.game.makeMove(pitIndex);
        
        if (moveResult.success) {
            await this.animateMove(moveResult.moveDetails);
            
            if (moveResult.captured > 0) {
                this.showMessage(`You captured ${moveResult.captured} stones!`);
                await this.animateCapture(moveResult.moveDetails.captures);
            }
            
            if (moveResult.bonusTurn) {
                this.showMessage('Bonus turn! Play again.');
            }
            
            this.updateDisplay();
            
            if (moveResult.gameOver) {
                this.handleGameEnd();
            } else if (this.game.currentPlayer === 'ai') {
                // AI turn after a short delay
                setTimeout(() => this.executeAIMove(), 1000);
            }
        }
        
        this.animationInProgress = false;
    }

    /**
     * Execute AI move with animation and explanation
     */
    async executeAIMove() {
        if (this.game.gameOver || this.game.currentPlayer !== 'ai') {
            return;
        }

        this.animationInProgress = true;
        this.showMessage('AI is thinking...');
        
        // Add thinking delay based on difficulty
        const thinkingTime = this.ai.difficulty === 'hard' ? 2000 : 
                           this.ai.difficulty === 'medium' ? 1500 : 1000;
        
        await this.delay(thinkingTime);
        
        const aiChoice = this.ai.chooseBestMove(this.game);
        
        if (aiChoice.move !== null) {
            const moveResult = this.game.makeMove(aiChoice.move);
            
            if (moveResult.success) {
                await this.animateMove(moveResult.moveDetails);
                
                if (moveResult.captured > 0) {
                    await this.animateCapture(moveResult.moveDetails.captures);
                }
                
                this.updateDisplay();
                
                // Show AI explanation
                if (this.showAIExplanations) {
                    this.showAIExplanation(aiChoice.explanation);
                }
                
                if (moveResult.gameOver) {
                    this.handleGameEnd();
                } else if (moveResult.bonusTurn) {
                    this.showMessage('AI gets a bonus turn!');
                    setTimeout(() => this.executeAIMove(), 1500);
                } else {
                    this.showMessage('Your turn!');
                }
            }
        }
        
        this.animationInProgress = false;
    }

    /**
     * Animate stone movement along the path
     * @param {Object} moveDetails - Details of the move to animate
     */
    async animateMove(moveDetails) {
        const path = moveDetails.path;
        
        for (let i = 1; i < path.length; i++) {
            const pitIndex = path[i];
            const pitElement = document.querySelector(`[data-pit="${pitIndex}"]`);
            
            // Highlight the pit briefly
            pitElement.classList.add('highlighted');
            
            await this.delay(200);
            
            pitElement.classList.remove('highlighted');
            
            // Update the stone count
            this.updatePitDisplay(pitIndex);
        }
    }

    /**
     * Animate capture effect
     * @param {Array} captures - Array of captured pits
     */
    async animateCapture(captures) {
        for (const capture of captures) {
            const pitElement = document.querySelector(`[data-pit="${capture.pit}"]`);
            pitElement.classList.add('capturing');
            
            await this.delay(400);
            
            pitElement.classList.remove('capturing');
            this.updatePitDisplay(capture.pit);
        }
    }

    /**
     * Update the entire display
     */
    updateDisplay() {
        this.updateBoard();
        this.updateScores();
        this.updateCurrentPlayer();
        this.updatePitStates();
    }

    /**
     * Update all pit displays
     */
    updateBoard() {
        this.pits.forEach((pit, index) => {
            const pitIndex = parseInt(pit.dataset.pit);
            this.updatePitDisplay(pitIndex);
        });
    }

    /**
     * Update a single pit display
     * @param {number} pitIndex - Index of the pit to update
     */
    updatePitDisplay(pitIndex) {
        const pitElement = document.querySelector(`[data-pit="${pitIndex}"]`);
        const stones = this.game.board[pitIndex];
        pitElement.textContent = stones;
        
        // Add visual feedback for empty pits
        if (stones === 0) {
            pitElement.style.opacity = '0.5';
        } else {
            pitElement.style.opacity = '1';
        }
    }

    /**
     * Update score displays
     */
    updateScores() {
        this.playerScoreEl.textContent = this.game.playerScore;
        this.aiScoreEl.textContent = this.game.aiScore;
    }

    /**
     * Update current player display
     */
    updateCurrentPlayer() {
        if (this.game.gameOver) {
            this.currentPlayerEl.textContent = 'Game Over';
            return;
        }

        if (this.game.currentPlayer === 'player') {
            this.currentPlayerEl.textContent = 'உங்கள் முறை (Your Turn)';
        } else {
            this.currentPlayerEl.textContent = 'கணினி முறை (AI Turn)';
        }
    }

    /**
     * Update pit states (enabled/disabled)
     */
    updatePitStates() {
        this.playerPits.forEach(pit => {
            const pitIndex = parseInt(pit.dataset.pit);
            const isValid = this.game.currentPlayer === 'player' && 
                           this.game.isValidMove(pitIndex) && 
                           !this.animationInProgress;
            
            if (isValid) {
                pit.classList.remove('disabled');
            } else {
                pit.classList.add('disabled');
            }
        });
    }

    /**
     * Show a game message
     * @param {string} message - Message to display
     */
    showMessage(message) {
        this.gameMessageEl.textContent = message;
        this.gameMessageEl.style.display = 'block';
    }

    /**
     * Show AI explanation
     * @param {string} explanation - AI move explanation
     */
    showAIExplanation(explanation) {
        if (!this.showAIExplanations) return;
        
        this.aiExplanationEl.innerHTML = `
            <h4>AI Move Explanation:</h4>
            <p>${explanation}</p>
        `;
        this.aiExplanationEl.classList.remove('hidden');
    }

    /**
     * Show hint for player
     */
    showHint() {
        if (this.game.currentPlayer !== 'player' || this.game.gameOver) {
            this.showMessage('Hints are only available during your turn.');
            return;
        }

        const hint = this.ai.suggestPlayerMove(this.game);
        
        if (hint.move !== null) {
            // Highlight the suggested pit
            const suggestedPit = document.querySelector(`[data-pit="${hint.move}"]`);
            suggestedPit.classList.add('highlighted');
            
            setTimeout(() => {
                suggestedPit.classList.remove('highlighted');
            }, 3000);
            
            this.hintMessageEl.innerHTML = `
                <strong>Hint:</strong> ${hint.explanation}
            `;
            this.hintMessageEl.classList.remove('hidden');
            
            // Hide hint after 5 seconds
            setTimeout(() => {
                this.hintMessageEl.classList.add('hidden');
            }, 5000);
        }
    }

    /**
     * Toggle AI explanations on/off
     */
    toggleAIExplanations() {
        this.showAIExplanations = !this.showAIExplanations;
        
        if (this.showAIExplanations) {
            this.aiExplanationToggle.textContent = 'Hide AI Explanations';
            this.showMessage('AI explanations enabled');
        } else {
            this.aiExplanationToggle.textContent = 'Show AI Explanations';
            this.aiExplanationEl.classList.add('hidden');
            this.showMessage('AI explanations disabled');
        }
    }

    /**
     * Hide all messages
     */
    hideMessages() {
        this.aiExplanationEl.classList.add('hidden');
        this.hintMessageEl.classList.add('hidden');
    }

    /**
     * Start a new game
     */
    startNewGame() {
        this.game.initializeGame();
        this.hideMessages();
        this.updateDisplay();
        this.showMessage('New game started! Make your move.');
    }

    /**
     * Handle game end
     */
    handleGameEnd() {
        let message = '';
        
        if (this.game.winner === 'player') {
            message = `🎉 வெற்றி! (Victory!) You won with ${this.game.playerScore} stones!`;
        } else if (this.game.winner === 'ai') {
            message = `AI wins with ${this.game.aiScore} stones. Better luck next time!`;
        } else {
            message = `It's a tie! Both players scored ${this.game.playerScore} stones.`;
        }
        
        this.gameMessageEl.innerHTML = `<div class="game-over">${message}</div>`;
        this.currentPlayerEl.textContent = 'Game Over';
    }

    /**
     * Handle keyboard input
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyPress(e) {
        if (this.game.currentPlayer !== 'player' || this.animationInProgress) {
            return;
        }

        // Number keys 1-7 for pit selection
        const key = parseInt(e.key);
        if (key >= 1 && key <= 7) {
            const pitIndex = key - 1; // Convert to 0-based index
            if (this.game.isValidMove(pitIndex)) {
                this.executePlayerMove(pitIndex);
            }
        }
        
        // Other shortcuts
        switch (e.key.toLowerCase()) {
            case 'h':
                this.showHint();
                break;
            case 'n':
                this.startNewGame();
                break;
            case 'e':
                this.toggleAIExplanations();
                break;
        }
    }

    /**
     * Utility function for delays
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} - Promise that resolves after delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}