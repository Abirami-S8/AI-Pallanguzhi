---
inclusion: always
---

# Pallanguzhi Project Guidelines

## Project Overview
This is a traditional Tamil board game (பல்லாங்குழி) implemented as a web application with AI opponent. The project focuses on cultural authenticity, strategic gameplay, and educational value.

## Code Standards

### JavaScript
- Use ES6+ features and modern JavaScript practices
- Implement modular architecture with clear separation of concerns
- Follow consistent naming conventions (camelCase for variables/functions, PascalCase for classes)
- Add comprehensive comments explaining game logic and AI strategy
- Use async/await for animations and delays

### Game Logic Standards
- Maintain authentic Pallanguzhi rules and mechanics
- Ensure counter-clockwise stone distribution
- Implement proper capture rules (empty opponent pit + adjacent stones)
- Handle bonus turns correctly (own pit with even stones)
- Validate all moves before execution

### AI Implementation
- Use minimax algorithm with alpha-beta pruning
- Implement multiple difficulty levels with appropriate search depths
- Provide natural language explanations for AI moves
- Consider strategic factors: captures, mobility, stone distribution
- Offer helpful hints for human players

### UI/UX Guidelines
- Maintain traditional wooden board aesthetic
- Use Tamil labels and terminology authentically
- Ensure responsive design for all screen sizes
- Provide smooth animations for stone movement
- Include visual feedback for valid/invalid moves
- Support both mouse and keyboard interactions

## Cultural Authenticity
- Use proper Tamil terminology and labels
- Respect traditional game rules and mechanics
- Maintain the cultural significance of the game
- Provide educational context about the game's heritage

## Testing Approach
- Test all game rule implementations
- Verify AI decision-making at different difficulty levels
- Ensure UI responsiveness across devices
- Validate Tamil text rendering and fonts
- Test accessibility features

## Performance Considerations
- Optimize AI search algorithms for smooth gameplay
- Use efficient DOM manipulation for animations
- Minimize memory usage during long games
- Ensure fast loading times for all assets