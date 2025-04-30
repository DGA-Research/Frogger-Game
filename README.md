# Frogger-Game
This is a Frogger style game  https://dga-research.github.io/Frogger-Game/

# WINSOME DODGE SOME

Help Winsome Sears Dodge The Issues Hurting Virginians!

---

## Overview

**WINSOME DODGE SOME** is a browser-based arcade game inspired by *Frogger*. Guide Winsome Sears (the frog) across a field of moving obstacles that represent issues affecting Virginians. Dodge both text and image obstacles to reach the top and win!

---

## Features

- Keyboard (WASD/Arrow keys) and on-screen button controls for all devices
- Dynamic obstacles: both text (e.g., "Medicaid Cuts") and images
- Responsive design for desktop and mobile
- Visual win/lose messages and automatic game reset
- Customizable via `config.json` for assets and gameplay settings

---

## How to Play

- **Goal:** Move the frog from the bottom to the top of the game area without colliding with obstacles.
- **Controls:**
  - **Keyboard:** Use W/A/S/D or Arrow keys to move up/left/down/right
  - **Mobile:** Tap on the on-screen arrow buttons
- **Win:** Reach the top edge to display the win message
- **Lose:** Collide with any obstacle to trigger the game over message

---

## Setup & Installation

1. **Clone or Download** this repository.
2. Ensure the following files are present in the same directory:
   - `index.html`
   - `style.css`
   - `game.js`
   - `config.json`
   - All image assets referenced in `config.json` (e.g., frog image, background, obstacle images)
3. **Open `index.html` in your browser** to play.

---

## Customization

- **Obstacles, images, and behavior** can be edited in `config.json`:
  - Change obstacle texts, images, speeds, and layout
  - Adjust frog and obstacle sizes, movement step, and spawn rates

---

## File Structure

| File         | Purpose                                      |
|--------------|----------------------------------------------|
| index.html   | Main game markup and controls                |
| style.css    | Visual styling and responsive layout         |
| game.js      | Game logic and controls                      |
| config.json  | Game settings and asset references           |
| images/      | Image assets for frog, background, obstacles |

---
