// Main Game Scene
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    preload() {
        // Hide loading text
        document.getElementById('loading').style.display = 'none';
        
        // Create simple particle texture
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(0, 0, 4);
        graphics.generateTexture('particle', 8, 8);
        graphics.destroy();
    }
    
    create() {
        // Initialize world generator
        this.worldGenerator = new WorldGenerator(this);
        
        // Get current planet data
        const universe = UNIVERSES[currentUniverseIndex];
        const planet = universe.planets[currentPlanetIndex];
        
        // Create world
        this.worldGenerator.createWorld(planet);
        
        // Create player
        this.player = new Player(this, 100, CONFIG.height - 200);
        
        // Create vehicle
        this.vehicle = new Vehicle(this, CONFIG.width - 150, CONFIG.height - 200);
        
        // Create collisions and store references
        this.playerCollider = this.physics.add.collider(this.player, this.worldGenerator.getPlatforms());
        this.vehicleCollider = this.physics.add.collider(this.vehicle, this.worldGenerator.getPlatforms());
        
        // Create input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
        this.spaceKey = this.input.keyboard.addKey('SPACE');
        this.eKey = this.input.keyboard.addKey('E');
        this.rKey = this.input.keyboard.addKey('R');
        this.shiftKey = this.input.keyboard.addKey('SHIFT');
        this.qKey = this.input.keyboard.addKey('Q');
        this.plusKey = this.input.keyboard.addKey('PLUS');
        this.minusKey = this.input.keyboard.addKey('MINUS');
        this.equalsKey = this.input.keyboard.addKey('EQUALS');
        
        // Combine keys
        this.controls = {
            up: this.cursors.up,
            down: this.cursors.down,
            left: this.cursors.left,
            right: this.cursors.right,
            space: this.spaceKey,
            w: this.wasd.W,
            s: this.wasd.S,
            a: this.wasd.A,
            d: this.wasd.D,
            shift: this.shiftKey,
            q: this.qKey,
            plus: this.plusKey,
            minus: this.minusKey,
            equals: this.equalsKey
        };
        
        // Track speed control to prevent conflicts
        this.speedControlCooldown = 0;
        
        // Vehicle interaction
        this.physics.add.overlap(this.player, this.vehicle, this.handleVehicleInteraction, null, this);
        
        // Update UI
        this.updateUI();
        
        // Create camera effects
        this.cameras.main.setBounds(0, 0, CONFIG.width, CONFIG.height);
        this.cameras.main.startFollow(this.vehicle.isActive ? this.vehicle : this.player);
        
        // Add visual effects
        this.createVisualEffects();
    }
    
    update() {
        // Speed control (only when in vehicle)
        if (this.vehicle.isActive && this.vehicle.playerInside) {
            // Q for slower, =/+ for faster
            if (Phaser.Input.Keyboard.JustDown(this.qKey)) {
                this.vehicle.decreaseSpeed();
                this.updateUI();
            }
            if (Phaser.Input.Keyboard.JustDown(this.equalsKey) || Phaser.Input.Keyboard.JustDown(this.plusKey)) {
                this.vehicle.increaseSpeed();
                this.updateUI();
            }
        }
        
        if (this.vehicle.isActive && this.vehicle.playerInside) {
            // Player is in vehicle
            this.vehicle.update(this.controls);
            this.cameras.main.startFollow(this.vehicle);
        } else {
            // Player is on foot
            this.player.update(this.controls);
            this.cameras.main.startFollow(this.player);
        }
        
        // Check for universe travel
        if (Phaser.Input.Keyboard.JustDown(this.rKey) && this.vehicle.isActive) {
            this.travelToNextUniverse();
        }
    }
    
    handleVehicleInteraction(player, vehicle) {
        if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
            if (vehicle.isActive) {
                // Exit vehicle
                vehicle.deactivate();
                player.exitVehicle(vehicle.x, vehicle.y - 50);
            } else {
                // Enter vehicle
                vehicle.activate();
                player.enterVehicle(vehicle);
            }
        }
    }
    
    travelToNextUniverse() {
        // Create warp animation
        this.vehicle.travelToNextUniverse();
        
        // Update universe/planet indices
        const universe = UNIVERSES[currentUniverseIndex];
        currentPlanetIndex++;
        
        if (currentPlanetIndex >= universe.planets.length) {
            currentPlanetIndex = 0;
            currentUniverseIndex++;
            
            if (currentUniverseIndex >= UNIVERSES.length) {
                // Game complete!
                this.gameComplete();
                return;
            }
        }
        
        // Calculate distance traveled
        totalDistance += Phaser.Math.Between(10, 50);
        
        // Transition to new world
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        
        this.time.delayedCall(1000, () => {
            // Load new world
            const newUniverse = UNIVERSES[currentUniverseIndex];
            const newPlanet = newUniverse.planets[currentPlanetIndex];
            
            // Reset player and vehicle positions
            this.player.setPosition(100, CONFIG.height - 200);
            this.vehicle.setPosition(CONFIG.width - 150, CONFIG.height - 200);
            
            // Create new world
            this.worldGenerator.createWorld(newPlanet);
            
            // Recreate collisions
            if (this.playerCollider) {
                this.physics.world.removeCollider(this.playerCollider);
            }
            if (this.vehicleCollider) {
                this.physics.world.removeCollider(this.vehicleCollider);
            }
            this.playerCollider = this.physics.add.collider(this.player, this.worldGenerator.getPlatforms());
            this.vehicleCollider = this.physics.add.collider(this.vehicle, this.worldGenerator.getPlatforms());
            
            // Update UI
            this.updateUI();
            
            // Fade in
            this.cameras.main.fadeIn(1000, 0, 0, 0);
        });
    }
    
    updateUI() {
        const universe = UNIVERSES[currentUniverseIndex];
        const planet = universe.planets[currentPlanetIndex];
        
        document.getElementById('universe-name').textContent = universe.name;
        document.getElementById('planet-name').textContent = planet.name;
        document.getElementById('distance').textContent = totalDistance;
        
        // Update speed indicator if vehicle is active
        if (this.vehicle && this.vehicle.isActive) {
            const speedEl = document.getElementById('speed-indicator');
            if (speedEl) {
                speedEl.textContent = `Speed: ${this.vehicle.currentSpeedLevel}/5 (${Math.round(this.vehicle.speed)} px/s)`;
            }
        }
    }
    
    createVisualEffects() {
        // Add ambient particles
        try {
            this.ambientParticles = this.add.particles(0, 0, 'particle', {
                x: { min: 0, max: CONFIG.width },
                y: { min: 0, max: CONFIG.height },
                speed: { min: 10, max: 30 },
                scale: { start: 0.2, end: 0 },
                tint: [0x00ffff, 0xff00ff, 0xffff00],
                lifespan: 3000,
                frequency: 200
            });
            if (this.ambientParticles) {
                this.ambientParticles.setDepth(-40);
            }
        } catch (error) {
            console.warn('Could not create ambient particles:', error);
            this.ambientParticles = null;
        }
    }
    
    gameComplete() {
        // Create victory screen
        this.cameras.main.fadeOut(2000, 0, 0, 0);
        
        this.time.delayedCall(2000, () => {
            // Create victory message
            const victoryText = this.add.text(
                CONFIG.width / 2,
                CONFIG.height / 2,
                'ASHWATTHAMA ALPHA HAS EXPLORED ALL UNIVERSES!\n\nTotal Distance: ' + totalDistance + ' light years\n\nPress R to Restart',
                {
                    fontSize: '32px',
                    fill: '#00ffff',
                    align: 'center',
                    stroke: '#000000',
                    strokeThickness: 4
                }
            );
            victoryText.setOrigin(0.5);
            victoryText.setDepth(1000);
            
            // Restart on R key
            this.input.keyboard.once('keydown-R', () => {
                currentUniverseIndex = 0;
                currentPlanetIndex = 0;
                totalDistance = 0;
                this.scene.restart();
            });
        });
    }
}

// Initialize Game - Wait for DOM and Phaser to be fully loaded
function initGame() {
    if (typeof Phaser === 'undefined') {
        console.error('Phaser library not loaded!');
        document.getElementById('loading').textContent = 'Error: Phaser library not loaded. Please check your internet connection.';
        document.getElementById('loading').style.color = '#ff0000';
        return;
    }
    
    if (!document.getElementById('game-container')) {
        console.error('Game container not found!');
        return;
    }
    
    try {
        const game = new Phaser.Game({
            type: Phaser.AUTO,
            width: CONFIG.width,
            height: CONFIG.height,
            parent: 'game-container',
            backgroundColor: CONFIG.backgroundColor,
            physics: CONFIG.physics,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            scene: GameScene
        });
        console.log('Game initialized successfully!');
    } catch (error) {
        console.error('Error initializing game:', error);
        const loadingEl = document.getElementById('loading');
        if (loadingEl) {
            loadingEl.textContent = 'Error loading game. Please check console for details.';
            loadingEl.style.color = '#ff0000';
        }
    }
}

// Wait for both DOM and window load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.addEventListener('load', initGame);
    });
} else {
    window.addEventListener('load', initGame);
}

