class GameWonScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameWonScene'
        });
    }

    preload() {}

    create(score) {
        // -- imagem de fundo
        this.add.image(0, -100, 'wallpaper').setOrigin(0, 0).setScale(0.355).setTint(0xff00ff, 0xff0000, 0x00ff00, 0x0000ff);;
        // -- buttons
        this.button1 = this.add.image(450, 250, 'buttoncontinuar').setScale(0.5).setInteractive();
        this.button2 = this.add.image(450, 350, 'buttontentarnovamente').setScale(0.5).setInteractive();

        this.musica = this.sound.add('gamewontheme');
        this.musica.volume = 0.5;
        this.musica.play();

        this.button1.once('pointerdown', function (pointer) {
            if (this.musica.isPlaying) this.musica.stop();
            this.scene.start('MenuScene');
        }, this);

        this.button2.once('pointerdown', function (pointer) {
            if (this.musica.isPlaying) this.musica.stop();
            this.scene.start('WorldScene');
        }, this);

        //this.button1.on('pointerout', function () {});
        //this.button1.on('pointerup', function () {});

        // -- descricao
        this.add.bitmapText(290, 80, 'fontPixel', 'Parabens Campeao!!!', 25).setDepth(1).setScrollFactor(0);
        if (score != null)
            this.add.bitmapText(340, 130, 'fontPixel', score + ' Pontos', 25).setDepth(1).setScrollFactor(0);
        else
            this.add.bitmapText(340, 130, 'fontPixel', '0' + ' Pontos', 25).setDepth(1).setScrollFactor(0);

    }
}