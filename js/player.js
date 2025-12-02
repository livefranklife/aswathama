// Player Class - Ashwatthama Alpha
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Player properties
        this.setCollideWorldBounds(true);
        this.setBounce(0.2);
        this.setScale(0.8);
        
        // Movement properties
        this.speed = 200;
        this.jumpPower = -500;
        this.isOnGround = false;
        this.canJump = true;
        
        // Vehicle state
        this.inVehicle = false;
        this.vehicle = null;
        
        // Animation states
        this.facingRight = true;
        
        // Create player graphics (simple colored rectangle for now)
        this.createPlayerGraphics();
        
        // Create animations
        this.createAnimations();
        
        // Set initial animation
        this.play('idle');
    }
    
    createPlayerGraphics() {
        try {
            // Check if texture already exists
            if (this.scene.textures.exists('player')) {
                return;
            }
            
            // Create a simple player sprite using graphics
            const graphics = this.scene.add.graphics();
            
            // Enhanced Spaceman Design
            // Body (space suit - white/orange)
            graphics.fillStyle(0xffffff);
            graphics.fillRect(12, 20, 36, 50);
            
            // Helmet (large, reflective)
            graphics.fillStyle(0xffffff);
            graphics.fillCircle(30, 15, 20);
            
            // Helmet visor (golden reflective)
            graphics.fillStyle(0xffd700);
            graphics.fillRect(15, 8, 30, 18);
            graphics.fillStyle(0x00aaff, 0.6);
            graphics.fillRect(18, 11, 24, 12);
            
            // Space suit details
            graphics.fillStyle(0xff6600);
            graphics.fillRect(15, 25, 30, 8); // Chest panel
            graphics.fillRect(15, 35, 30, 6); // Belt
            
            // Arms (with joints)
            graphics.fillStyle(0xffffff);
            graphics.fillRect(-5, 25, 12, 35);
            graphics.fillRect(48, 25, 12, 35);
            graphics.fillStyle(0xff6600);
            graphics.fillRect(-3, 30, 8, 8); // Shoulder joint
            graphics.fillRect(50, 30, 8, 8);
            
            // Legs (space boots)
            graphics.fillStyle(0xffffff);
            graphics.fillRect(12, 60, 14, 25);
            graphics.fillRect(34, 60, 14, 25);
            graphics.fillStyle(0x333333);
            graphics.fillRect(12, 80, 14, 5); // Boots
            graphics.fillRect(34, 80, 14, 5);
            
            // Backpack (life support)
            graphics.fillStyle(0x444444);
            graphics.fillRect(8, 25, 8, 30);
            graphics.fillStyle(0x00ff00);
            graphics.fillRect(10, 30, 4, 4); // Indicator light
            
            graphics.generateTexture('player', 60, 80);
            graphics.destroy();
        } catch (error) {
            console.error('Error creating player graphics:', error);
            // Create a simple fallback
            const graphics = this.scene.add.graphics();
            graphics.fillStyle(0x00aaff);
            graphics.fillRect(0, 0, 40, 60);
            graphics.generateTexture('player', 40, 60);
            graphics.destroy();
        }
    }
    
    createAnimations() {
        const scene = this.scene;
        
        // Idle animation
        if (!scene.anims.exists('idle')) {
            scene.anims.create({
                key: 'idle',
                frames: [{ key: 'player', frame: 0 }],
                frameRate: 1,
                repeat: -1
            });
        }
        
        // Walk animation (we'll create a simple pulsing effect)
        if (!scene.anims.exists('walk')) {
            scene.anims.create({
                key: 'walk',
                frames: [{ key: 'player', frame: 0 }],
                frameRate: 8,
                repeat: -1
            });
        }
        
        // Jump animation
        if (!scene.anims.exists('jump')) {
            scene.anims.create({
                key: 'jump',
                frames: [{ key: 'player', frame: 0 }],
                frameRate: 1,
                repeat: 0
            });
        }
    }
    
    update(cursors) {
        // If player is in vehicle, update position relative to vehicle
        if (this.inVehicle) {
            this.updateInVehicle();
            return;
        }
        
        // Horizontal movement
        if (cursors.left.isDown || cursors.a.isDown) {
            this.setVelocityX(-this.speed);
            this.setFlipX(true);
            this.facingRight = false;
            if (this.isOnGround) {
                this.play('walk', true);
            }
        } else if (cursors.right.isDown || cursors.d.isDown) {
            this.setVelocityX(this.speed);
            this.setFlipX(false);
            this.facingRight = true;
            if (this.isOnGround) {
                this.play('walk', true);
            }
        } else {
            this.setVelocityX(0);
            if (this.isOnGround) {
                this.play('idle', true);
            }
        }
        
        // Jump
        if ((cursors.up.isDown || cursors.space.isDown || cursors.w.isDown) && this.isOnGround && this.canJump) {
            this.setVelocityY(this.jumpPower);
            this.isOnGround = false;
            this.canJump = false;
            this.play('jump', true);
            
            // Reset jump ability after a short delay
            this.scene.time.delayedCall(100, () => {
                this.canJump = true;
            });
        }
        
        // Check if on ground
        this.isOnGround = this.body.touching.down;
    }
    
    enterVehicle(vehicle) {
        // Keep player visible inside vehicle cockpit
        this.inVehicle = true;
        this.vehicle = vehicle;
        // Make player smaller to fit in cockpit
        this.setScale(0.5);
        // Set player depth higher than vehicle so it appears on top
        this.setDepth(10);
        // Disable physics when in vehicle
        this.body.setAllowGravity(false);
        this.setVelocity(0, 0);
    }
    
    exitVehicle(x, y) {
        // Exit vehicle and restore normal size
        this.inVehicle = false;
        this.vehicle = null;
        this.setPosition(x, y);
        this.setScale(0.8); // Restore normal scale
        this.setVisible(true);
        this.setActive(true);
        // Reset depth
        this.setDepth(0);
        // Re-enable physics
        this.body.setAllowGravity(true);
    }
    
    updateInVehicle() {
        if (this.inVehicle && this.vehicle) {
            // Position player inside vehicle cockpit (slightly above center)
            this.setPosition(this.vehicle.x, this.vehicle.y - 10);
            // Make player face the same direction as vehicle movement
            if (this.vehicle.body.velocity.x < 0) {
                this.setFlipX(true);
            } else if (this.vehicle.body.velocity.x > 0) {
                this.setFlipX(false);
            }
            // Play idle animation when in vehicle
            this.play('idle', true);
        }
    }
}

