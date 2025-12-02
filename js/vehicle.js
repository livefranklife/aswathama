// Vehicle Class - Space Travel Vehicle
class Vehicle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'vehicle');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Vehicle properties
        this.setCollideWorldBounds(true);
        this.setScale(1.2);
        
        // Movement properties
        this.speed = 300;
        this.boostSpeed = 500;
        this.isActive = false;
        this.playerInside = false;
        
        // Create vehicle graphics
        this.createVehicleGraphics();
        
        // Create animations
        this.createAnimations();
        
        // Set initial animation
        this.play('idle');
        
        // Particle effects
        this.createParticles();
    }
    
    createVehicleGraphics() {
        const graphics = this.scene.add.graphics();
        
        // Main body (futuristic spaceship)
        graphics.fillStyle(0xff6b35);
        graphics.fillRect(0, 0, 80, 50);
        
        // Cockpit
        graphics.fillStyle(0x00ffff);
        graphics.fillRect(20, 5, 40, 25);
        
        // Wings
        graphics.fillStyle(0xff4500);
        graphics.fillRect(-15, 15, 20, 20);
        graphics.fillRect(75, 15, 20, 20);
        
        // Engine glow
        graphics.fillStyle(0xffff00);
        graphics.fillRect(5, 45, 20, 10);
        graphics.fillRect(55, 45, 20, 10);
        
        graphics.generateTexture('vehicle', 100, 70);
        graphics.destroy();
    }
    
    createAnimations() {
        const scene = this.scene;
        
        // Idle animation
        if (!scene.anims.exists('vehicle-idle')) {
            scene.anims.create({
                key: 'vehicle-idle',
                frames: [{ key: 'vehicle', frame: 0 }],
                frameRate: 1,
                repeat: -1
            });
        }
        
        // Flying animation
        if (!scene.anims.exists('vehicle-fly')) {
            scene.anims.create({
                key: 'vehicle-fly',
                frames: [{ key: 'vehicle', frame: 0 }],
                frameRate: 10,
                repeat: -1
            });
        }
    }
    
    createParticles() {
        // Create particle emitter for engine trail
        this.trail = this.scene.add.particles(this.x, this.y, 'particle', {
            speed: { min: 50, max: 100 },
            scale: { start: 0.3, end: 0 },
            tint: [0xffff00, 0xff6b35],
            lifespan: 300,
            frequency: 50,
            follow: this,
            followOffset: { x: 0, y: 25 }
        });
        
        this.trail.stop();
    }
    
    update(cursors) {
        if (!this.isActive || !this.playerInside) {
            return;
        }
        
        let velocityX = 0;
        let velocityY = 0;
        let currentSpeed = cursors.shift.isDown ? this.boostSpeed : this.speed;
        
        // Movement controls
        if (cursors.left.isDown || cursors.a.isDown) {
            velocityX = -currentSpeed;
        } else if (cursors.right.isDown || cursors.d.isDown) {
            velocityX = currentSpeed;
        }
        
        if (cursors.up.isDown || cursors.w.isDown) {
            velocityY = -currentSpeed;
        } else if (cursors.down.isDown || cursors.s.isDown) {
            velocityY = currentSpeed;
        }
        
        this.setVelocity(velocityX, velocityY);
        
        // Update particle trail
        if (velocityX !== 0 || velocityY !== 0) {
            this.play('vehicle-fly', true);
            this.trail.start();
        } else {
            this.play('vehicle-idle', true);
            this.trail.stop();
        }
    }
    
    activate() {
        this.isActive = true;
        this.playerInside = true;
        this.setTint(0x00ffff);
        // Disable gravity when vehicle is active (can fly)
        this.body.setAllowGravity(false);
    }
    
    deactivate() {
        this.isActive = false;
        this.playerInside = false;
        this.setTint(0xffffff);
        this.trail.stop();
        this.setVelocity(0, 0);
        // Re-enable gravity when vehicle is inactive
        this.body.setAllowGravity(true);
    }
    
    travelToNextUniverse() {
        // Create warp effect
        const warpEffect = this.scene.add.particles(this.x, this.y, 'particle', {
            speed: { min: 200, max: 400 },
            scale: { start: 1, end: 0 },
            tint: [0x00ffff, 0xff00ff, 0xffffff],
            lifespan: 1000,
            frequency: 10,
            emitZone: { type: 'edge', source: new Phaser.Geom.Circle(0, 0, 50), quantity: 50 }
        });
        
        this.scene.time.delayedCall(1000, () => {
            warpEffect.destroy();
        });
        
        return true;
    }
}

