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
        this.load.image('grass', './assets/images/grassyice.png');
        this.load.image('background', './assets/images/nightback.png');
        this.load.image('icicle', './assets/images/icicle.png');
        this.load.spritesheet('imp', './assets/spritesheets/imp.png', {
            frameWidth: 50,
            frameHeight: 30
        });
        this.load.audio('backgroundMusic2', 'assets/sfx/Push 1.mp3');
        this.load.audio('JumpNoise', 'assets/sfx/JumpNoise.mp3');
        this.load.audio('RollNoise', 'assets/sfx/RollNoise.mp3');
        this.load.audio('DeathNoise', 'assets/sfx/DeathNoise.mp3');
    }

    create() {
        this.backgroundMusic2 = this.sound.add('backgroundMusic2');
        this.JumpNoise = this.sound.add('JumpNoise');
        this.RollNoise = this.sound.add('RollNoise');
        this.DeathNoise = this.sound.add('DeathNoise');
        this.backgroundMusic2.play({ loop: true });
        this.backgroundMusic2.setVolume(0.25);
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
        this.anims.create({
            key: 'imp-animation',
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('imp', {
                start: 0,
                end: 1
            })
        });

        this.icicles = this.physics.add.group();

        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.icicles, this.ground);
        
        this.physics.add.overlap(this.player, this.icicles, this.icicleCollision, null, this);

        this.spawnObstacleTimer = this.time.addEvent({
            delay: Phaser.Math.Between(1000, 2500), // Adjust the delay as needed
            loop: true,
            callback: this.spawnObstacle,
            callbackScope: this
        })
        if(!this.highScore)
        {
            this.highScore = 0;
        }
        this.score = 0;
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        let scoreTextConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            color: '#FFFFFF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 200
        }
        this.scoreLeft = this.add.text(125, 10, this.p1Score, scoreConfig);
        this.scoreHigh = this.add.text(width-200, 10, this.highScore, scoreConfig);
        this.scoreTextHigh = this.add.text(width-400, 10, "High Score:", scoreTextConfig);
        this.scoreText = this.add.text(-75, 10, "Score:", scoreTextConfig);
        this.time.addEvent({
            delay: 75,
            repeat: -1, // Repeat indefinitely
            callback: () => {
                this.score++; // Increment the score
                this.scoreLeft.setText(this.score); // Update the displayed score
                if(this.highScore < this.score)
                {
                    this.highScore = this.score;
                    this.scoreHigh.setText(this.highScore);
                }
            }
        });
        this.obstacleDelayMin = 800;
        this.obstacleDelayMax = 2500;
    }
    

    spawnObstacle() {
        const x = this.scale.width;
        const y = this.scale.height - 75; // Position the obstacle on top of the ground
        let obstacle;

        if (Phaser.Math.Between(0, 1) === 0) {
            obstacle = this.icicles.create(x, y, 'icicle').setScale(0.19);
            obstacle.body.setSize(width / 4, height + 50, 30,0);
        } else {
            // Spawn an imp
            var yVal = Phaser.Math.Between(30, 80);
            obstacle = this.icicles.create(x, y-yVal, 'imp').setScale(4); // Adjust scale as needed
            obstacle.body.setSize(obstacle.width/2.5, obstacle.height/2.7).setOffset(20,8); // Set collision size accordingly
            obstacle.anims.play('imp-animation');
        }

        obstacle.body.allowGravity = false; // Disable gravity for the obstacle

        // Set a random delay for the next obstacle spawn
        const randomDelay = Phaser.Math.Between(this.obstacleDelayMin, this.obstacleDelayMax); // Adjust the delay range as needed
        this.spawnObstacleTimer.delay = randomDelay;

        if (this.score > 0 && this.score % 150 === 0 && this.obstacleDelayMin >= 300) {
            this.obstacleDelayMin -= 30; // Decrease the minimum delay
            this.obstacleDelayMax -= 100; // Decrease the maximum delay
        }

        obstacle.setVelocityX(this.backgroundSpeed * -60); // Make the obstacle scroll along with the ground
        obstacle.setImmovable(true);
    }

    icicleCollision(player, icicle) {
        this.backgroundMusic2.stop();
        this.DeathNoise.play();
        this.scene.start('menuScene');
    }

    update() {
        this.isPlayerRolling = false;
        this.player.body.setGravityY(300);
        // Move the background layer for parallax scrolling
        // this.background.tilePositionX += this.backgroundSpeed;
        this.ground.tilePositionX += this.backgroundSpeed;
        this.background.tilePositionX += this.backgroundSpeed/2;
        if (this.score > 0 && this.score % 100 === 0) {
            this.backgroundSpeed+=0.12
        }
        // Update the player's movement
        let playerVector = new Phaser.Math.Vector2(0, 0);
        playerDirection = 'right';
    
        if (cursors.up.isDown && !this.isPlayerJumping) {
            // Player is pressing up and not already jumping
            this.isPlayerJumping = true;
            this.player.setVelocityY(this.PLAYER_JUMP_VELOCITY); // Apply jump velocity
            this.JumpNoise.play();
        }
        if (cursors.down.isDown && !this.isPlayerRolling) {
            // Player is pressing down and not already rolling
            this.RollNoise.play();
            this.isPlayerRolling = true;
            this.player.body.setGravityY(6000); // Apply higher gravity when rolling
            this.player.body.setSize(25, 15).setOffset(10, 25);
            this.player.anims.play('roll-right', true); // Play the rolling animation
            
            
        } else {
            this.player.anims.play('walk-right', true);
            this.player.body.setSize(20, 30).setOffset(15, 10);
        }

            

    
        playerVector.normalize();
    
        // Reset the jump state if the player is on the ground
        if (this.player.body.onFloor()) {
            this.isPlayerJumping = false;
        }
    }
}