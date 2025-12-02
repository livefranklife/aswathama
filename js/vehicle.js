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
        
        // Movement properties - Electric Rocket
        this.baseSpeed = 200;
        this.speed = 200;
        this.minSpeed = 100;
        this.maxSpeed = 800;
        this.speedMultiplier = 1.0;
        this.boostSpeed = 600;
        this.isActive = false;
        this.playerInside = false;
        this.currentSpeedLevel = 1; // 1-5 speed levels
        
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
        
        // Electric Rocket Design with transparent cockpit for player visibility
        // Main rocket body (sleek, electric blue)
        graphics.fillStyle(0x00aaff);
        graphics.fillRect(10, 0, 60, 80);
        
        // Rocket nose cone
        graphics.fillStyle(0x00ffff);
        graphics.fillTriangle(40, 0, 20, 20, 60, 20);
        
        // Cockpit window (transparent with glow border for player visibility)
        graphics.fillStyle(0x00ffff, 0.3); // Semi-transparent
        graphics.fillRect(25, 15, 30, 25);
        // Cockpit border glow
        graphics.lineStyle(2, 0x00ffff, 0.8);
        graphics.strokeRect(25, 15, 30, 25);
        
        // Electric panels on sides
        graphics.fillStyle(0x00ff00);
        graphics.fillRect(5, 25, 8, 15);
        graphics.fillRect(67, 25, 8, 15);
        graphics.fillRect(5, 45, 8, 15);
        graphics.fillRect(67, 45, 8, 15);
        
        // Rocket fins
        graphics.fillStyle(0x0088ff);
        graphics.fillRect(-5, 50, 15, 20);
        graphics.fillRect(70, 50, 15, 20);
        
        // Main engine (electric blue glow)
        graphics.fillStyle(0x00ffff);
        graphics.fillRect(25, 75, 30, 15);
        
        // Secondary engines
        graphics.fillStyle(0x00ff00);
        graphics.fillRect(10, 80, 12, 10);
        graphics.fillRect(58, 80, 12, 10);
        
        graphics.generateTexture('vehicle', 80, 100);
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
        // Create electric rocket engine trail
        try {
            // Main engine trail (electric blue)
            this.trail = this.scene.add.particles(this.x, this.y, 'particle', {
                speed: { min: 80, max: 150 },
                scale: { start: 0.5, end: 0 },
                tint: [0x00ffff, 0x00ff00, 0xffffff],
                lifespan: 400,
                frequency: 80,
                follow: this,
                followOffset: { x: 0, y: 45 }
            });
            
            // Side engine trails
            this.sideTrail1 = this.scene.add.particles(this.x, this.y, 'particle', {
                speed: { min: 50, max: 100 },
                scale: { start: 0.3, end: 0 },
                tint: [0x00ff00, 0x00ffff],
                lifespan: 300,
                frequency: 60,
                follow: this,
                followOffset: { x: -20, y: 50 }
            });
            
            this.sideTrail2 = this.scene.add.particles(this.x, this.y, 'particle', {
                speed: { min: 50, max: 100 },
                scale: { start: 0.3, end: 0 },
                tint: [0x00ff00, 0x00ffff],
                lifespan: 300,
                frequency: 60,
                follow: this,
                followOffset: { x: 20, y: 50 }
            });
            
            if (this.trail) {
                this.trail.stop();
            }
            if (this.sideTrail1) {
                this.sideTrail1.stop();
            }
            if (this.sideTrail2) {
                this.sideTrail2.stop();
            }
        } catch (error) {
            console.warn('Could not create particle trail:', error);
            this.trail = null;
            this.sideTrail1 = null;
            this.sideTrail2 = null;
        }
    }
    
    update(cursors) {
        if (!this.isActive || !this.playerInside) {
            return;
        }
        
        // Boost with Shift
        let currentSpeed = cursors.shift && cursors.shift.isDown ? this.boostSpeed : this.speed;
        
        let velocityX = 0;
        let velocityY = 0;
        
        // Get game width for center calculation
        const gameWidth = this.scene.scale.width;
        const centerX = gameWidth / 2;
        
        // Movement controls - Left, Right, Center positioning
        const leftPressed = cursors.left && cursors.left.isDown;
        const rightPressed = cursors.right && cursors.right.isDown;
        const aPressed = cursors.a && cursors.a.isDown;
        const dPressed = cursors.d && cursors.d.isDown;
        
        if (leftPressed || aPressed) {
            // Move left
            velocityX = -currentSpeed;
        } else if (rightPressed || dPressed) {
            // Move right
            velocityX = currentSpeed;
        } else {
            // Center positioning - automatically center when no horizontal input
            const distanceToCenter = centerX - this.x;
            const threshold = 5; // Stop when within 5 pixels of center
            if (Math.abs(distanceToCenter) > threshold) {
                // Smooth centering with acceleration
                const centeringSpeed = Math.min(currentSpeed * 0.6, Math.abs(distanceToCenter) * 0.15);
                velocityX = Math.sign(distanceToCenter) * centeringSpeed;
            } else {
                // Snap to center if very close
                this.setX(centerX);
                velocityX = 0;
            }
        }
        
        // Vertical movement
        const upPressed = cursors.up && cursors.up.isDown;
        const downPressed = cursors.down && cursors.down.isDown;
        const wPressed = cursors.w && cursors.w.isDown;
        const sPressed = cursors.s && cursors.s.isDown;
        
        if (upPressed || wPressed) {
            velocityY = -currentSpeed;
        } else if (downPressed || sPressed) {
            velocityY = currentSpeed;
        }
        
        this.setVelocity(velocityX, velocityY);
        
        // Update particle trail intensity based on speed
        const isMoving = velocityX !== 0 || velocityY !== 0;
        if (isMoving) {
            this.play('vehicle-fly', true);
            if (this.trail) {
                this.trail.start();
                // Adjust particle frequency based on speed
                this.trail.setFrequency(Math.max(30, 80 * (this.speed / this.maxSpeed)));
            }
            if (this.sideTrail1) {
                this.sideTrail1.start();
            }
            if (this.sideTrail2) {
                this.sideTrail2.start();
            }
        } else {
            this.play('vehicle-idle', true);
            if (this.trail) {
                this.trail.stop();
            }
            if (this.sideTrail1) {
                this.sideTrail1.stop();
            }
            if (this.sideTrail2) {
                this.sideTrail2.stop();
            }
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
        if (this.trail) {
            this.trail.stop();
        }
        if (this.sideTrail1) {
            this.sideTrail1.stop();
        }
        if (this.sideTrail2) {
            this.sideTrail2.stop();
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
        // Create enhanced warp effect for universe travel
        try {
            // Main warp particles
            const warpEffect = this.scene.add.particles(this.x, this.y, 'particle', {
                speed: { min: 200, max: 400 },
                scale: { start: 1, end: 0 },
                tint: [0x00ffff, 0xff00ff, 0xffffff, 0x00ff00],
                lifespan: 1000,
                frequency: 20,
                emitZone: { type: 'edge', source: new Phaser.Geom.Circle(0, 0, 60), quantity: 100 }
            });
            
            // Electric energy burst
            const energyBurst = this.scene.add.particles(this.x, this.y, 'particle', {
                speed: { min: 300, max: 500 },
                scale: { start: 1.5, end: 0 },
                tint: [0x00ffff, 0x00ff00],
                lifespan: 800,
                frequency: 30,
                emitZone: { type: 'edge', source: new Phaser.Geom.Circle(0, 0, 40), quantity: 50 }
            });
            
            // Rocket glow effect
            this.scene.tweens.add({
                targets: this,
                scaleX: 1.5,
                scaleY: 1.5,
                alpha: 0.5,
                duration: 500,
                yoyo: true,
                ease: 'Power2'
            });
            
            if (warpEffect) {
                this.scene.time.delayedCall(1000, () => {
                    if (warpEffect && warpEffect.destroy) {
                        warpEffect.destroy();
                    }
                    if (energyBurst && energyBurst.destroy) {
                        energyBurst.destroy();
                    }
                });
            }
        } catch (error) {
            console.warn('Could not create warp effect:', error);
        }
        
        return true;
    }
}

