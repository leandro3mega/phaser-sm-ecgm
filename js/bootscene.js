class BootScene extends Phaser.Scene {

    constructor() {
        super({
            key: 'BootScene'
        });
    }

    preload() {
        // sprites
        this.load.image("wallpaper", "assets/ui/menu_fundo.jpg");
        //this.load.image("titulo", "assets/ui/titulo.png");
        this.load.image("titulo", "assets/ui/titulo2.png");
        this.load.image("logotipo", "assets/ui/logo.png");
        this.load.image("comojogar", "assets/ui/comojogar.png");
        this.load.image("buttoncomojogar", "assets/ui/button_comojogar.png");
        this.load.image("buttoncontinuar", "assets/ui/button_continuar.png");
        this.load.image("buttonjogar", "assets/ui/button_jogar.png");
        this.load.image("buttonsair", "assets/ui/button_sair.png");
        this.load.image("buttontentarnovamente", "assets/ui/button_tentarnovamente.png");
        this.load.image("buttonvoltar", "assets/ui/button_voltar.png");
        this.load.image("bullet", "assets/bullet.png");
        this.load.image("granada", "assets/granada.png");
        this.load.atlas("playersheet", "assets/playersheet.png", "assets/playersheet.json");
        this.load.atlas("soldadosheet", "assets/soldadosheet.png", "assets/soldadosheet.json");
        this.load.atlas("explosion", "assets/explosao.png", "assets/explosao.json");
        // -- map tiles
        this.load.image('background', 'assets/nivel/background.png');
        this.load.image('tileset', 'assets/nivel/tileset.png');
        this.load.image('plataformas', 'assets/nivel/plataformas.png');
        // -- mapa no formato JSON
        this.load.tilemapTiledJSON('mapa', 'assets/nivel/mapa.json');

        // -- fonts
        this.load.bitmapFont('fontPixel', 'assets/font/arcadepix.png', 'assets/font/arcadepix.fnt');

        // -- sound
        this.load.audio('somShoot', 'assets/sound/shoot.wav');
        this.load.audio('somExplosao', 'assets/sound/explode.wav');
        this.load.audio('somArde', 'assets/sound/soldadoarde.wav');
        this.load.audio('somMorre', 'assets/sound/soldadomorre.wav');
        this.load.audio('niveltheme', 'assets/sound/niveltheme.wav');
        this.load.audio('menutheme', 'assets/sound/menutheme.wav');
        this.load.audio('gamewontheme', 'assets/sound/gamewontheme.wav');
        this.load.audio('gameovertheme', 'assets/sound/gameovertheme.wav');

    }

    create() {
        //this.scene.start('WorldScene');
        this.scene.start('MenuScene');
        //this.scene.start('GameWonScene');
        //this.scene.start('ComoJogarScene');
    }
}