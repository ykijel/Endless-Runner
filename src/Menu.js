class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }

    preload() {
        // load audio
        this.load.image('logo', './assets/spritesheets/gamelogo.png');
      }

    create() {
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
        this.add.text(this.scale.width/2, this.scale.height/1.5, 'Use up arrow to jump and hold down arrow to lunge/roll', menuConfig).setOrigin(0.5);
        this.add.text(this.scale.width/2, this.scale.height/1.4, 'Press SPACE to play', menuConfig).setOrigin(0.5);

    }

    update() {
        if (cursors.space.isDown) {
          this.scene.start('playScene');    
        }
    }


}
