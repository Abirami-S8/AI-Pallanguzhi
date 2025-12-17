/**
 * Pallanguzhi Game Logic
 * Handles core game mechanics, rules, and state management
 */

class PallanguzhiGame {
    constructor() {
        this.initializeGame();
    }

    /**
     * Initialize a new game with starting positions
     */
    initializeGame() {
        // 14 pits total: 0-6 for player, 7-13 for AI
        // Each pit starts with 6 stones except the middle pits (3 and 10) which start with 12
        this.board = new Array(14).fill(6);
        this.board[3] = 12;  // Player's middle pit
        this.board[10] = 12; // AI's middle pit
        
        this.playerScore = 0;
        this.aiScore = 0;
        this.currentPlayer = 'player'; // 'player' or 'ai'
        this.gameOver = false;
        this.winner = null;
        
        // Game state tracking
        this.lastMove = null;
        this.capturedStones = 0;
        this.moveHistory = [];
    }

    /**
     * Check if a move is valid
     * @param {number} pitIndex - The pit to move from
     * @returns {boolean} - Whether the move is valid
     */
    isValidMove(pitIndex) {
        if (this.gameOver) return false;
        
        // Check if it's the correct player's turn and pit
        if (this.currentPlayer === 'player' && (pitIndex < 0 || pitIndex > 6)) {
            return false;
        }
        if (this.currentPlayer === 'ai' && (pitIndex < 7 || pitIndex > 13)) {
            return false;
        }
        
        // Check if pit has stones
        return this.board[pitIndex] > 0;
    }

    /**
     * Execute a move from the specified pit
     * @param {number} pitIndex - The pit to move from
     * @returns {Object} - Move result with details
     */
    makeMove(pitIndex) {
        if (!this.isValidMove(pitIndex)) {
            return { success: false, message: 'Invalid move' };
        }

        const stones = this.board[pitIndex];
        this.board[pitIndex] = 0;
        
        let currentPit = pitIndex;
        let stonesInHand = stones;
        const moveDetails = {
            startPit: pitIndex,
            path: [pitIndex],
            captures: [],
            bonusTurn: false
        };

        // Distribute stones counter-clockwise
        while (stonesInHand > 0) {
            currentPit = this.getNextPit(currentPit);
            this.board[currentPit]++;
            stonesInHand--;
            moveDetails.path.push(currentPit);
        }

        // Check for captures and bonus turns
        const lastPit = currentPit;
        const captureResult = this.checkCapture(lastPit, moveDetails);
        
        // Update scores if captures occurred
        if (captureResult.captured > 0) {
            if (this.currentPlayer === 'player') {
                this.playerScore += captureResult.captured;
            } else {
                this.aiScore += captureResult.captured;
            }
            moveDetails.captures = captureResult.captures;
        }

        // Check for bonus turn (last stone lands in own pit with even number)
        if (this.isOwnPit(lastPit) && this.board[lastPit] % 2 === 0 && this.board[lastPit] > 0) {
            moveDetails.bonusTurn = true;
        } else {
            // Switch players if no bonus turn
            this.currentPlayer = this.currentPlayer === 'player' ? 'ai' : 'player';
        }

        // Record move in history
        this.moveHistory.push({
            player: this.currentPlayer === 'player' ? 'ai' : 'player', // Previous player
            move: moveDetails,
            boardState: [...this.board],
            scores: { player: this.playerScore, ai: this.aiScore }
        });

        // Check for game end
        this.checkGameEnd();

        return {
            success: true,
            moveDetails: moveDetails,
            captured: captureResult.captured,
            bonusTurn: moveDetails.bonusTurn,
            gameOver: this.gameOver,
            winner: this.winner
        };
    }

    /**
     * Get the next pit in counter-clockwise direction
     * @param {number} currentPit - Current pit index
     * @returns {number} - Next pit index
     */
    getNextPit(currentPit) {
        if (currentPit >= 0 && currentPit <= 6) {
            // Player side: move right (0->1->2->3->4->5->6->7)
            return currentPit === 6 ? 7 : currentPit + 1;
        } else {
            // AI side: move right (7->8->9->10->11->12->13->0)
            return currentPit === 13 ? 0 : currentPit + 1;
        }
    }

    /**
     * Check if a pit belongs to the current player
     * @param {number} pitIndex - Pit to check
     * @returns {boolean} - Whether pit belongs to current player
     */
    isOwnPit(pitIndex) {
        if (this.currentPlayer === 'player') {
            return pitIndex >= 0 && pitIndex <= 6;
        } else {
            return pitIndex >= 7 && pitIndex <= 13;
        }
    }

