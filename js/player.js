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
        // Create a simple player sprite using graphics
        const graphics = this.scene.add.graphics();
        
        // Body (blue astronaut-like figure)
        graphics.fillStyle(0x00aaff);
        graphics.fillRect(0, 0, 40, 60);
        
        // Helmet
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(20, 15, 18);
        
        // Visor
        graphics.fillStyle(0x00ffff);
        graphics.fillRect(8, 10, 24, 12);
        
        // Arms
        graphics.fillStyle(0x00aaff);
        graphics.fillRect(-8, 20, 12, 30);
        graphics.fillRect(36, 20, 12, 30);
        
        // Legs
        graphics.fillRect(8, 50, 12, 20);
        graphics.fillRect(20, 50, 12, 20);
        
        graphics.generateTexture('player', 60, 80);
        graphics.destroy();
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
        // Hide player when entering vehicle
        this.setVisible(false);
        this.setActive(false);
    }
    
    exitVehicle(x, y) {
        // Show player when exiting vehicle
        this.setPosition(x, y);
        this.setVisible(true);
        this.setActive(true);
    }
}

