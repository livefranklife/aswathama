// Vehicle Class - Space Travel Vehicle
class Vehicle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'vehicle');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Vehicle properties
        this.setCollideWorldBounds(true);
        this.setScale(1.2);
        // Set vehicle depth lower than player
        this.setDepth(5);
        
        // Movement properties - Interstellar Jet
        this.baseSpeed = 300;
        this.speed = 300;
        this.minSpeed = 150;
        this.maxSpeed = 1200; // Faster for jet-like feel
        this.speedMultiplier = 1.0;
        this.boostSpeed = 900;
        this.isActive = false;
        this.playerInside = false;
        this.currentSpeedLevel = 1; // 1-5 speed levels
        this.rotationSpeed = 0; // For banking/tilting
        this.targetRotation = 0;
        
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
        try {
            // Check if texture already exists
            if (this.scene.textures.exists('vehicle')) {
                return;
            }
            
            const graphics = this.scene.add.graphics();
            
            // Interstellar-style Flying Jet Design
            // Main fuselage (sleek, elongated like a jet)
            graphics.fillStyle(0x2a2a3a);
            graphics.fillRect(5, 20, 70, 40);
            
            // Nose cone (sharp, aerodynamic)
            graphics.fillStyle(0x3a3a4a);
            graphics.fillTriangle(40, 0, 15, 20, 65, 20);
            
            // Cockpit (large, Interstellar-style)
            graphics.fillStyle(0x1a1a2a, 0.4);
            graphics.fillRect(20, 15, 40, 25);
            // Cockpit glass with reflection
            graphics.fillStyle(0x00aaff, 0.6);
            graphics.fillRect(22, 17, 36, 21);
            // Cockpit frame
            graphics.lineStyle(2, 0xffffff, 0.8);
            graphics.strokeRect(20, 15, 40, 25);
            
            // Wings (swept back, jet-like)
            graphics.fillStyle(0x2a2a3a);
            // Left wing
            graphics.fillTriangle(5, 30, -15, 50, 5, 50);
            // Right wing
            graphics.fillTriangle(75, 30, 95, 50, 75, 50);
            
            // Wing details
            graphics.lineStyle(1, 0x00ffff, 0.5);
            graphics.lineBetween(-10, 45, 5, 45);
            graphics.lineBetween(75, 45, 90, 45);
            
            // Engine nacelles (Interstellar style)
            graphics.fillStyle(0x1a1a1a);
            graphics.fillRect(0, 55, 20, 15);
            graphics.fillRect(60, 55, 20, 15);
            
            // Engine glow (blue-white, like Interstellar)
            graphics.fillStyle(0x00ffff, 0.8);
            graphics.fillRect(2, 57, 16, 11);
            graphics.fillRect(62, 57, 16, 11);
            // Inner engine core
            graphics.fillStyle(0xffffff, 0.9);
            graphics.fillRect(5, 60, 10, 5);
            graphics.fillRect(65, 60, 10, 5);
            
            // Tail fins (vertical stabilizers)
            graphics.fillStyle(0x2a2a3a);
            graphics.fillRect(30, 55, 8, 20);
            graphics.fillRect(42, 55, 8, 20);
            
            // Details and panels
            graphics.lineStyle(1, 0x00ffff, 0.4);
            graphics.strokeRect(10, 25, 60, 30);
            
            graphics.generateTexture('vehicle', 100, 80);
            graphics.destroy();
        } catch (error) {
            console.error('Error creating vehicle graphics:', error);
            // Create a simple fallback
            const graphics = this.scene.add.graphics();
            graphics.fillStyle(0x2a2a3a);
            graphics.fillRect(0, 0, 70, 50);
            graphics.generateTexture('vehicle', 70, 50);
            graphics.destroy();
        }
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
        // Create Interstellar-style jet engine trails
        try {
            // Left engine trail (blue-white, like Interstellar)
            this.trail1 = this.scene.add.particles(this.x, this.y, 'particle', {
                speed: { min: 100, max: 200 },
                scale: { start: 0.8, end: 0 },
                tint: [0x00ffff, 0xffffff, 0x00aaff],
                lifespan: 500,
                frequency: 100,
                follow: this,
                followOffset: { x: -10, y: 50 }
            });
            
            // Right engine trail
            this.trail2 = this.scene.add.particles(this.x, this.y, 'particle', {
                speed: { min: 100, max: 200 },
                scale: { start: 0.8, end: 0 },
                tint: [0x00ffff, 0xffffff, 0x00aaff],
                lifespan: 500,
                frequency: 100,
                follow: this,
                followOffset: { x: 10, y: 50 }
            });
            
            // Center exhaust (when boosting)
            this.boostTrail = this.scene.add.particles(this.x, this.y, 'particle', {
                speed: { min: 150, max: 300 },
                scale: { start: 1.2, end: 0 },
                tint: [0xffffff, 0x00ffff, 0xff00ff],
                lifespan: 400,
                frequency: 150,
                follow: this,
                followOffset: { x: 0, y: 55 }
            });
            
            if (this.trail1) this.trail1.stop();
            if (this.trail2) this.trail2.stop();
            if (this.boostTrail) this.boostTrail.stop();
        } catch (error) {
            console.warn('Could not create particle trail:', error);
            this.trail1 = null;
            this.trail2 = null;
            this.boostTrail = null;
        }
    }
    
    update(cursors) {
        if (!this.isActive || !this.playerInside) {
            return;
        }
        
        // Boost with Shift
        const isBoosting = cursors.shift && cursors.shift.isDown;
        let currentSpeed = isBoosting ? this.boostSpeed : this.speed;
        
        let velocityX = 0;
        let velocityY = 0;
        
        // Get game width for center calculation
        const gameWidth = this.scene.scale ? this.scene.scale.width : CONFIG.width;
        const centerX = gameWidth / 2;
        
        // Movement controls - Jet-like flying with banking
        const leftPressed = cursors.left && cursors.left.isDown;
        const rightPressed = cursors.right && cursors.right.isDown;
        const aPressed = cursors.a && cursors.a.isDown;
        const dPressed = cursors.d && cursors.d.isDown;
        
        // Banking/tilting when turning (like a real jet)
        if (leftPressed || aPressed) {
            velocityX = -currentSpeed;
            this.targetRotation = -0.3; // Bank left
        } else if (rightPressed || dPressed) {
            velocityX = currentSpeed;
            this.targetRotation = 0.3; // Bank right
        } else {
            // Center positioning - smoothly return to center
            const distanceToCenter = centerX - this.x;
            const threshold = 5;
            if (Math.abs(distanceToCenter) > threshold) {
                const centeringSpeed = Math.min(currentSpeed * 0.7, Math.abs(distanceToCenter) * 0.2);
                velocityX = Math.sign(distanceToCenter) * centeringSpeed;
                this.targetRotation = Math.sign(distanceToCenter) * 0.15;
            } else {
                this.setX(centerX);
                velocityX = 0;
                this.targetRotation = 0; // Level flight
            }
        }
        
        // Vertical movement (smooth like a jet)
        const upPressed = cursors.up && cursors.up.isDown;
        const downPressed = cursors.down && cursors.down.isDown;
        const wPressed = cursors.w && cursors.w.isDown;
        const sPressed = cursors.s && cursors.s.isDown;
        
        if (upPressed || wPressed) {
            velocityY = -currentSpeed * 0.8; // Slightly slower vertical
        } else if (downPressed || sPressed) {
            velocityY = currentSpeed * 0.8;
        }
        
        // Smooth rotation (banking effect)
        this.rotationSpeed += (this.targetRotation - this.rotation) * 0.1;
        this.rotationSpeed *= 0.9; // Damping
        this.rotation += this.rotationSpeed;
        
        // Limit rotation
        if (this.rotation > 0.5) this.rotation = 0.5;
        if (this.rotation < -0.5) this.rotation = -0.5;
        
        this.setVelocity(velocityX, velocityY);
        
        // Update particle trails
        const isMoving = velocityX !== 0 || velocityY !== 0;
        if (isMoving) {
            this.play('vehicle-fly', true);
            if (this.trail1) {
                this.trail1.start();
                this.trail1.setFrequency(Math.max(50, 120 * (this.speed / this.maxSpeed)));
            }
            if (this.trail2) {
                this.trail2.start();
                this.trail2.setFrequency(Math.max(50, 120 * (this.speed / this.maxSpeed)));
            }
            if (isBoosting && this.boostTrail) {
                this.boostTrail.start();
            } else if (this.boostTrail) {
                this.boostTrail.stop();
            }
        } else {
            this.play('vehicle-idle', true);
            if (this.trail1) this.trail1.stop();
            if (this.trail2) this.trail2.stop();
            if (this.boostTrail) this.boostTrail.stop();
        }
        
        // Update visual speed indicator
        this.updateSpeedIndicator();
    }
    
    increaseSpeed() {
        if (this.currentSpeedLevel < 5) {
            this.currentSpeedLevel++;
            this.speed = this.minSpeed + ((this.maxSpeed - this.minSpeed) / 4) * (this.currentSpeedLevel - 1);
            this.boostSpeed = this.speed * 1.5;
            
            // Update UI
            const speedEl = document.getElementById('speed-indicator');
            if (speedEl) {
                speedEl.textContent = `Speed: ${this.currentSpeedLevel}/5 (${Math.round(this.speed)} px/s)`;
            }
            
            // Visual feedback
            this.scene.tweens.add({
                targets: this,
                scaleX: 1.3,
                scaleY: 1.3,
                duration: 100,
                yoyo: true,
                ease: 'Power2'
            });
        }
    }
    
    decreaseSpeed() {
        if (this.currentSpeedLevel > 1) {
            this.currentSpeedLevel--;
            this.speed = this.minSpeed + ((this.maxSpeed - this.minSpeed) / 4) * (this.currentSpeedLevel - 1);
            this.boostSpeed = this.speed * 1.5;
            
            // Update UI
            const speedEl = document.getElementById('speed-indicator');
            if (speedEl) {
                speedEl.textContent = `Speed: ${this.currentSpeedLevel}/5 (${Math.round(this.speed)} px/s)`;
            }
            
            // Visual feedback
            this.scene.tweens.add({
                targets: this,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100,
                yoyo: true,
                ease: 'Power2'
            });
        }
    }
    
    updateSpeedIndicator() {
        // Visual feedback for speed - change tint based on speed
        const speedRatio = (this.speed - this.minSpeed) / (this.maxSpeed - this.minSpeed);
        if (speedRatio < 0.33) {
            this.setTint(0x00ff00); // Green - slow
        } else if (speedRatio < 0.66) {
            this.setTint(0x00ffff); // Cyan - medium
        } else {
            this.setTint(0xff00ff); // Magenta - fast
        }
    }
    
    activate() {
        this.isActive = true;
        this.playerInside = true;
        // Disable gravity when vehicle is active (can fly)
        this.body.setAllowGravity(false);
        
        // Reset speed to level 1 when entering
        this.currentSpeedLevel = 1;
        this.speed = this.minSpeed;
        this.boostSpeed = this.speed * 1.5;
        
        // Update speed indicator visual
        this.updateSpeedIndicator();
        
        // Show speed indicator UI
        const speedEl = document.getElementById('speed-indicator');
        if (speedEl) {
            speedEl.style.display = 'block';
            speedEl.textContent = `Speed: ${this.currentSpeedLevel}/5 (${Math.round(this.speed)} px/s)`;
        }
        
        // Electric activation effect
        this.scene.tweens.add({
            targets: this,
            alpha: 0.7,
            duration: 200,
            yoyo: true,
            ease: 'Power2'
        });
    }
    
    deactivate() {
        this.isActive = false;
        this.playerInside = false;
        this.setTint(0xffffff);
        this.setRotation(0); // Reset rotation
        this.targetRotation = 0;
        this.rotationSpeed = 0;
        if (this.trail1) {
            this.trail1.stop();
        }
        if (this.trail2) {
            this.trail2.stop();
        }
        if (this.boostTrail) {
            this.boostTrail.stop();
        }
        this.setVelocity(0, 0);
        // Re-enable gravity when vehicle is inactive
        this.body.setAllowGravity(true);
        
        // Hide speed indicator
        const speedEl = document.getElementById('speed-indicator');
        if (speedEl) {
            speedEl.style.display = 'none';
        }
    }
    
    travelToNextUniverse() {
        // Create Interstellar-style universe travel effect
        try {
            // Main warp tunnel effect (like Interstellar)
            const warpTunnel = this.scene.add.particles(this.x, this.y, 'particle', {
                speed: { min: 300, max: 600 },
                scale: { start: 2, end: 0 },
                tint: [0x00ffff, 0xffffff, 0x00aaff, 0xff00ff],
                lifespan: 1500,
                frequency: 50,
                emitZone: { type: 'edge', source: new Phaser.Geom.Circle(0, 0, 80), quantity: 200 }
            });
            
            // Stellar streaks (Interstellar effect)
            const stellarStreaks = this.scene.add.particles(this.x, this.y, 'particle', {
                speed: { min: 400, max: 800 },
                scale: { start: 3, end: 0 },
                tint: [0xffffff, 0x00ffff],
                lifespan: 1200,
                frequency: 40,
                emitZone: { type: 'edge', source: new Phaser.Geom.Circle(0, 0, 100), quantity: 150 }
            });
            
            // Time dilation effect
            const timeDilation = this.scene.add.particles(this.x, this.y, 'particle', {
                speed: { min: 200, max: 500 },
                scale: { start: 1.5, end: 0 },
                tint: [0xff00ff, 0x00ffff, 0xffffff],
                lifespan: 2000,
                frequency: 60,
                emitZone: { type: 'edge', source: new Phaser.Geom.Circle(0, 0, 120), quantity: 100 }
            });
            
            // Jet acceleration effect
            this.scene.tweens.add({
                targets: this,
                scaleX: 2,
                scaleY: 2,
                alpha: 0.3,
                rotation: Math.PI * 2,
                duration: 800,
                ease: 'Power3'
            });
            
            // Create star field warp effect
            this.scene.tweens.add({
                targets: this.scene.cameras.main,
                zoom: 3,
                duration: 1000,
                ease: 'Power2'
            });
            
            if (warpTunnel) {
                this.scene.time.delayedCall(1500, () => {
                    if (warpTunnel && warpTunnel.destroy) warpTunnel.destroy();
                    if (stellarStreaks && stellarStreaks.destroy) stellarStreaks.destroy();
                    if (timeDilation && timeDilation.destroy) timeDilation.destroy();
                    // Reset camera zoom
                    this.scene.cameras.main.setZoom(1);
                });
            }
        } catch (error) {
            console.warn('Could not create warp effect:', error);
        }
        
        return true;
    }
}

