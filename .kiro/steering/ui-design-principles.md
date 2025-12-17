---
inclusion: fileMatch
fileMatchPattern: '**/{gameUI.js,styles.css,index.html}'
---

# UI Design Principles for Pallanguzhi

## Visual Design Philosophy

### Traditional Aesthetic
- **Wooden Board**: Use brown gradients and wood-like textures
- **Stone Pits**: Circular depressions with realistic shadows
- **Color Palette**: Earth tones (browns, tans, golds)
- **Typography**: Tamil fonts with fallback to system fonts

### Cultural Elements
- **Tamil Labels**: Use proper Tamil script for all game elements
- **Bilingual Support**: Tamil primary, English secondary
- **Traditional Terminology**: Authentic game vocabulary
- **Respectful Representation**: Honor cultural significance

## Interaction Design

### User Feedback
- **Visual Highlights**: Show valid moves and selections
- **Animation Feedback**: Stone movement paths and captures
- **Audio Cues**: Consider traditional sounds (optional)
- **Status Messages**: Clear game state communication

### Accessibility
- **Keyboard Navigation**: Full game playable with keyboard
- **Screen Reader Support**: Proper ARIA labels
- **Color Contrast**: Ensure readability for all users
- **Mobile Optimization**: Touch-friendly interface

## Responsive Design

### Breakpoints
- **Desktop**: Full board with all features
- **Tablet**: Adjusted pit sizes and spacing
- **Mobile**: Compact layout with essential features

### Layout Adaptations
- **Pit Sizing**: Scale based on screen size
- **Control Placement**: Stack vertically on small screens
- **Text Scaling**: Maintain readability across devices
- **Touch Targets**: Minimum 44px for mobile interaction

## Animation Guidelines

### Stone Movement
- **Duration**: 200ms per pit for smooth visualization
- **Easing**: Natural motion curves
- **Path Highlighting**: Show stone distribution path
- **Capture Effects**: Special animation for captures

### State Transitions
- **Smooth Transitions**: Fade in/out for messages
- **Loading States**: Show AI thinking process
- **Game State Changes**: Clear visual feedback
- **Error Handling**: Gentle error indication