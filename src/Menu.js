class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }

    preload() {
        // load audio
      }

    create() {
        cursors = this.input.keyboard.createCursorKeys();
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FACADE',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        menuConfig.backgroundColor = '#FACADE';
        menuConfig.color = '#000';
        this.add.text(this.scale.width/2, this.scale.height/2, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);

    }

    update() {
        if (cursors.space.isDown) {
          this.scene.start('playScene');    
        }
    }


}
