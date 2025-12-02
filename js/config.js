// Game Configuration
const CONFIG = {
    width: 1200,
    height: 800,
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scale: {
        mode: 1, // Phaser.Scale.FIT
        autoCenter: 1 // Phaser.Scale.CENTER_BOTH
    }
};

// Universe and Planet Data - Galaxy Ladder Progression
const UNIVERSES = [
    {
        name: "Milky Way Galaxy",
        type: "galaxy",
        bgType: "milkyway",
        planets: [
            { name: "Earth", color: 0x4a90e2, gravity: 300, size: "large", type: "planet" },
            { name: "Mars", color: 0xcd5c5c, gravity: 200, size: "medium", type: "planet" },
            { name: "Jupiter", color: 0xff8c42, gravity: 400, size: "large", type: "gas_giant" },
            { name: "Saturn", color: 0xffd89b, gravity: 350, size: "large", type: "gas_giant" }
        ]
    },
    {
        name: "Comet Field",
        type: "comet",
        bgType: "comet",
        planets: [
            { name: "Halley's Comet", color: 0x87ceeb, gravity: 150, size: "small", type: "comet" },
            { name: "Ice Comet", color: 0xb0e0e6, gravity: 120, size: "small", type: "comet" },
            { name: "Cosmic Comet", color: 0x00ffff, gravity: 180, size: "medium", type: "comet" }
        ]
    },
    {
        name: "Solar Planets System",
        type: "solar",
        bgType: "solar",
        planets: [
            { name: "Mercury", color: 0x8c7853, gravity: 250, size: "small", type: "planet" },
            { name: "Venus", color: 0xffc649, gravity: 320, size: "medium", type: "planet" },
            { name: "Neptune", color: 0x4169e1, gravity: 350, size: "large", type: "planet" },
            { name: "Uranus", color: 0x4fd0e7, gravity: 330, size: "large", type: "planet" }
        ]
    },
    {
        name: "Black Hole Universe",
        type: "blackhole",
        bgType: "blackhole",
        planets: [
            { name: "Event Horizon", color: 0x000000, gravity: 500, size: "medium", type: "blackhole" },
            { name: "Singularity Core", color: 0x4b0082, gravity: 600, size: "small", type: "blackhole" },
            { name: "Photon Sphere", color: 0xffd700, gravity: 450, size: "large", type: "blackhole" },
            { name: "Accretion Disk", color: 0xff4500, gravity: 550, size: "large", type: "blackhole" }
        ]
    },
    {
        name: "Andromeda Galaxy",
        type: "galaxy",
        bgType: "andromeda",
        planets: [
            { name: "Nexus Prime", color: 0xff69b4, gravity: 280, size: "large", type: "planet" },
            { name: "Crystal World", color: 0x00ffff, gravity: 250, size: "medium", type: "planet" },
            { name: "Dark Moon", color: 0x2f2f2f, gravity: 400, size: "small", type: "planet" }
        ]
    },
    {
        name: "Nebula Cluster",
        type: "nebula",
        bgType: "nebula",
        planets: [
            { name: "Stardust", color: 0xff1493, gravity: 220, size: "medium", type: "nebula" },
            { name: "Cosmic Cloud", color: 0x9370db, gravity: 180, size: "large", type: "nebula" },
            { name: "Energy Field", color: 0x00ff00, gravity: 300, size: "small", type: "nebula" }
        ]
    },
    {
        name: "Parallel Universe Alpha",
        type: "parallel",
        bgType: "parallel",
        planets: [
            { name: "Mirror Earth", color: 0x9b59b6, gravity: 300, size: "large", type: "parallel" },
            { name: "Quantum Realm", color: 0xff00ff, gravity: 200, size: "medium", type: "parallel" }
        ]
    },
    {
        name: "Final Destination - Alpha Centauri",
        type: "final",
        bgType: "centauri",
        planets: [
            { name: "Alpha Centauri", color: 0xffff00, gravity: 320, size: "large", type: "final" }
        ]
    }
];

let currentUniverseIndex = 0;
let currentPlanetIndex = 0;
let totalDistance = 0;
let universeLoopCount = 0; // Track how many times through all universes