    /**
     * Check for captures after a move
     * @param {number} lastPit - The pit where the last stone landed
     * @param {Object} moveDetails - Details of the current move
     * @returns {Object} - Capture result
     */
    checkCapture(lastPit, moveDetails) {
        let totalCaptured = 0;
        const captures = [];

        // Capture only occurs if last stone lands in opponent's empty pit
        if (!this.isOwnPit(lastPit) && this.board[lastPit] === 1) {
            // Look for adjacent pits with stones to capture
            const adjacentPits = this.getAdjacentPits(lastPit);
            
            for (const adjPit of adjacentPits) {
                if (this.board[adjPit] > 0) {
                    const captured = this.board[adjPit];
                    this.board[adjPit] = 0;
                    totalCaptured += captured;
                    captures.push({ pit: adjPit, stones: captured });
                }
            }

            // Also capture the pit where the stone landed
            if (totalCaptured > 0) {
                totalCaptured += this.board[lastPit];
                this.board[lastPit] = 0;
                captures.push({ pit: lastPit, stones: 1 });
            }
        }

        return { captured: totalCaptured, captures: captures };
    }

    /**
     * Get adjacent pits for capture checking
     * @param {number} pitIndex - The pit to check around
     * @returns {Array} - Array of adjacent pit indices
     */
    getAdjacentPits(pitIndex) {
        const adjacent = [];
        
        // Add left and right neighbors
        if (pitIndex > 0) adjacent.push(pitIndex - 1);
        if (pitIndex < 13) adjacent.push(pitIndex + 1);
        
        // Handle wraparound for circular board
        if (pitIndex === 0) adjacent.push(13);
        if (pitIndex === 13) adjacent.push(0);
        
        return adjacent;
    }

    /**
     * Check if the game has ended
     */
    checkGameEnd() {
        const playerSideEmpty = this.board.slice(0, 7).every(stones => stones === 0);
        const aiSideEmpty = this.board.slice(7, 14).every(stones => stones === 0);

        if (playerSideEmpty || aiSideEmpty) {
            this.gameOver = true;
            
            // Add remaining stones to respective scores
            const remainingPlayerStones = this.board.slice(0, 7).reduce((sum, stones) => sum + stones, 0);
            const remainingAiStones = this.board.slice(7, 14).reduce((sum, stones) => sum + stones, 0);
            
            this.playerScore += remainingPlayerStones;
            this.aiScore += remainingAiStones;
            
            // Determine winner
            if (this.playerScore > this.aiScore) {
                this.winner = 'player';
            } else if (this.aiScore > this.playerScore) {
                this.winner = 'ai';
            } else {
                this.winner = 'tie';
            }
        }
    }

    /**
     * Get current game state
     * @returns {Object} - Current game state
     */
    getGameState() {
        return {
            board: [...this.board],
            playerScore: this.playerScore,
            aiScore: this.aiScore,
            currentPlayer: this.currentPlayer,
            gameOver: this.gameOver,
            winner: this.winner,
            validMoves: this.getValidMoves()
        };
    }

    /**
     * Get all valid moves for the current player
     * @returns {Array} - Array of valid pit indices
     */
    getValidMoves() {
        const moves = [];
        const start = this.currentPlayer === 'player' ? 0 : 7;
        const end = this.currentPlayer === 'player' ? 6 : 13;
        
        for (let i = start; i <= end; i++) {
            if (this.board[i] > 0) {
                moves.push(i);
            }
        }
        
        return moves;
    }

    /**
     * Simulate a move without changing the actual game state
     * @param {number} pitIndex - The pit to simulate moving from
     * @returns {Object} - Simulated move result
     */
    simulateMove(pitIndex) {
        // Create a copy of the current game state
        const originalBoard = [...this.board];
        const originalPlayerScore = this.playerScore;
        const originalAiScore = this.aiScore;
        const originalCurrentPlayer = this.currentPlayer;
        const originalGameOver = this.gameOver;
        const originalWinner = this.winner;

        // Make the move
        const result = this.makeMove(pitIndex);

        // Store the simulated result
        const simulatedState = {
            board: [...this.board],
            playerScore: this.playerScore,
            aiScore: this.aiScore,
            currentPlayer: this.currentPlayer,
            gameOver: this.gameOver,
            winner: this.winner,
            moveResult: result
        };

        // Restore original state
        this.board = originalBoard;
        this.playerScore = originalPlayerScore;
        this.aiScore = originalAiScore;
        this.currentPlayer = originalCurrentPlayer;
        this.gameOver = originalGameOver;
        this.winner = originalWinner;

        return simulatedState;
    }
}