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
        // Get universe data
        const universe = UNIVERSES[currentUniverseIndex];
        const bgType = universe.bgType || 'default';
        
        // Create galaxy-themed backgrounds
        const graphics = this.scene.add.graphics();
        
        if (bgType === 'milkyway') {
            // Milky Way Galaxy - spiral galaxy effect
            this.createMilkyWayBackground(graphics);
        } else if (bgType === 'comet') {
            // Comet field - dark with comet trails
            this.createCometBackground(graphics);
        } else if (bgType === 'solar') {
            // Solar system - bright with sun
            this.createSolarBackground(graphics);
        } else if (bgType === 'blackhole') {
            // Black hole - dark with swirling effect
            this.createBlackHoleBackground(graphics);
        } else if (bgType === 'andromeda') {
            // Andromeda galaxy - purple spiral
            this.createAndromedaBackground(graphics);
        } else if (bgType === 'nebula') {
            // Nebula - colorful clouds
            this.createNebulaBackground(graphics);
        } else if (bgType === 'parallel') {
            // Parallel universe - distorted colors
            this.createParallelBackground(graphics);
        } else if (bgType === 'centauri') {
            // Alpha Centauri - golden glow
            this.createCentauriBackground(graphics);
        } else {
            // Default gradient
            const color = planetData.color;
            const r = (color >> 16) & 0xFF;
            const g = (color >> 8) & 0xFF;
            const b = color & 0xFF;
            graphics.fillGradientStyle(
                color, color,
                Phaser.Display.Color.GetColor(r * 0.3, g * 0.3, b * 0.3),
                Phaser.Display.Color.GetColor(r * 0.3, g * 0.3, b * 0.3),
                1
            );
            graphics.fillRect(0, 0, CONFIG.width, CONFIG.height);
        }
        
        graphics.generateTexture('background', CONFIG.width, CONFIG.height);
        this.background = this.scene.add.image(0, 0, 'background');
        this.background.setOrigin(0, 0);
        this.background.setDepth(-100);
        graphics.destroy();
    }
    
    createMilkyWayBackground(graphics) {
        // Dark space base
        graphics.fillStyle(0x000011);
        graphics.fillRect(0, 0, CONFIG.width, CONFIG.height);
        
        // Milky Way spiral arms
        for (let i = 0; i < 3; i++) {
            const angle = (i * Math.PI * 2) / 3;
            const centerX = CONFIG.width / 2;
            const centerY = CONFIG.height / 2;
            
            graphics.fillStyle(0x4a4a6a, 0.4);
            graphics.beginPath();
            graphics.arc(centerX, centerY, 200 + i * 150, angle, angle + Math.PI * 0.5);
            graphics.fillPath();
        }
        
        // Galaxy center glow
        graphics.fillStyle(0xffffaa, 0.3);
        graphics.fillCircle(CONFIG.width / 2, CONFIG.height / 2, 100);
    }
    
    createCometBackground(graphics) {
        // Deep space
        graphics.fillStyle(0x000033);
        graphics.fillRect(0, 0, CONFIG.width, CONFIG.height);
        
        // Comet trails
        for (let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(0, CONFIG.width);
            const y = Phaser.Math.Between(0, CONFIG.height);
            const length = Phaser.Math.Between(100, 200);
            
            graphics.fillStyle(0x87ceeb, 0.5);
            graphics.fillTriangle(x, y, x - length * 0.3, y - length, x + length * 0.3, y - length);
        }
    }
    
    createSolarBackground(graphics) {
        // Bright space
        graphics.fillStyle(0x001122);
        graphics.fillRect(0, 0, CONFIG.width, CONFIG.height);
        
        // Sun in background
        graphics.fillStyle(0xffff00, 0.6);
        graphics.fillCircle(CONFIG.width - 150, 100, 120);
        graphics.fillStyle(0xffaa00, 0.8);
        graphics.fillCircle(CONFIG.width - 150, 100, 80);
        
        // Solar flares
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI * 2) / 8;
            const x = CONFIG.width - 150 + Math.cos(angle) * 100;
            const y = 100 + Math.sin(angle) * 100;
            graphics.fillStyle(0xff6600, 0.4);
            graphics.fillCircle(x, y, 20);
        }
    }
    
    createBlackHoleBackground(graphics) {
        // Deepest black
        graphics.fillStyle(0x000000);
        graphics.fillRect(0, 0, CONFIG.width, CONFIG.height);
        
        // Swirling accretion disk
        const centerX = CONFIG.width / 2;
        const centerY = CONFIG.height / 2;
        
        for (let r = 50; r < 300; r += 20) {
            graphics.fillStyle(0xff4500, 0.3);
            graphics.beginPath();
            graphics.arc(centerX, centerY, r, 0, Math.PI * 2);
            graphics.fillPath();
        }
        
        // Event horizon
        graphics.fillStyle(0x000000, 0.9);
        graphics.fillCircle(centerX, centerY, 80);
    }
    
    createAndromedaBackground(graphics) {
        // Purple space
        graphics.fillStyle(0x1a0033);
        graphics.fillRect(0, 0, CONFIG.width, CONFIG.height);
        
        // Andromeda spiral
        graphics.fillStyle(0x9370db, 0.5);
        graphics.beginPath();
        graphics.arc(CONFIG.width / 2, CONFIG.height / 2, 250, 0, Math.PI * 2);
        graphics.fillPath();
        
        // Galaxy center
        graphics.fillStyle(0xff69b4, 0.4);
        graphics.fillCircle(CONFIG.width / 2, CONFIG.height / 2, 120);
    }
    
    createNebulaBackground(graphics) {
        // Dark space
        graphics.fillStyle(0x000022);
        graphics.fillRect(0, 0, CONFIG.width, CONFIG.height);
        
        // Colorful nebula clouds
        const colors = [0xff1493, 0x9370db, 0x00ffff, 0x00ff00];
        for (let i = 0; i < 6; i++) {
            const x = Phaser.Math.Between(0, CONFIG.width);
            const y = Phaser.Math.Between(0, CONFIG.height);
            const size = Phaser.Math.Between(150, 300);
            const color = colors[Phaser.Math.Between(0, colors.length - 1)];
            
            graphics.fillStyle(color, 0.3);
            graphics.fillEllipse(x, y, size, size * 0.7);
        }
    }
    
    createParallelBackground(graphics) {
        // Distorted parallel universe
        graphics.fillStyle(0x330033);
        graphics.fillRect(0, 0, CONFIG.width, CONFIG.height);
        
        // Quantum distortion waves
        for (let i = 0; i < 5; i++) {
            const y = (CONFIG.height / 6) * (i + 1);
            graphics.fillStyle(0xff00ff, 0.2);
            graphics.fillRect(0, y, CONFIG.width, 30);
        }
        
        // Parallel reality portals
        graphics.fillStyle(0x9b59b6, 0.4);
        graphics.fillCircle(CONFIG.width / 4, CONFIG.height / 2, 80);
        graphics.fillCircle(CONFIG.width * 3 / 4, CONFIG.height / 2, 80);
    }
    
    createCentauriBackground(graphics) {
        // Golden space
        graphics.fillStyle(0x332200);
        graphics.fillRect(0, 0, CONFIG.width, CONFIG.height);
        
        // Alpha Centauri star system
        graphics.fillStyle(0xffff00, 0.8);
        graphics.fillCircle(100, 100, 100);
        graphics.fillStyle(0xffaa00, 0.9);
        graphics.fillCircle(100, 100, 70);
        
        // Companion star
        graphics.fillStyle(0xffff88, 0.6);
        graphics.fillCircle(250, 150, 60);
        
        // Golden glow
        graphics.fillStyle(0xffd700, 0.3);
        graphics.fillRect(0, 0, CONFIG.width, CONFIG.height);
    }
    
    createStarfield(planetData) {
        this.stars = this.scene.add.group();
        
        const universe = UNIVERSES[currentUniverseIndex];
        const bgType = universe.bgType || 'default';
        
        // More stars for galaxy backgrounds
        const starCount = bgType === 'milkyway' || bgType === 'andromeda' ? 400 : 200;
        
        for (let i = 0; i < starCount; i++) {
            const x = Phaser.Math.Between(0, CONFIG.width);
            const y = Phaser.Math.Between(0, CONFIG.height);
            const size = Phaser.Math.Between(1, bgType === 'solar' ? 4 : 3);
            const brightness = Phaser.Math.FloatBetween(0.5, 1);
            
            // Different star colors based on universe
            let starColor = 0xffffff;
            if (bgType === 'solar') starColor = 0xffffaa;
            else if (bgType === 'nebula') starColor = Phaser.Math.RND.pick([0xffffff, 0xff69b4, 0x00ffff]);
            else if (bgType === 'centauri') starColor = 0xffff88;
            
            const star = this.scene.add.circle(x, y, size, starColor, brightness);
            star.setDepth(-50);
            this.stars.add(star);
        }
        
        // Animate stars - twinkling effect
        this.scene.tweens.add({
            targets: this.stars.getChildren(),
            alpha: { from: 0.3, to: 1 },
            duration: Phaser.Math.Between(1500, 3000),
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            stagger: Phaser.Math.Between(20, 100)
        });
        
        // Add comets if in comet field
        if (bgType === 'comet') {
            this.createComets();
        }
    }
    
    createComets() {
        // Create animated comets
        for (let i = 0; i < 3; i++) {
            const startX = Phaser.Math.Between(-100, CONFIG.width + 100);
            const startY = Phaser.Math.Between(0, CONFIG.height);
            const endX = Phaser.Math.Between(0, CONFIG.width);
            const endY = Phaser.Math.Between(0, CONFIG.height);
            
            const comet = this.scene.add.circle(startX, startY, 8, 0x87ceeb, 0.9);
            comet.setDepth(-45);
            
            // Comet trail
            const trail = this.scene.add.graphics();
            trail.lineStyle(3, 0x87ceeb, 0.5);
            trail.lineBetween(startX, startY, startX - 50, startY - 30);
            trail.setDepth(-46);
            
            // Animate comet
            this.scene.tweens.add({
                targets: [comet, trail],
                x: endX,
                y: endY,
                duration: Phaser.Math.Between(3000, 6000),
                onComplete: () => {
                    comet.destroy();
                    trail.destroy();
                    // Create new comet
                    this.createComets();
                }
            });
        }
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
        // Create planet-specific visual effects based on type
        const universe = UNIVERSES[currentUniverseIndex];
        
        if (planetData.type === 'comet') {
            this.createCometEffect(planetData);
        } else if (planetData.type === 'gas_giant') {
            this.createGasGiantEffect(planetData);
        } else if (planetData.type === 'blackhole') {
            this.createBlackHoleEffect();
        } else if (planetData.type === 'nebula') {
            this.createNebulaEffect(planetData.color);
        } else if (planetData.type === 'parallel') {
            this.createParallelEffect();
        } else if (planetData.type === 'final') {
            this.createFinalEffect();
        }
        
        // Legacy checks for compatibility
        if (planetData.name.includes('Black Hole') || planetData.name.includes('Event Horizon')) {
            this.createBlackHoleEffect();
        }
        if (planetData.name.includes('Nebula') || planetData.name.includes('Stardust')) {
            this.createNebulaEffect(planetData.color);
        }
        if (planetData.name.includes('Energy')) {
            this.createEnergyFieldEffect();
        }
    }
    
    createCometEffect(planetData) {
        // Icy comet particles
        try {
            const particles = this.scene.add.particles(0, 0, 'particle', {
                x: { min: 0, max: CONFIG.width },
                y: { min: 0, max: CONFIG.height },
                speed: { min: 30, max: 80 },
                scale: { start: 0.8, end: 0 },
                tint: [0x87ceeb, 0xb0e0e6, 0xffffff],
                lifespan: 2000,
                frequency: 150,
                gravityY: 50
            });
            if (particles) {
                particles.setDepth(-25);
            }
        } catch (error) {
            console.warn('Could not create comet effect:', error);
        }
    }
    
    createGasGiantEffect(planetData) {
        // Swirling gas clouds
        for (let i = 0; i < 3; i++) {
            const x = Phaser.Math.Between(0, CONFIG.width);
            const y = Phaser.Math.Between(0, CONFIG.height);
            const size = Phaser.Math.Between(80, 150);
            
            const cloud = this.scene.add.ellipse(x, y, size, size * 0.5, planetData.color, 0.4);
            cloud.setDepth(-30);
            
            this.scene.tweens.add({
                targets: cloud,
                rotation: Math.PI * 2,
                duration: Phaser.Math.Between(5000, 10000),
                repeat: -1,
                ease: 'Linear'
            });
        }
    }
    
    createParallelEffect() {
        // Quantum distortion waves
        for (let i = 0; i < 3; i++) {
            const wave = this.scene.add.rectangle(
                CONFIG.width / 2,
                CONFIG.height / 2 + (i - 1) * 100,
                CONFIG.width,
                5,
                0xff00ff,
                0.5
            );
            wave.setDepth(-20);
            
            this.scene.tweens.add({
                targets: wave,
                alpha: { from: 0.2, to: 0.8 },
                duration: 2000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }
    
    createFinalEffect() {
        // Golden victory particles
        try {
            const particles = this.scene.add.particles(0, 0, 'particle', {
                x: { min: 0, max: CONFIG.width },
                y: { min: 0, max: CONFIG.height },
                speed: { min: 20, max: 60 },
                scale: { start: 1, end: 0 },
                tint: [0xffff00, 0xffd700, 0xffaa00],
                lifespan: 3000,
                frequency: 200
            });
            if (particles) {
                particles.setDepth(-25);
            }
        } catch (error) {
            console.warn('Could not create final effect:', error);
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

