class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload() {
        this.load.spritesheet('character', './assets/spritesheets/Player.png', {
            frameWidth: 48,
            frameHeight: 48
        });
        this.load.spritesheet('characterroll', './assets/spritesheets/Roll.png', {
            frameWidth: 48,
            frameHeight: 48
        });
        this.load.image('grass', './assets/spritesheets/grassy.png');
        this.load.image('background', './assets/spritesheets/fireback.png');
        this.load.image('cactus', './assets/spritesheets/cactus.png');
    }

    create() {
        // Create the background and set its scrolling speed
        this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background').setOrigin(0);
        this.backgroundSpeed = 7; // Adjust the speed as needed

        // Create the ground sprite and a corresponding physics body
        this.ground = this.add.tileSprite(0, this.scale.height - 33, this.scale.width, 30, 'grass').setOrigin(0);
        this.physics.world.enable(this.ground);
        this.ground.body.allowGravity = false;
        this.ground.body.immovable = true;

        // Create the player sprite and add it to the physics system
        this.player = this.physics.add.sprite(100, this.scale.height / 1.2, 'character').setScale(2);
        this.player.body.setCollideWorldBounds(true);
        this.player.body.setSize(25, 30).setOffset(10, 10);
        this.player.body.setGravityY(300);

        // Set up player jump configuration
        this.PLAYER_VELOCITY = 350;
        this.PLAYER_JUMP_VELOCITY = -600;
        this.isPlayerJumping = false;
        this.isPlayerRolling = false;

        cursors = this.input.keyboard.createCursorKeys();

        // Enable collisions between the player and the ground
        this.physics.add.collider(this.player, this.ground);

        this.anims.create({
            key: 'walk-right',
            frameRate: 13,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('character', {
                start: 0,
                end: 7
            })
        });
        this.anims.create({
            key: 'roll-right',
            frameRate: 13,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('characterroll', {
                start: 0,
                end: 6
            })
        });

        // Create a group for cacti
        this.cacti = this.physics.add.group();

                // Enable collisions between the player and the cacti
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.cacti, this.ground);
        
                // Set up overlap detection between the player and the cacti
        this.physics.add.overlap(this.player, this.cacti, this.cactusCollision, null, this);

        // Set up a timer event to spawn cacti at random intervals
        this.spawnCactusTimer = this.time.addEvent({
            delay: Phaser.Math.Between(1000, 5000), // Adjust the delay as needed
            loop: true,
            callback: this.spawnCactus,
            callbackScope: this
        });
    }

    spawnCactus() {
        const x = this.scale.width;
        const y = this.scale.height - 61; // Position the cactus on top of the ground
        const cactus = this.cacti.create(x, y, 'cactus').setScale(0.15);
        cactus.body.setSize(width/2, height+50, 30, 0);
        cactus.body.allowGravity = false; // Disable gravity for the cactus
    
        // Set a random delay for the next cactus spawn
        const randomDelay = Phaser.Math.Between(1000, 3000); // Adjust the delay range as needed
        this.spawnCactusTimer.delay = randomDelay;
    
        cactus.setVelocityX(this.backgroundSpeed * -60); // Make the cactus scroll along with the ground
        cactus.setImmovable(true);
    }
    cactusCollision(player, cactus) {
        this.scene.start('menuScene');
    }

    update() {
        this.isPlayerRolling = false;
        this.player.body.setGravityY(300);
        // Move the background layer for parallax scrolling
        // this.background.tilePositionX += this.backgroundSpeed;
        this.ground.tilePositionX += this.backgroundSpeed;
    
        // Update the player's movement
        let playerVector = new Phaser.Math.Vector2(0, 0);
        playerDirection = 'right';
    
        if (cursors.up.isDown && !this.isPlayerJumping) {
            // Player is pressing up and not already jumping
            this.isPlayerJumping = true;
            this.player.setVelocityY(this.PLAYER_JUMP_VELOCITY); // Apply jump velocity
        }
        if (cursors.down.isDown && !this.isPlayerRolling) {
            // Player is pressing down and not already rolling
            this.isPlayerRolling = true;
            this.player.body.setGravityY(6000); // Apply higher gravity when rolling
            this.player.body.setSize(25, 15).setOffset(10, 25);
            this.player.anims.play('roll-right', true); // Play the rolling animation
        } else {
            this.player.anims.play('walk-right', true);
            this.player.body.setSize(25, 30).setOffset(10, 10);
        }
    
        playerVector.normalize();
    
        this.player.setVelocityX(this.PLAYER_VELOCITY * playerVector.x);
    
        // Reset the jump state if the player is on the ground
        if (this.player.body.onFloor()) {
            this.isPlayerJumping = false;
        }
    }
}