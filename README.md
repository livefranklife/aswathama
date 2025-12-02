# 🚀 Ashwatthama Alpha - Universe Explorer

A dynamic, interactive space exploration game where you control a rocket and travel through multiple universes, galaxies, and planets. Experience the thrill of interstellar travel with stunning visual effects, parallax scrolling, and an infinite looping universe.

## 🌐 Live Demo

**Play the game here:** [https://aswathama-nu.vercel.app/](https://aswathama-nu.vercel.app/)

## ✨ Features

### 🎮 Gameplay
- **Arrow Key Controls** - Navigate your rocket through the universe with smooth, responsive controls
- **WASD Alternative** - Alternative keyboard controls for movement
- **Infinite Loop Universe** - Seamless wraparound movement - travel off one edge and appear on the opposite side
- **Full Screen Exploration** - Large playable area (95vw x 95vh) for maximum exploration space

### 🌌 Dynamic Universe System
- **8 Unique Universes** to explore:
  - 🌌 Milky Way Galaxy
  - ☄️ Comet Field
  - ☀️ Solar Planets System
  - 🕳️ Black Hole Universe
  - 🌠 Andromeda Galaxy
  - 🌈 Nebula Cluster
  - ⚛️ Parallel Universe Alpha
  - ⭐ Final Destination - Alpha Centauri

- **7 Planets** to visit:
  - 🌍 Earth
  - 🔴 Mars
  - 🟠 Jupiter
  - 🟡 Saturn
  - 🔵 Neptune
  - ❄️ Pluto
  - ⭐ Alpha Centauri

### 🎨 Visual Effects

#### Dynamic Star System
- **450+ Stars** across 3 parallax layers creating depth
- Stars move at different speeds (fast, normal, slow)
- Twinkling animations for realistic space atmosphere
- Continuous drift motion for immersive travel feel

#### Particle Effects
- **Particle Trails** - Cyan particles emitted from rocket while moving
- **Dual Engine Fire** - Orange/red main flame + cyan secondary flame
- Animated engine effects with pulsing flames

#### Speed & Motion Effects
- **Speed Lines** - Visual streaks appear when moving fast
- **Warp Effects** - Pulsing radial effects during universe transitions
- Smooth banking/tilting animations when turning

#### Universe-Specific Backgrounds
Each universe has its own unique color theme:
- Milky Way: Purple/black gradient
- Comet Field: Dark blue space
- Solar System: Orange/yellow glow
- Black Hole: Deep purple void
- Andromeda: Purple tones
- Nebula: Blue cosmic clouds
- Parallel Universe: Magenta/purple distortion
- Alpha Centauri: Orange/red binary star system

#### Animated Nebula Clouds
- 3 drifting nebula clouds with scaling and opacity animations
- Colorful cosmic clouds (purple, blue, magenta)
- Smooth movement creating depth

### 📊 UI Features
- **Real-time Stats Display**:
  - Current Universe name
  - Current Planet
  - Distance traveled (in light years)
  
- **Visual Feedback**:
  - Distance counter flashes yellow at milestones
  - Universe name flashes on universe change
  - Smooth color transitions

- **Controls Panel** - Always visible control instructions

### 🎯 Game Mechanics
- **Distance Tracking** - Track your journey across the cosmos
- **Automatic Universe Progression** - Universes and planets advance as you travel
- **Infinite Journey** - Loop through all universes continuously
- **Responsive Design** - Adapts to different screen sizes

## 🛠️ Technology Stack

- **HTML5** - Structure and layout
- **CSS3** - Styling, animations, and visual effects
- **JavaScript (Vanilla)** - Game logic, controls, and dynamic effects
- **No Dependencies** - Pure vanilla JavaScript, no frameworks required

## 🎮 Controls

| Key | Action |
|-----|--------|
| ↑ / W | Move Up |
| ↓ / S | Move Down |
| ← / A | Move Left |
| → / D | Move Right |

## 🚀 Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/livefranklife/aswathama.git
cd aswathama
```

2. Open `index.html` in your web browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

3. Navigate to `http://localhost:8000` in your browser

### Deployment

The project is deployed on Vercel and can be accessed at:
**https://aswathama-nu.vercel.app/**

## 📁 Project Structure

```
aswathama/
├── index.html          # Main game file (HTML, CSS, JavaScript)
├── README.md           # Project documentation
├── package.json        # Project metadata
└── js/                 # JavaScript modules (if any)
    ├── config.js
    ├── player.js
    ├── vehicle.js
    ├── worlds.js
    └── main.js
```

## 🎨 Customization

### Adjusting Speed
Edit the `speed` constant in the JavaScript section:
```javascript
const speed = 7; // pixels per frame
```

### Adding More Stars
Modify the star generation loop:
```javascript
for (let layer = 0; layer < 3; layer++) {
    for (let i = 0; i < 150; i++) {
        // Star creation code
    }
}
```

### Customizing Universes
Edit the `universes` array to add or modify universes:
```javascript
const universes = [
    "Milky Way Galaxy",
    // Add your custom universe here
];
```

## 🌟 Future Enhancements

Potential features for future updates:
- [ ] Sound effects and background music
- [ ] Collision detection with asteroids
- [ ] Power-ups and collectibles
- [ ] Multiple rocket designs
- [ ] Leaderboard system
- [ ] Mobile touch controls
- [ ] Multiplayer mode
- [ ] More interactive elements in each universe

## 📝 License

This project is open source and available for personal and educational use.

## 👨‍💻 Author

**Ashwatthama Alpha Universe Explorer**
- GitHub: [@livefranklife](https://github.com/livefranklife)
- Project: [aswathama](https://github.com/livefranklife/aswathama)

## 🙏 Acknowledgments

- Inspired by space exploration and interstellar travel
- Built with pure web technologies for maximum compatibility
- Designed for an immersive cosmic journey experience

---

**Start your journey through the cosmos!** 🌌✨

*Travel the universe, explore galaxies, and experience the infinite beauty of space.*
