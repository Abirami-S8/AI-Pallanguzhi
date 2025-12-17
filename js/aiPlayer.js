/**
 * AI Player for Pallanguzhi Game
 * Implements strategic decision-making with multiple difficulty levels
 */

class PallanguzhiAI {
    constructor(difficulty = 'medium') {
        this.difficulty = difficulty;
        this.maxDepth = this.getMaxDepth(difficulty);
        this.lastExplanation = '';
    }

    /**
     * Get maximum search depth based on difficulty
     * @param {string} difficulty - AI difficulty level
     * @returns {number} - Maximum search depth
     */
    getMaxDepth(difficulty) {
        switch (difficulty) {
            case 'easy': return 2;
            case 'medium': return 4;
            case 'hard': return 6;
            default: return 4;
        }
    }

    /**
     * Set AI difficulty level
     * @param {string} difficulty - New difficulty level
     */
    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        this.maxDepth = this.getMaxDepth(difficulty);
    }

    /**
     * Choose the best move for the AI
     * @param {PallanguzhiGame} game - Current game instance
     * @returns {Object} - Best move with explanation
     */
    chooseBestMove(game) {
        const validMoves = game.getValidMoves();
        
        if (validMoves.length === 0) {
            return { move: null, explanation: 'No valid moves available.' };
        }

        if (validMoves.length === 1) {
            const explanation = `Only one move available from pit ${validMoves[0] + 1}.`;
            this.lastExplanation = explanation;
            return { move: validMoves[0], explanation: explanation };
        }

        // Use minimax algorithm with alpha-beta pruning
        const bestMove = this.minimax(game, this.maxDepth, true, -Infinity, Infinity);
        
        // Generate explanation for the chosen move
        const explanation = this.generateMoveExplanation(game, bestMove.move);
        this.lastExplanation = explanation;
        
        return { move: bestMove.move, explanation: explanation };
    }

    /**
     * Minimax algorithm with alpha-beta pruning
     * @param {PallanguzhiGame} game - Game instance
     * @param {number} depth - Current search depth
     * @param {boolean} isMaximizing - Whether this is a maximizing node
     * @param {number} alpha - Alpha value for pruning
     * @param {number} beta - Beta value for pruning
     * @returns {Object} - Best move and its score
     */
    minimax(game, depth, isMaximizing, alpha, beta) {
        // Base case: reached maximum depth or game over
        if (depth === 0 || game.gameOver) {
            return { score: this.evaluatePosition(game), move: null };
        }

        const validMoves = game.getValidMoves();
        let bestMove = null;

        if (isMaximizing) {
            let maxScore = -Infinity;
            
            for (const move of validMoves) {
                const simulatedState = game.simulateMove(move);
                
                // Create temporary game instance for recursion
                const tempGame = new PallanguzhiGame();
                Object.assign(tempGame, simulatedState);
                
                const result = this.minimax(tempGame, depth - 1, false, alpha, beta);
                
                if (result.score > maxScore) {
                    maxScore = result.score;
                    bestMove = move;
                }
                
                alpha = Math.max(alpha, result.score);
                if (beta <= alpha) {
                    break; // Alpha-beta pruning
                }
            }
            
            return { score: maxScore, move: bestMove };
        } else {
            let minScore = Infinity;
            
            for (const move of validMoves) {
                const simulatedState = game.simulateMove(move);
                
                // Create temporary game instance for recursion
                const tempGame = new PallanguzhiGame();
                Object.assign(tempGame, simulatedState);
                
                const result = this.minimax(tempGame, depth - 1, true, alpha, beta);
                
                if (result.score < minScore) {
                    minScore = result.score;
                    bestMove = move;
                }
                
                beta = Math.min(beta, result.score);
                if (beta <= alpha) {
                    break; // Alpha-beta pruning
                }
            }
            
            return { score: minScore, move: bestMove };
        }
    }

    /**
     * Evaluate the current position from AI's perspective
     * @param {PallanguzhiGame} game - Game instance to evaluate
     * @returns {number} - Position evaluation score
     */
    evaluatePosition(game) {
        if (game.gameOver) {
            if (game.winner === 'ai') return 1000;
            if (game.winner === 'player') return -1000;
            return 0; // Tie
        }

        let score = 0;

        // Basic score difference
        score += (game.aiScore - game.playerScore) * 10;

        // Stone distribution advantage
        const aiStones = game.board.slice(7, 14).reduce((sum, stones) => sum + stones, 0);
        const playerStones = game.board.slice(0, 7).reduce((sum, stones) => sum + stones, 0);
        score += (aiStones - playerStones) * 2;

        // Mobility (number of valid moves)
        const currentPlayer = game.currentPlayer;
        game.currentPlayer = 'ai';
        const aiMoves = game.getValidMoves().length;
        game.currentPlayer = 'player';
        const playerMoves = game.getValidMoves().length;
        game.currentPlayer = currentPlayer;
        
        score += (aiMoves - playerMoves) * 5;

        // Strategic pit control
        score += this.evaluateStrategicPositions(game);

        // Capture opportunities
        score += this.evaluateCaptureOpportunities(game);

        return score;
    }

    /**
     * Evaluate strategic positions on the board
     * @param {PallanguzhiGame} game - Game instance
     * @returns {number} - Strategic position score
     */
    evaluateStrategicPositions(game) {
        let score = 0;

        // Favor having stones in middle pits (more options)
        score += game.board[10] * 2; // AI middle pit
        score -= game.board[3] * 2;  // Player middle pit

        // Favor having stones in corner pits (capture opportunities)
        score += game.board[7] + game.board[13];
        score -= game.board[0] + game.board[6];

        // Penalize empty pits (less mobility)
        for (let i = 7; i <= 13; i++) {
            if (game.board[i] === 0) score -= 3;
        }
        for (let i = 0; i <= 6; i++) {
            if (game.board[i] === 0) score += 3;
        }

        return score;
    }

    /**
     * Evaluate capture opportunities
     * @param {PallanguzhiGame} game - Game instance
     * @returns {number} - Capture opportunity score
     */
    evaluateCaptureOpportunities(game) {
        let score = 0;

        // Check for immediate capture opportunities
        const validMoves = game.getValidMoves();
        for (const move of validMoves) {
            const simulatedState = game.simulateMove(move);
            if (simulatedState.moveResult.captured > 0) {
                score += simulatedState.moveResult.captured * 15;
            }
        }

        return score;
    }

    /**
     * Generate natural language explanation for a move
     * @param {PallanguzhiGame} game - Game instance
     * @param {number} move - The chosen move
     * @returns {string} - Move explanation
     */
    generateMoveExplanation(game, move) {
        const simulatedState = game.simulateMove(move);
        const moveResult = simulatedState.moveResult;
        const pitNumber = move - 6; // Convert to 1-7 for AI pits
        
        let explanation = `AI chose pit ${pitNumber} `;

        // Explain the basic move
        const stones = game.board[move];
        explanation += `(${stones} stones). `;

        // Explain captures
        if (moveResult.captured > 0) {
            explanation += `This move captures ${moveResult.captured} stones! `;
            
            if (this.difficulty === 'hard') {
                explanation += `The stones landed in an empty opponent pit, allowing capture of adjacent pits. `;
            }
        }

        // Explain bonus turn
        if (moveResult.bonusTurn) {
            explanation += `Earned a bonus turn by landing the last stone in own pit with even number. `;
        }

        // Strategic reasoning based on difficulty
        if (this.difficulty === 'medium' || this.difficulty === 'hard') {
            const strategicReason = this.getStrategicReason(game, move, simulatedState);
            if (strategicReason) {
                explanation += strategicReason;
            }
        }

        return explanation;
    }

    /**
     * Get strategic reasoning for a move
     * @param {PallanguzhiGame} game - Original game state
     * @param {number} move - The chosen move
     * @param {Object} simulatedState - State after the move
     * @returns {string} - Strategic reasoning
     */
    getStrategicReason(game, move, simulatedState) {
        const scoreDiff = simulatedState.aiScore - simulatedState.playerScore;
        const originalScoreDiff = game.aiScore - game.playerScore;
        
        if (scoreDiff > originalScoreDiff + 5) {
            return "This move significantly improves AI's position. ";
        }
        
        if (move === 10) { // Middle pit
            return "Playing from the middle pit provides maximum distribution options. ";
        }
        
        if (move === 7 || move === 13) { // Corner pits
            return "Corner pit moves can create capture opportunities. ";
        }
        
        const aiStones = simulatedState.board.slice(7, 14).reduce((sum, s) => sum + s, 0);
        const playerStones = simulatedState.board.slice(0, 7).reduce((sum, s) => sum + s, 0);
        
        if (aiStones > playerStones + 10) {
            return "This maintains AI's stone advantage on the board. ";
        }
        
        return "This move maintains good strategic position. ";
    }

    /**
     * Suggest the best move for the human player (hint mode)
     * @param {PallanguzhiGame} game - Current game instance
     * @returns {Object} - Best move suggestion with explanation
     */
    suggestPlayerMove(game) {
        if (game.currentPlayer !== 'player') {
            return { move: null, explanation: 'It is not the player\'s turn.' };
        }

        // Temporarily switch to player perspective for evaluation
        const originalCurrentPlayer = game.currentPlayer;
        
        // Use a simplified minimax for player hints
        const validMoves = game.getValidMoves();
        let bestMove = null;
        let bestScore = -Infinity;
        
        for (const move of validMoves) {
            const simulatedState = game.simulateMove(move);
            
            // Evaluate from player's perspective (negative of AI evaluation)
            const tempGame = new PallanguzhiGame();
            Object.assign(tempGame, simulatedState);
            const score = -this.evaluatePosition(tempGame);
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        
        game.currentPlayer = originalCurrentPlayer;
        
        const explanation = this.generatePlayerHint(game, bestMove);
        
        return { move: bestMove, explanation: explanation };
    }

    /**
     * Generate hint explanation for player
     * @param {PallanguzhiGame} game - Game instance
     * @param {number} move - Suggested move
     * @returns {string} - Hint explanation
     */
    generatePlayerHint(game, move) {
        if (move === null) return 'No valid moves available.';
        
        const simulatedState = game.simulateMove(move);
        const moveResult = simulatedState.moveResult;
        const pitNumber = move + 1; // Convert to 1-7 for player pits
        
        let hint = `Consider playing pit ${pitNumber}. `;
        
        if (moveResult.captured > 0) {
            hint += `This move will capture ${moveResult.captured} stones! `;
        }
        
        if (moveResult.bonusTurn) {
            hint += `You'll get a bonus turn. `;
        }
        
        if (moveResult.captured === 0 && !moveResult.bonusTurn) {
            hint += `This move maintains good board position and mobility. `;
        }
        
        return hint;
    }

    /**
     * Get the last move explanation
     * @returns {string} - Last explanation generated
     */
    getLastExplanation() {
        return this.lastExplanation;
    }
}