class GameOverScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameOverScene'
        });
    }

    preload() {}

    create() {
        // -- imagem de fundo
        this.add.image(0, -100, 'wallpaper').setOrigin(0, 0).setScale(0.355).setAlpha(0.4);
        // -- buttons
        this.button1 = this.add.image(450, 250, 'buttontentarnovamente').setScale(0.5).setInteractive();
        this.button2 = this.add.image(450, 350, 'buttonsair').setScale(0.5).setInteractive();

        // -- musica
        this.musica = this.sound.add('gameovertheme');
        this.musica.volume = 0.5;
        this.musica.play();

        // -- click nos buttons
        this.button1.once('pointerdown', function (pointer) {
            if (this.musica.isPlaying) this.musica.stop();
            this.scene.start('WorldScene');
        }, this);

        this.button2.once('pointerdown', function (pointer) {
            if (this.musica.isPlaying) this.musica.stop();
            this.scene.start('MenuScene');
        }, this);

        // -- texto de descricao
        this.descricao = this.add.bitmapText(320, 80, 'fontPixel', 'Não desistas Bro!', 25)
            .setDepth(1)
            .setScrollFactor(0);
        this.descricao = this.add.bitmapText(100, 110, 'fontPixel', 'Tenta mais uma vez e arrebenta com eles!!', 25)
            .setDepth(1)
            .setScrollFactor(0);
    }
}