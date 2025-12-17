---
inclusion: fileMatch
fileMatchPattern: '**/aiPlayer.js'
---

# AI Development Guide for Pallanguzhi

## AI Strategy Implementation

### Minimax Algorithm
- **Easy**: 2-move lookahead, basic position evaluation
- **Medium**: 4-move lookahead, strategic position factors
- **Hard**: 6-move lookahead, advanced capture prediction

### Position Evaluation Factors
1. **Score Difference** (Weight: 10x)
   - Direct score advantage/disadvantage
   
2. **Stone Distribution** (Weight: 2x)
   - Total stones remaining on each side
   
3. **Mobility** (Weight: 5x)
   - Number of valid moves available
   
4. **Strategic Positions** (Weight: varies)
   - Middle pits: +2 points per stone
   - Corner pits: +1 point per stone
   - Empty pits: -3 penalty
   
5. **Capture Opportunities** (Weight: 15x)
   - Immediate capture potential
   - Setup for future captures

### AI Explanation Generation
- Describe the chosen move and stone count
- Explain any captures made
- Mention bonus turns earned
- Provide strategic reasoning based on difficulty level
- Use natural language that educates the player

### Hint System
- Evaluate all player moves using same algorithm
- Suggest move with highest evaluation score
- Explain why the move is beneficial
- Highlight the suggested pit visually
- Consider both immediate and strategic benefits

### Performance Optimization
- Use alpha-beta pruning to reduce search space
- Cache position evaluations when possible
- Limit search depth based on difficulty
- Provide thinking delays for realistic AI behavior