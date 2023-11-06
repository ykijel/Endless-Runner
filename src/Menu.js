class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }

    preload() {
        // load audio
        this.load.image('logo', './assets/spritesheets/gamelogo.png');
        this.load.audio('backgroundMusic', 'assets/spritesheets/Push.mp3');
        this.load.audio('blip', 'assets/spritesheets/blip_select12.wav');
      }

    create() {
        this.backgroundMusic = this.sound.add('backgroundMusic');
        this.blip = this.sound.add('blip');
        this.backgroundMusic.play({ loop: true });
        this.backgroundMusic.setVolume(0.3);
        this.add.image(width/2, height/3.5, 'logo').setScale(0.5);
        cursors = this.input.keyboard.createCursorKeys();
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            color: '#FF0000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.add.text(this.scale.width/2, this.scale.height/1.8, 'You have escaped hell itself.', menuConfig).setOrigin(0.5);
        this.add.text(this.scale.width/2, this.scale.height/1.68, 'Your creator is not too happy.', menuConfig).setOrigin(0.5);
        this.add.text(this.scale.width/2, this.scale.height/1.5, 'Use UP ARROW to jump and hold DOWN ARROW to lunge/roll', menuConfig).setOrigin(0.5);
        this.add.text(this.scale.width/2, this.scale.height/1.4, 'Press SPACE to play', menuConfig).setOrigin(0.5);

    }

    update() {
        if (cursors.space.isDown) {
          this.backgroundMusic.stop();
          this.blip.play();
          this.scene.start('playScene');
          
        }
    }


}
