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
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// Universe and Planet Data
const UNIVERSES = [
    {
        name: "Solar System",
        planets: [
            { name: "Earth", color: 0x4a90e2, gravity: 300, size: "large" },
            { name: "Mars", color: 0xcd5c5c, gravity: 200, size: "medium" },
            { name: "Neptune", color: 0x4169e1, gravity: 350, size: "large" },
            { name: "Pluto", color: 0xd3d3d3, gravity: 150, size: "small" }
        ]
    },
    {
        name: "Andromeda Galaxy",
        planets: [
            { name: "Nexus Prime", color: 0xff69b4, gravity: 280, size: "large" },
            { name: "Crystal World", color: 0x00ffff, gravity: 250, size: "medium" },
            { name: "Dark Moon", color: 0x2f2f2f, gravity: 400, size: "small" }
        ]
    },
    {
        name: "Black Hole Universe",
        planets: [
            { name: "Event Horizon", color: 0x000000, gravity: 500, size: "medium" },
            { name: "Singularity Core", color: 0x4b0082, gravity: 600, size: "small" },
            { name: "Photon Sphere", color: 0xffd700, gravity: 450, size: "large" }
        ]
    },
    {
        name: "Nebula Cluster",
        planets: [
            { name: "Stardust", color: 0xff1493, gravity: 220, size: "medium" },
            { name: "Cosmic Cloud", color: 0x9370db, gravity: 180, size: "large" },
            { name: "Energy Field", color: 0x00ff00, gravity: 300, size: "small" }
        ]
    },
    {
        name: "Final Destination",
        planets: [
            { name: "Alpha Centauri", color: 0xffff00, gravity: 320, size: "large" }
        ]
    }
];

let currentUniverseIndex = 0;
let currentPlanetIndex = 0;
let totalDistance = 0;

