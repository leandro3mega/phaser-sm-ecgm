class WorldScene extends Phaser.Scene {
  constructor() {
    super({
      key: "WorldScene"
    });
  }

  preload() {}

  create() {
    //
    // --------- Variaveis
    this.facingRight = true; // Direção (direita? ou Esquerda?)
    this.shootTimeOffset = 0; // offset de disparo
    this.trowTimeOffset = 0; // offset de disparo
    this.spawnTimeOffset = 0; // offset de spawn de soldados
    this.bulletDir = 1; // direção da bala
    this.bulletSpeed = 800; // velocidade da bala
    this.numeroBalas = 10000; // numero total de balas do jogador
    this.numeroBombs = 10; // numero total de granadas do jogador
    this.tempo = 0; // temporizador

    //
    // --------- Mapa
    this.mapaComprimento = 4000;
    this.mapaAltura = 600;

    this.mapa = this.make.tilemap({
      key: "mapa"
    });

    // importamos spritesheet baseado nos tiles do bootscene
    this.backgroundTile = this.mapa.addTilesetImage("background", "background");
    this.background = this.mapa
      .createStaticLayer("fundo", this.backgroundTile, 0, 0)
      .setPosition(0, -370); // a partir da posição 0,0

    this.plataformas = this.physics.add.staticGroup();
    this.plataformas
      .create(0, 0, "plataformas")
      .setOrigin(0, 0)
      .setPosition(0, 360)
      .refreshBody()
      .setVisible(false);

    //
    // --------- Som
    this.somShoot = this.sound.add("somShoot");
    this.somShoot.volume = 0.5;
    this.somExplosao = this.sound.add("somExplosao");
    this.somExplosao.volume = 0.5;
    this.somSoldadoMorre = this.sound.add("somMorre");
    this.somSoldadoMorre.volume = 0.9;
    this.somSoldadoArde = this.sound.add("somArde");
    this.somSoldadoArde.volume = 0.9;
    this.musica = this.sound.add("niveltheme");
    this.musica.volume = 0.5;
    this.musica.play();

    //
    // --------- Player
    this.player = this.physics.add.sprite(100, 200, "playersheet");
    // --------- Aplica gravidade ao Player
    this.player.body.gravity.y = 300;
    this.player.vida = 100;
    this.player.score = 0;

    //
    //------------ Balas do jogador
    this.playerBullets = this.physics.add.group({
      gravity: {
        y: 0
      },
      runChildUpdate: false
    });

    //------------ Balas do soldado
    this.soldadoBullets = this.physics.add.group({
      gravity: {
        y: 0
      },
      runChildUpdate: false
    });

    //
    // ------------ Granadas
    this.playerGranades = this.physics.add.group({
      gravity: {
        y: 0
      },
      runChildUpdate: false
    });

    //
    // --------- Explosões das granadas
    this.granadaExplosoes = this.physics.add.group({
      gravity: {
        y: 0
      },
      runChildUpdate: false
    });

    //
    // --------- Soldados
    this.soldadosEnimigos = this.physics.add.group({
      gravity: {
        y: 300
      },
      runChildUpdate: false
    });

    // --------- Textos ---------//
    // -- UI
    //bitmapText(x, y, 'nomeFont', 'Texto', tamanho);
    this.textVida = this.add
      .bitmapText(200, 70, "fontPixel", "Life\n" + this.player.vida, 18)
      .setDepth(1)
      .setScrollFactor(0);
    this.textScore = this.add
      .bitmapText(300, 70, "fontPixel", "Score\n" + this.player.score, 18)
      .setDepth(1)
      .setScrollFactor(0);
    this.textTempo = this.add
      .bitmapText(450, 70, "fontPixel", "0", 18)
      .setDepth(1)
      .setScrollFactor(0);
    this.textNumBalas = this.add
      .bitmapText(550, 70, "fontPixel", "Bullets\n" + this.numeroBalas, 18)
      .setDepth(1)
      .setScrollFactor(0);
    this.textNumBombs = this.add
      .bitmapText(650, 70, "fontPixel", "Bombs\n" + this.numeroBombs, 18)
      .setDepth(1)
      .setScrollFactor(0);

    //
    // ---------- Colliders
    // --------- colisao das granadas com as plataformas -> eliminaGranada -> geraExplosao
    this.physics.add.overlap(
      this.playerGranades,
      this.plataformas,
      this.eliminaGranada,
      null,
      this
    );

    // -- Adiciona colisoes do player com plataformas
    this.physics.add.collider(this.plataformas, this.player);
    this.physics.add.collider(this.plataformas, this.soldadosEnimigos);
    this.physics.add.collider(this.player, this.soldadosEnimigos);

    // -------- Camara tracking player
    //.setBounds(inicioX, inicioY, fimX, fimY);
    this.cameras.main.setBounds(0, 0, 4000, 420).setName("main"); // limites da camara
    this.cameras.main.setZoom(1.4); // aproxima ou afasta a camara do nosso mundo

    // --------- Criar animações ---------//
    // --------- andar
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNames("playersheet", {
        start: 1,
        end: 10,
        prefix: "ramboRun",
        suffix: ".png"
      }),
      frameRate: 15,
      repeat: -1
    });

    // --------- parado
    this.anims.create({
      key: "stoped",
      frames: this.anims.generateFrameNames("playersheet", {
        start: 1,
        end: 4,
        prefix: "ramboStoped",
        suffix: ".png"
      }),
      frameRate: 5,
      repeat: -1
    });

    // --------- saltar para cima
    this.anims.create({
      key: "jumpup",
      frames: this.anims.generateFrameNames("playersheet", {
        start: 1,
        end: 8,
        prefix: "ramboJumpUp",
        suffix: ".png"
      }),
      frameRate: 5,
      repeat: -1
    });

    // --------- saltar para a direita
    this.anims.create({
      key: "jumpright",
      frames: this.anims.generateFrameNames("playersheet", {
        start: 1,
        end: 6,
        prefix: "ramboJumpRight",
        suffix: ".png"
      }),
      frameRate: 15,
      repeat: -1
    });

    // --------- Explosao
    this.anims.create({
      key: "boom",
      frames: this.anims.generateFrameNames("explosion", {
        start: 1,
        end: 21,
        prefix: "explosao",
        suffix: ".png"
      }),
      frameRate: 20
    });

    //
    // --------- Soldado ---------//
    // --------- Correr
    this.anims.create({
      key: "soldadocorrer",
      frames: this.anims.generateFrameNames("soldadosheet", {
        start: 1,
        end: 12,
        prefix: "soldadoRun",
        suffix: ".png"
      }),
      frameRate: 15,
      repeat: -1
    });

    // --------- Assustado
    this.anims.create({
      key: "soldadoscared",
      frames: this.anims.generateFrameNames("soldadosheet", {
        start: 1,
        end: 13,
        prefix: "soldadoScared",
        suffix: ".png"
      }),
      frameRate: 15
    });

    // --------- Saca arma
    this.anims.create({
      key: "soldadosacaarma",
      frames: this.anims.generateFrameNames("soldadosheet", {
        start: 1,
        end: 7,
        prefix: "soldadoSacaArma",
        suffix: ".png"
      }),
      frameRate: 15
    });

    // --------- Correr
    this.anims.create({
      key: "soldadodisparar",
      frames: this.anims.generateFrameNames("soldadosheet", {
        start: 1,
        end: 1,
        prefix: "soldadoShooting",
        suffix: ".png"
      }),
      frameRate: 15
    });

    // ------- input de teclado
    this.cursors = this.input.keyboard.createCursorKeys();

    // ------- Tempo
    this.relogio = this.time.addEvent({
      delay: 1000,
      callback: this.atualizaTimer,
      callbackScope: this,
      loop: true
    });
  }

  update(time) {
    // -------- DIREÇÃO DO PLAYER --------//
    // ---- Inverte a animação do player dependendo se está ou não virado para a direita
    if (this.facingRight) {
      this.player.flipX = false;
      this.bulletDir = 1;
    } else {
      this.player.flipX = true;
      this.bulletDir = -1;
    }

    // ---- MOVIMENTO (VELOCIDADE) --------//
    if (this.cursors.left.isDown && this.player.x - this.player.width / 2 > 0) {
      // -------- run left
      this.player.setVelocityX(-160);
      this.facingRight = false;
    } else if (
      this.cursors.right.isDown &&
      this.player.x + this.player.width / 2 < this.mapaComprimento
    ) {
      // -------- run right
      this.player.setVelocityX(160);
      this.facingRight = true;
    } else {
      // -------- stop
      this.player.setVelocityX(0);
    }

    // -- jump
    if (this.cursors.space.isDown && this.player.body.onFloor()) {
      this.player.setVelocityY(-200);
    }

    // -------- ANIMAÇÕES --------//
    // -------- running
    if (
      (this.cursors.left.isDown && this.player.body.onFloor()) ||
      (this.cursors.right.isDown && this.player.body.onFloor())
    ) {
      // -------- reproduz animação de corrida
      this.player.anims.play("run", true);
    } else {
      //---------- reproduz animação de parado
      this.player.anims.play("stoped", true);
    }

    // -------- jumping
    if (
      (!this.player.body.touching.down && this.cursors.right.isDown) ||
      (!this.player.body.touching.down && this.cursors.left.isDown)
    ) {
      // -------- reproduz animação a saltar pra direita ou esqurda no ar
      this.player.anims.play("jumpright", true);
    } else if (
      (!this.player.body.touching.down && this.facingRight) ||
      (!this.player.body.touching.down && !this.facingRight)
    ) {
      // -------- reproduz animação do player no ar virado para a direita ou esquerda (sem andar)
      this.player.anims.play("jumpup", true);
    }

    // -------- OUTROS --------//
    // -------- Camera
    this.cameras.main.scrollX = this.player.x - 300; // a camara centra no jogador e segue-o

    // -------- disparo
    if (this.cursors.up.isDown) {
      this.fireBullet(time); // dispara bala

      //console.log("Nº de Balas: " + this.playerBullets.getLength());
    }

    // -------- Atira Granadas
    if (this.cursors.down.isDown) {
      this.trowGranade(time);

      //console.log("Nº de Granadas: " + this.playerGranades.getLength());
    }

    // -------- se existirem balas ou granadas no jogo...
    if (this.playerBullets.getLength() > 0) this.eliminaBala();

    if (this.soldadoBullets.getLength() > 0) this.eliminaBalaSoldado();

    if (this.granadaExplosoes.getLength() > 0) this.eliminaExplosao();

    // -------- se existitem soldados no jogo...
    if (this.soldadosEnimigos.getLength() > 0) {
      var soldados = this.soldadosEnimigos.getChildren();
      var direcao = -1;

      for (var i = 0; i < soldados.length; i++) {
        // certifica que o soldado está virado para o jogador
        if (this.player.x < soldados[i].x) {
          soldados[i].flipX = false;
          direcao = -1;
          //console.log("Distancia entre Jogador e soldado: " + (soldados[i].x - this.player.x));
        } else {
          soldados[i].flipX = true;
          direcao = 1;
          //console.log("Distancia entre Jogador e soldado: " + (this.player.x - soldados[i].x));
        }
        // -- se o soldado estiver proximo do jogador fica em modo ataque e para de andar
        if (
          (soldados[i].x - this.player.x <= 300 && direcao == -1) ||
          (this.player.x - soldados[i].x <= 300 && direcao == 1)
        ) {
          soldados[i].ataque = true;
          soldados[i].setVelocityX(0);
        }

        // -- se o jogador estiver longe do soldado, o soldado vem na sua direção
        if (
          (soldados[i].x - this.player.x >= 350 && direcao == -1) ||
          (this.player.x - soldados[i].x >= 350 && direcao == 1)
        ) {
          soldados[i].ataque = false;   // não esta em modo ataque
          // -- Inicio: Condição para quando o soldado fez spawn 
          if (!soldados[i].anims.isPlaying && soldados[i].stage == 0) {
            soldados[i].setVelocityX(80 * direcao);
            soldados[i].anims.play("soldadocorrer", true);
            soldados[i].stage = 1;
          } 
          
          // -- Atingido : Condição para quando o soldado foi atingido à distancia 
          if(soldados[i].anims.isPlaying && soldados[i].stage == 1) {
            soldados[i].setVelocityX(80 * direcao);
          }
          // -- Standard: Condição para quando o player se afasta do soldado,
          // espera que as animações cheguem ao fim e so depois pode voltar a se aproximar do jogador
          if(!soldados[i].anims.isPlaying && soldados[i].stage == 4){
            soldados[i].setVelocityX(80 * direcao);
            soldados[i].anims.play("soldadocorrer", true);
            soldados[i].stage = 1;
          }
        }

        // -- Stage 2: soldado assusta-se
        if (soldados[i].stage == 1 && soldados[i].ataque) {
          soldados[i].anims.remove("soldadocorrer");
          soldados[i].anims.play("soldadoscared", true);
          soldados[i].stage = 2;
        }

        // -- Stage 3: soldado retira a arma
        if (soldados[i].stage == 2 && !soldados[i].anims.isPlaying) {
          soldados[i].anims.play("soldadosacaarma", true);
          soldados[i].stage = 3;
        }

        // -- Stage 4: poem-se em posição de disparo
        if (soldados[i].stage == 3 && !soldados[i].anims.isPlaying) {
          soldados[i].anims.play("soldadodisparar", true);
          soldados[i].stage = 4;
        }

        // -- se o jogador esta proximo do soldado, o soldado pode disparar
        if (
          (soldados[i].x - this.player.x <= 200 && direcao == -1) ||
          (this.player.x - soldados[i].x <= 200 && direcao == 1)
        ) {
          soldados[i].disparar = true;
        } else {
          soldados[i].disparar = false;
        }

        // se esta em modo ataque e pode disparar, então começar a disparar
        if (soldados[i].ataque && soldados[i].disparar) {
          // -- Disparo de balas
          this.fireBulletSoldado(
            time,
            soldados[i],
            soldados[i].x,
            soldados[i].y,
            direcao
          );
        }
      }
    }

    // -------- GameWon --------//
    // -------- Caso o jogador chegue ao fim ganha
    if (this.player.x > this.mapaComprimento - 400) {
      // venceu
      this.physics.pause();

      if (this.musica.isPlaying) this.musica.stop();

      this.scene.start("GameWonScene", this.player.score);
    }

    // -- caso exista colisão de objeto A com objeto B, é chamado o metodo AB
    this.physics.add.collider(
      this.soldadosEnimigos,
      this.playerBullets,
      this.soldadoAtingido,
      null,
      this
    );
    this.physics.add.collider(
      this.soldadosEnimigos,
      this.granadaExplosoes,
      this.soldadoExplodido,
      null,
      this
    );
    this.physics.add.collider(
      this.player,
      this.soldadoBullets,
      this.playerAtingido,
      null,
      this
    );

    // -------- Spwan Soldados
    if (
      this.player.x > 300 &&
      this.player.x < this.mapaComprimento - 500 &&
      this.soldadosEnimigos.getLength() < 3
    ) {
      this.spawnSoldados(time);
    }
  }

  // -- metodo de spawn de soldados
  spawnSoldados(time) {
    if (time > this.spawnTimeOffset) {
      var soldado = this.soldadosEnimigos.create(
        this.player.x + 530, // 800 5*
        this.player.y - 50,
        "soldadosheet"
      );

      soldado.body.gravity.y = 300;
      soldado.body.gravity.x = 0;
      //soldado.allowDrag = false;
      soldado.setScale(1.1);
      soldado.vida = 100; // vida total do soldado
      soldado.shootOffset = 0;
      soldado.stage = 0; // 1 = correr | 2 = assustado | 3 = retirar arma | 4 = disparar
      soldado.ataque = false; // se esta em modo ataque ou não
      soldado.disparar = false; // se pode ou não disparar

      this.spawnTimeOffset = time + 2000;
    }
  }

  // -- quando soldado é atingido por 1 bala
  soldadoAtingido(soldado, bala) {
    soldado.vida -= 20; // retira 20 pontos de vida ao soldado
    bala.destroy(); // elimina a bala
    soldado.setVelocityX(0); // para não ser afetado pela gravidade da bala

    // -- se o soldado perder a vida toda é eliminado
    if (soldado.vida <= 0) {
      soldado.destroy();
      this.somSoldadoMorre.play();

      this.player.score += 110;
      this.textScore.setText("Score\n" + this.player.score);
    }
  }

  // -- quando soldado é atingido por 1 granada
  soldadoExplodido(soldado, explosao) {
    soldado.vida -= 100; // retira 20 pontos de vida ao soldado
    soldado.setVelocityX(0); // para não ser afetado pela gravidade da bala

    // -- se o soldado perder a vida toda é eliminado
    if (soldado.vida <= 0) {
      soldado.destroy();
      this.somSoldadoArde.play();

      this.player.score += 90;
      this.textScore.setText("Score\n" + this.player.score);
    }
  }

  // -- quando o jogador é atingido por uma bala
  playerAtingido(player, bala) {
    player.vida -= 20; // retira 20 pontos de vida ao jogador
    bala.destroy();
    this.cameras.main.flash(300);
    this.textVida.setText("Life\n" + this.player.vida);

    // -- se o jogador ficar sem vida morre
    if (player.vida <= 0) {
      this.physics.pause();

      if (this.musica.isPlaying) this.musica.stop();

      this.scene.start("GameOverScene");
    }
  }

  // -- Disparo de uma bala
  fireBullet(time) {
    // so dispara uma nova bala algum tempo depois da ultima bala
    if (time > this.shootTimeOffset && this.numeroBalas > 0) {
      var bala;

      // dependendo do lado para o qual o jogador está virado, posiciona a bala na arma
      if (this.facingRight)
        bala = this.playerBullets.create(
          this.player.x + this.player.width / 2,
          this.player.y,
          "bullet"
        );
      else
        bala = this.playerBullets.create(
          this.player.x - this.player.width / 2,
          this.player.y,
          "bullet"
        );

      // aplica velocidade à bala, dependedo da direção do jogador
      bala.setVelocity(this.bulletSpeed * this.bulletDir, 0);

      this.playSomShoot(); // reproduz som do disparo

      this.shootTimeOffset = time + 100; // tempo para a proxima bala poder ser disparada

      this.numeroBalas -= 1;
      this.textNumBalas.setText("Bullets\n" + this.numeroBalas);
    }
  }

  fireBulletSoldado(time, soldado, posX, posY, dir) {
    // so dispara uma nova bala algum tempo depois da ultima bala
    if (time > soldado.shootOffset && !soldado.anims.isPlaying) {
      var bala;

      bala = this.soldadoBullets.create(posX, posY, "bullet");

      // aplica velocidade à bala, dependedo da direção do jogador
      bala.setVelocity(this.bulletSpeed * dir, 0);

      this.playSomShoot();

      // tempo para a proxima bala poder ser disparada
      soldado.shootOffset = time + 3000;
    }
  }

  // -- elimina as balas que sairam da área de jogo
  eliminaBala() {
    // vai ao grupo buscar os childs e armazena num array
    var balas = this.playerBullets.getChildren();

    for (var i = 0; i < balas.length; i++) {
      // limites das balas
      if (balas[i].x >= this.mapaComprimento || balas[i].x <= 0) {
        balas[i].destroy();
        //console.log("Nº de Balas: " + this.playerBullets.getLength());
      }
    }
  }

  // -- elimina as balas dos soldados que saem da area de jogo
  eliminaBalaSoldado() {
    // vai ao grupo buscar os childs e armazena num array
    var balas = this.soldadoBullets.getChildren();

    for (var i = 0; i < balas.length; i++) {
      // limites das balas
      if (balas[i].x >= this.mapaComprimento || balas[i].x <= 0) {
        balas[i].destroy();
        //console.log("Nº de Balas: " + this.soldadoBullets.getLength());
      }
    }
  }

  // -- Arremeço de uma granada
  trowGranade(time) {
    // so atira uma nova granada algum tempo depois da ultima
    if (time > this.trowTimeOffset && this.numeroBombs > 0) {
      var granade;
      // dependendo do lado para o qual o jogador está virado, posiciona a granada
      if (this.facingRight)
        granade = this.playerGranades.create(
          this.player.x + this.player.width / 2,
          this.player.y,
          "granada"
        );
      else
        granade = this.playerGranades.create(
          this.player.x - this.player.width / 2,
          this.player.y,
          "granada"
        );

      // aplica velocidade e gravidade à granada, dependedo da direção do jogador
      granade.setVelocity(100 * this.bulletDir, -170);
      granade.body.gravity.y = 200;

      // tempo para a proxima granada poder ser lançada
      this.trowTimeOffset = time + 400;

      this.numeroBombs -= 1;
      this.textNumBombs.setText("Bombs\n" + this.numeroBombs);
    }
  }

  // -- verifica se as granadas sairam da área de jogo
  eliminaGranada(granade) {
    // começa a explosão da granada, enviando as posicoes da mesma, antes de a apagar
    this.geraExplosao(granade);

    this.somExplosao.play();

    granade.destroy();
    //console.log("Nº de Granadas: " + this.playerGranades.getLength());
  }

  // -- Explosão de uma granada
  geraExplosao(granade) {
    // cria uma nova explosao
    var explosao = this.granadaExplosoes.create(
      granade.x,
      granade.y,
      "explosion"
    );

    // posiciona a explosão no local da granada e reproduz a animacao
    explosao.setPosition(granade.x, granade.y).setOrigin(0.5, 1);
    explosao.anims.play("boom", true);
  }

  // -- Elimina as explosões que tiverem terminado
  eliminaExplosao() {
    // vai ao grupo buscar os childs e armazena num array
    var explosoes = this.granadaExplosoes.getChildren();

    for (var i = 0; i < explosoes.length; i++) {
      // se a animação tiver chegado à ultima frame, remove do grupo
      //if (explosoes[i].anims.currentFrame.index === 22) {
      if (!explosoes[i].anims.isPlaying) {
        explosoes[i].destroy();
      }
    }
  }

  // -- Sons
  playSomShoot() {
    this.somShoot.play();
  }

  atualizaTimer() {
    this.tempo++;
    this.textTempo.setText(this.tempo);
  }
}
