/*
Yahli Kijel
Devil Escape
20 Hours

Creative Tilt:
This is the first game that I've made that I would be proud to put on my resume. The programming organization is a bit sloppy (I didn't include prefabs because I wasn't sure how to use them correctly) but the techniques I implemented are to be proud of. 
I mostly used online documentation and examples to figure out how to implement new concepts that we have not gone over in class.
I wanted to add more to the game (changing biomes/obstacles) but ran out of time.
I think the visual style for my game is decent. I took a lot of inspiration from online sprites to make my own. I have previous experience with pixel art so I felt pretty comfortable making my sprites and spritesheets.
The music is a snippet of a longer soundtrack I found online at the link below. I'm pretty happy with how the sound design turned out.
My endless runner takes a lot of inspiration from the dinosaur game that you can play when your internet is out. I don't think it particularly adds anything new to the genre, but I think it has all the features to classify itself as an endless runner through and through.
One interesting thing I did was tracking the player's score and making the enemies spawn more frequently and the screen scroll faster as it increases to emulate quicker running and escalating difficulty.
I also made it so the imps' y level is random, making it so you can jump over some but not all of them

Credits:
  * https://www.chosic.com/download-audio/53334/
*/



"use strict"

let config = {
    type: Phaser.AUTO,
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000},
            debug: true
        }
    },
    width: 950,
    height: 500,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config)

let cursors
let { height, width } = game.config
let playerDirection