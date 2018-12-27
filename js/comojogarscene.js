class ComoJogarScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'ComoJogarScene'
        });
    }

    preload() {}

    create(musica) {
        // -- imagem de fundo
        this.add.image(450, 0, 'comojogar').setOrigin(0.5, 0).setScale(0.75);
        // -- buttons
        this.button1 = this.add.image(370, 420, 'buttonvoltar').setScale(0.3).setInteractive();
        this.button2 = this.add.image(530, 420, 'buttonjogar').setScale(0.3).setInteractive();

        // -- musica
        //this.musica = this.sound.add('menutheme');
        //this.musica.volume = 0.5;
        //this.musica.play();

        // -- click nos buttons
        this.button1.once('pointerdown', function (pointer) {
            //if(musica.isPlaying) this.musica.stop();
            this.scene.start('MenuScene');
        }, this);

        this.button2.once('pointerdown', function (pointer) {
            this.scene.start('WorldScene');
        }, this);
    }
}