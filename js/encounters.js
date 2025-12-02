// Encounter System - Meetings and Events
class EncounterSystem {
    constructor(scene) {
        this.scene = scene;
        this.encounters = [];
        this.currentEncounter = null;
    }
    
    createEncounter(type, universeType) {
        const encounters = this.getEncountersForType(type, universeType);
        if (encounters.length === 0) return null;
        
        const encounter = Phaser.Math.RND.pick(encounters);
        this.showEncounter(encounter);
        return encounter;
    }
    
    getEncountersForType(type, universeType) {
        const allEncounters = {
            blackhole: [
                {
                    title: "Interstellar Travel Through Black Hole",
                    text: "You've entered the black hole! Time and space are warping around you. You see glimpses of distant galaxies and parallel realities. The gravitational forces are immense, but your rocket's quantum shields hold strong. You emerge in a different part of the universe!",
                    effect: "interstellar_travel"
                },
                {
                    title: "Meeting Past Self",
                    text: "Through the black hole's time dilation, you encounter a version of yourself from the past! You exchange knowledge and continue your journey with new insights.",
                    effect: "knowledge_boost"
                },
                {
                    title: "Wormhole Discovery",
                    text: "The black hole reveals a stable wormhole! You travel through it and emerge near a distant star system, skipping several universes in your journey.",
                    effect: "universe_skip"
                }
            ],
            parallel: [
                {
                    title: "Time Travel Through Parallel Universe",
                    text: "You've activated time travel! The parallel universe allows you to move through time. You witness the birth of stars, the formation of galaxies, and the future of the cosmos. Time flows differently here...",
                    effect: "time_travel"
                },
                {
                    title: "Meeting Alternate Self",
                    text: "In this parallel universe, you meet an alternate version of yourself from a different timeline! Together you discover new paths through the multiverse.",
                    effect: "path_discovery"
                },
                {
                    title: "Quantum Entanglement",
                    text: "You become quantum entangled with your past and future selves. You can now see multiple timelines simultaneously, gaining incredible navigation abilities!",
                    effect: "quantum_vision"
                }
            ],
            default: [
                {
                    title: "Cosmic Encounter",
                    text: "You encounter a mysterious space anomaly. Ancient energy flows through you, enhancing your rocket's capabilities!",
                    effect: "power_boost"
                },
                {
                    title: "Stellar Meeting",
                    text: "A friendly alien explorer shares advanced navigation technology with you. Your journey becomes faster and more efficient!",
                    effect: "speed_boost"
                }
            ]
        };
        
        return allEncounters[universeType] || allEncounters.default;
    }
    
    showEncounter(encounter) {
        const panel = document.getElementById('encounter-panel');
        const title = document.getElementById('encounter-title');
        const text = document.getElementById('encounter-text');
        const closeBtn = document.getElementById('encounter-close');
        
        if (panel && title && text) {
            title.textContent = encounter.title;
            text.textContent = encounter.text;
            panel.style.display = 'block';
            
            // Apply encounter effect
            this.applyEncounterEffect(encounter.effect);
            
            // Close button
            if (closeBtn) {
                closeBtn.onclick = () => {
                    panel.style.display = 'none';
                };
            }
        }
    }
    
    applyEncounterEffect(effect) {
        const scene = this.scene;
        
        switch(effect) {
            case 'interstellar_travel':
                // Skip to a random universe
                currentUniverseIndex = Phaser.Math.Between(0, UNIVERSES.length - 1);
                currentPlanetIndex = 0;
                totalDistance += Phaser.Math.Between(100, 200);
                scene.time.delayedCall(2000, () => {
                    scene.travelToNextUniverse();
                });
                break;
                
            case 'time_travel':
                // Travel through time - show time effects
                scene.createTimeTravelEffect();
                totalDistance += Phaser.Math.Between(50, 150);
                break;
                
            case 'knowledge_boost':
            case 'path_discovery':
            case 'quantum_vision':
                // Boost player capabilities
                if (scene.vehicle) {
                    scene.vehicle.maxSpeed = Math.min(1000, scene.vehicle.maxSpeed + 100);
                }
                break;
                
            case 'power_boost':
            case 'speed_boost':
                // Boost speed
                if (scene.vehicle) {
                    scene.vehicle.speed += 50;
                    scene.vehicle.boostSpeed += 75;
                }
                break;
                
            case 'universe_skip':
                // Skip ahead
                currentUniverseIndex = (currentUniverseIndex + 2) % UNIVERSES.length;
                totalDistance += Phaser.Math.Between(150, 300);
                break;
        }
    }
}

