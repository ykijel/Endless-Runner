// Exercise 01: Normalized Movement
// Name: Yahli Kijel
// Date: 10/20/23

// Spritesheet by ElvGames: https://elv-games.itch.io/free-fantasy-dreamland-sprites

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
    height: 750,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config)

let cursors
let { height, width } = game.config
let playerDirection