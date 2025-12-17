# பல்லாங்குழி (Pallanguzhi) - Traditional Tamil Board Game

A digital recreation of the traditional Tamil board game Pallanguzhi with AI opponent and strategic gameplay.

## Game Features

### Traditional Gameplay
- Authentic Pallanguzhi rules with 7 pits per player
- Counter-clockwise stone distribution
- Capture mechanics when landing in empty opponent pits
- Bonus turns for strategic plays
- Traditional wooden board aesthetic with Tamil labels

### AI Opponent
- **Three Difficulty Levels**: Easy, Medium, Hard
- **Strategic Decision Making**: AI evaluates multiple future moves using minimax algorithm
- **Natural Language Explanations**: AI explains its reasoning after each move
- **Hint Mode**: AI suggests optimal moves for human players

### User Interface
- **Retro Visual Style**: Inspired by classic board games
- **Tamil Language Support**: Authentic labels and terminology
- **Responsive Design**: Works on desktop and mobile devices
- **Keyboard Controls**: Number keys 1-7 for quick pit selection
- **Visual Feedback**: Animated stone movement and capture effects

## How to Play

1. **Objective**: Capture more stones than your opponent
2. **Setup**: Each player has 7 pits with 6 stones each (middle pits start with 12)
3. **Gameplay**: 
   - Click on your pits (bottom row) to distribute stones
   - Stones move counter-clockwise around the board
   - Capture occurs when your last stone lands in an empty opponent pit
   - Get bonus turns by ending in your own pit with even number of stones
4. **Winning**: Game ends when one side is empty; player with most stones wins

## Controls

- **Mouse**: Click on pits to make moves
- **Keyboard**: 
  - Numbers 1-7: Select pits
  - 'H': Show hint
  - 'N': New game
  - 'E': Toggle AI explanations

## Technical Implementation

### Architecture
- **Modular Design**: Separate files for game logic, AI, UI, and main controller
- **Clean Code**: Well-commented and documented functions
- **Performance Optimized**: Efficient algorithms with alpha-beta pruning

### Files Structure
```
├── index.html          # Main HTML structure
├── styles.css          # Traditional styling and responsive design
└── js/
    ├── gameLogic.js     # Core game rules and mechanics
    ├── aiPlayer.js      # AI opponent with strategic decision-making
    ├── gameUI.js        # User interface controller
    └── main.js          # Application initialization and coordination
```

## AI Strategy

The AI uses advanced algorithms to provide challenging gameplay:

- **Minimax Algorithm**: Evaluates game trees up to 6 moves deep
- **Alpha-Beta Pruning**: Optimizes search performance
- **Position Evaluation**: Considers stone distribution, mobility, and capture opportunities
- **Strategic Reasoning**: Explains moves in natural language

## Getting Started

1. Open `index.html` in a modern web browser
2. Select difficulty level
3. Click "புதிய விளையாட்டு (New Game)" to start
4. Make your first move by clicking on any pit with stones

Enjoy this digital recreation of the timeless Tamil game பல்லாங்குழி!