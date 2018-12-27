var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 900,
    height: 450,
    //backgroundColor: '#ffffff',

    //zoom: 2, // duplica o tamanho da janela
    pixelArt: true, // não deformar a janela

    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0
            },
            // - debug
            debug: false
        }
    },

    scene: [
        BootScene,
        WorldScene,
        GameOverScene,
        GameWonScene,
        MenuScene,
        ComoJogarScene,
    ]
};

var game = new Phaser.Game(config);