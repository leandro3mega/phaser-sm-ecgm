class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'MenuScene'
        });
    }

    preload() {}

    create() {
        // -- imagem de fundo
        this.add.image(0, -100, 'wallpaper').setOrigin(0, 0).setScale(0.355).setAlpha(0.6);
        this.add.image(50, 150, 'titulo').setOrigin(0, 0).setScale(1).setTint(0xffffff);
        this.add.image(450, 400, 'logotipo').setScale(0.4);
        // -- buttons
        this.button1 = this.add.image(600, 200, 'buttonjogar').setScale(0.5).setInteractive();
        this.button2 = this.add.image(600, 300, 'buttoncomojogar').setScale(0.5).setInteractive();

        // -- texto de descricao
        this.add.bitmapText(200, 430, 'fontPixel', 'Leandro Martins Magalhaes - 2018 - Copyrights Reserved', 12)
            .setDepth(1)
            .setScrollFactor(0);

        // -- musica
        this.musica = this.sound.add('menutheme');
        this.musica.volume = 0.5;
        this.musica.play();

        // -- click nos buttons
        this.button1.once('pointerdown', function (pointer) {
            if (this.musica.isPlaying) this.musica.stop();
            this.scene.start('WorldScene');
        }, this);

        this.button2.once('pointerdown', function (pointer) {
            if (this.musica.isPlaying) this.musica.stop();
            this.scene.start('ComoJogarScene');
        }, this);

    }
}