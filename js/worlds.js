// World/Planet Generator
class WorldGenerator {
    constructor(scene) {
        this.scene = scene;
        this.currentPlanet = null;
        this.platforms = null;
        this.stars = null;
        this.background = null;
    }
    
    createWorld(planetData) {
        // Clear previous world
        if (this.platforms) {
            this.platforms.destroy(true);
        }
        if (this.stars) {
            this.stars.destroy(true);
        }
        if (this.background) {
            this.background.destroy();
        }
        
        // Create background based on planet
        this.createBackground(planetData);
        
        // Create starfield
        this.createStarfield(planetData);
        
        // Create platforms
        this.createPlatforms(planetData);
        
        // Create planet-specific effects
        this.createPlanetEffects(planetData);
        
        this.currentPlanet = planetData;
    }
    
    createBackground(planetData) {
        // Create gradient background
        const graphics = this.scene.add.graphics();
        
        // Base color from planet
        const color = planetData.color;
        const r = (color >> 16) & 0xFF;
        const g = (color >> 8) & 0xFF;
        const b = color & 0xFF;
        
        // Create gradient
        graphics.fillGradientStyle(
            color, color,
            Phaser.Display.Color.GetColor(r * 0.3, g * 0.3, b * 0.3),
            Phaser.Display.Color.GetColor(r * 0.3, g * 0.3, b * 0.3),
            1
        );
        graphics.fillRect(0, 0, CONFIG.width, CONFIG.height);
        
        graphics.generateTexture('background', CONFIG.width, CONFIG.height);
        this.background = this.scene.add.image(0, 0, 'background');
        this.background.setOrigin(0, 0);
        this.background.setDepth(-100);
        graphics.destroy();
    }
    
    createStarfield(planetData) {
        this.stars = this.scene.add.group();
        
        const starCount = 200;
        for (let i = 0; i < starCount; i++) {
            const x = Phaser.Math.Between(0, CONFIG.width);
            const y = Phaser.Math.Between(0, CONFIG.height);
            const size = Phaser.Math.Between(1, 3);
            const brightness = Phaser.Math.FloatBetween(0.5, 1);
            
            const star = this.scene.add.circle(x, y, size, 0xffffff, brightness);
            star.setDepth(-50);
            this.stars.add(star);
        }
        
        // Animate stars
        this.scene.tweens.add({
            targets: this.stars.getChildren(),
            alpha: { from: 0.3, to: 1 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            stagger: 50
        });
    }
    
    createPlatforms(planetData) {
        this.platforms = this.scene.physics.add.staticGroup();
        
        const platformCount = planetData.size === 'large' ? 8 : planetData.size === 'medium' ? 6 : 4;
        const platformWidth = planetData.size === 'large' ? 200 : planetData.size === 'medium' ? 150 : 100;
        
        // Ground platform
        const ground = this.scene.add.rectangle(
            CONFIG.width / 2,
            CONFIG.height - 50,
            CONFIG.width,
            100,
            planetData.color,
            0.8
        );
        this.scene.physics.add.existing(ground, true);
        this.platforms.add(ground);
        
        // Floating platforms
        for (let i = 0; i < platformCount; i++) {
            const x = Phaser.Math.Between(100, CONFIG.width - 100);
            const y = Phaser.Math.Between(200, CONFIG.height - 200);
            
            const platform = this.scene.add.rectangle(
                x, y,
                platformWidth,
                30,
                planetData.color,
                0.9
            );
            
            // Add glow effect
            const glow = this.scene.add.rectangle(
                x, y,
                platformWidth + 10,
                40,
                planetData.color,
                0.3
            );
            glow.setDepth(-10);
            
            this.scene.physics.add.existing(platform, true);
            this.platforms.add(platform);
            
            // Animate platforms
            this.scene.tweens.add({
                targets: [platform, glow],
                y: y + Phaser.Math.Between(-30, 30),
                duration: Phaser.Math.Between(2000, 4000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }
    
    createPlanetEffects(planetData) {
        // Create planet-specific visual effects
        
        // Black hole special effects
        if (planetData.name.includes('Black Hole') || planetData.name.includes('Event Horizon')) {
            this.createBlackHoleEffect();
        }
        
        // Nebula effects
        if (planetData.name.includes('Nebula') || planetData.name.includes('Stardust')) {
            this.createNebulaEffect(planetData.color);
        }
        
        // Energy field effects
        if (planetData.name.includes('Energy')) {
            this.createEnergyFieldEffect();
        }
    }
    
    createBlackHoleEffect() {
        // Create swirling particles
        const centerX = CONFIG.width / 2;
        const centerY = CONFIG.height / 2;
        
        // Create particle system for black hole
        const blackHole = this.scene.add.circle(centerX, centerY, 100, 0x000000, 0.9);
        blackHole.setDepth(-20);
        
        // Swirling particles
        this.scene.tweens.add({
            targets: blackHole,
            scale: { from: 0.8, to: 1.2 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createNebulaEffect(color) {
        // Create colorful nebula clouds
        for (let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(0, CONFIG.width);
            const y = Phaser.Math.Between(0, CONFIG.height);
            const size = Phaser.Math.Between(100, 200);
            
            const cloud = this.scene.add.ellipse(x, y, size, size * 0.6, color, 0.2);
            cloud.setDepth(-30);
            
            this.scene.tweens.add({
                targets: cloud,
                x: x + Phaser.Math.Between(-200, 200),
                y: y + Phaser.Math.Between(-200, 200),
                duration: Phaser.Math.Between(5000, 10000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }
    
    createEnergyFieldEffect() {
        // Create energy particles
        try {
            const particles = this.scene.add.particles(0, 0, 'particle', {
                x: { min: 0, max: CONFIG.width },
                y: { min: 0, max: CONFIG.height },
                speed: { min: 20, max: 50 },
                scale: { start: 0.5, end: 0 },
                tint: 0x00ff00,
                lifespan: 2000,
                frequency: 100
            });
            
            if (particles) {
                particles.setDepth(-25);
            }
        } catch (error) {
            console.warn('Could not create energy field effect:', error);
        }
    }
    
    getPlatforms() {
        return this.platforms;
    }
}

