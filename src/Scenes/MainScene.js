import enemie from "../Entities/Enemie.js";
import player1 from "../Entities/player1.js";
export default class MainScene extends Phaser.Scene {
    //Parametros
    TwoP;
    numPlayer;
    end
    constructor() {
        super({ key: 'MainScene' }) //id de la escena
    }

    init(data) {
        //Inicialización de la escena en función de data
        this.TwoP = data.TwoP;
        this.end = false;
        if (this.TwoP) this.numPlayer = 2;
        else this.numPlayer = 1;
    }

    preload() {

        //Precarga de las imagenes

        this.load.image('fondo', "assets/images/background.png");
        this.load.image('fondo2', "assets/images/background_hcontrast.png");
        this.load.image('bala', "assets/images/bullet.png");
        this.load.image('bala2', "assets/images/bullet2.png");
        this.load.image('player1', "assets/images/player.png");
        this.load.image('player2', "assets/images/player2.png");

        //Precarga de los SpriteSheets

        this.load.spritesheet('enemies1', "assets/images/enemy.png", { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('enemies2', "assets/images/enemy2.png", { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('enemies3', "assets/images/enemy3.png", { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('explosion', "assets/images/explosion.png", { frameWidth: 16, frameHeight: 16 });

        //Precarga de la música y SFX

        this.load.audio('dead', "assets/sounds/dead.wav");
        this.load.audio('lucky', "assets/sounds/lucky.wav");
        this.load.audio('explosionSound', "assets/sounds/explosion.wav");
        this.load.audio('shoot', "assets/sounds/shoot.mp3");
        this.load.audio('ulti', "assets/sounds/ulti.mp3");
        this.load.audio('loaded', "assets/sounds/ultiLoad.mp3");


    }

    create() {

        //Background
        this.background = this.add.image(this.sys.game.canvas.width / 2, 0, 'fondo').setOrigin(0.5, 0);

        //SCORE
        this.score = 0;
        this.power = 0;

        this.luckyAudio = this.sound.add('lucky');
        this.luckyAudio.setVolume(0.2);
        //Animaciones
        //ENEMY

        this.anims.create({
            key: 'enemies1', //Asignación de la id
            frames: this.anims.generateFrameNumbers('enemies1', { start: 0, end: 3 }), //Seteo de los frames de la animación
            frameRate: 10, //Cada cuanto tiempo cambia
            repeat: -1, //Número de veces que tienes que repetir la animación, -1 = infinito
        });
        this.anims.create({
            key: 'enemies2', //Asignación de la id
            frames: this.anims.generateFrameNumbers('enemies2', { start: 0, end: 3 }), //Seteo de los frames de la animación
            frameRate: 10, //Cada cuanto tiempo cambia
            repeat: -1, //Número de veces que tienes que repetir la animación, -1 = infinito
        });
        this.anims.create({
            key: 'enemies3', //Asignación de la id
            frames: this.anims.generateFrameNumbers('enemies3', { start: 0, end: 3 }), //Seteo de los frames de la animación
            frameRate: 10, //Cada cuanto tiempo cambia
            repeat: -1, //Número de veces que tienes que repetir la animación, -1 = infinito
        });

        //EXPLOSION

        this.anims.create({
            key: 'Explosion', //Asignación de la id
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 2 }), //Seteo de los frames de la animación
            frameRate: 10, //Cada cuanto tiempo cambia
            repeat: 1, //Número de veces que tienes que repetir la animación, -1 = infinito
            hideOnComplete: true
        });

        //Audio y Sonidos
        let explosionsound = this.sound.add('explosionSound');
        explosionsound.setVolume(0.2);
        let dead = this.sound.add('dead');
        dead.setVolume(0.2);

        //Entidades
        this.player1 = new player1(this, this.sys.game.canvas.width / 2, this.sys.game.canvas.height - 50, 'player1');
        //Control de los enemigos
        this.spawnEnemie = 0;
        this.timeToSpawn = Phaser.Math.Between(0.5, 2);
        this.enemies = this.physics.add.group();


        //Colisiones entre los grupos y los jugadores
        this.physics.add.overlap(this.enemies, this.player1, (player, enemy) => {
            if (!enemy.dead) {

                dead.play({ loop: false });
                enemy.destroy();
                this.player1.death();
                this.numPlayer--
                if (this.numPlayer == 0) {
                    this.end = true;
                    this.add.text(this.sys.game.canvas.width / 2, this.sys.game.canvas.height * 0.45, 'HAS MUERTO', {
                        fontSize: '25px',
                        color: '#df7126',
                        fontFamily: 'sekuya',
                        padding: { x: 10, y: 5 },
                        stroke: '#ac3232', // Color del borde
                        strokeThickness: 4 // Grosor del borde
                    }).setOrigin(0.5, 0.5);
                    this.add.text(this.sys.game.canvas.width / 2, this.sys.game.canvas.height * 0.55, 'Score: ' + this.score, {
                        fontSize: '15px',
                        color: '#df7126',
                        fontFamily: 'sekuya',
                        padding: { x: 10, y: 5 },
                        stroke: '#ac3232', // Color del borde
                        strokeThickness: 4 // Grosor del borde
                    }).setOrigin(0.5, 0.5);
                    setTimeout(() => {
                        this.background.y = 0;
                        this.scene.start('StartMenuScene');  //Le pasamos un false para indicar a la endscene que ha perdido
                    }, 5000);
                }
            }
        });

        this.physics.add.overlap(this.enemies, this.player1.bulletsPool._group, (bullets, enemy) => {
            if (enemy.dead) return;
            explosionsound.play({ loop: false });
            enemy.setVisible(false);
            enemy.dead = true;
            let exp = this.add.sprite(enemy.x, enemy.y, 'explosion');
            exp.play('Explosion');
            if (this.player1.getLevelPowerUp() == 0) {
                bullets.destroyNow = true;
            }
            exp.on('animationcomplete', () => {
                if (exp.anims.currentAnim.key === 'Explosion') {
                    enemy.destroy();
                    this.addScore(10);
                    if (this.player1.getLevelPowerUp() == 2) {
                        this.power += 1;
                    }
                }
            })
        })

        this.played = false;
    }

    update(t, dt) {
        if (!this.end) {
            //GESTION DE INPUTS

            this.keys = this.input.keyboard.addKeys({
                up: Phaser.Input.Keyboard.KeyCodes.W,
                down: Phaser.Input.Keyboard.KeyCodes.S,
                left: Phaser.Input.Keyboard.KeyCodes.A,
                right: Phaser.Input.Keyboard.KeyCodes.D
            });

            // Creamos un array con las direcciones activas
            const inputs = [
                { key: this.keys.up, move: () => this.player1.moveUp() },
                { key: this.keys.down, move: () => this.player1.moveDown() },
                { key: this.keys.left, move: () => this.player1.moveLeft() },
                { key: this.keys.right, move: () => this.player1.moveRight() }
            ].filter(input => input.key.isDown); // Solo nos quedamos con las que están pulsadas

            // Detenemos al jugador por defecto
            this.player1.StopX();
            this.player1.StopY();

            if (inputs.length > 0) {
                // Ordenamos por 'timeDown' para que el último presionado esté al principio
                inputs.sort((a, b) => b.key.timeDown - a.key.timeDown);

                // Ejecutamos solo la acción del input más reciente
                inputs[0].move();
            }

            if (this.power >= 1 && !this.played) {
                this.player1.setTexture('player2', 5);
                this.audioUltLoaded = this.sound.add('loaded');
                this.audioUltLoaded.setVolume(0.2);
                if (!this.audioUltLoaded.isPlaying) {
                    this.audioUltLoaded.play({ loop: false });
                }
                this.played = true;
            }

            //Ulti
            if (this.player1.attackPress() && this.power >= 5) {
                this.player1.setTexture('player1', 1);
                const overlay = this.add.rectangle(0, 0, this.game.config.width, this.game.config.height, 0x804080)
                    .setOrigin(0)
                    .setScrollFactor(0) // Para que siga a la cámara
                    .setDepth(1000);    // Asegúrate de que esté por encima de todo
                overlay.setBlendMode(Phaser.BlendModes.DIFFERENCE);
                this.time.delayedCall(500, () => {
                    overlay.destroy();
                }, [], this);
                this.power = 0;
                this.played = true;
                this.enemies.getChildren().forEach(enemy => {
                    this.audioUlt = this.sound.add('ulti');
                    this.audioUlt.setVolume(0.2);
                    if (!this.audioUlt.isPlaying) {
                        this.audioUlt.play({ loop: false });
                    }
                    enemy.setVisible(false);
                    enemy.dead = true;
                    let exp = this.add.sprite(enemy.x, enemy.y, 'explosion');
                    exp.play('Explosion');
                    exp.on('animationcomplete', () => {
                        if (exp.anims.currentAnim.key === 'Explosion') {
                            enemy.destroy();
                            this.addScore(10);
                        }
                    })
                });
            }


            //Spawn de Enemigos
            if (this.spawnEnemie > this.timeToSpawn) {
                this.enemies.add(new enemie(this, 0, 0, 'enemies' + Phaser.Math.Between(1, 3)));
                this.spawnEnemie = 0;
                switch (this.player1.getLevelPowerUp()) {
                    case 0:
                        this.timeToSpawn = Phaser.Math.Between(0.5, 2);
                        break;
                    case 1:
                        this.timeToSpawn = Phaser.Math.Between(0.4, 1.5);
                        break;
                    case 2:
                        this.timeToSpawn = Phaser.Math.Between(0.3, 0.7);
                        break;
                }
            }
            else this.spawnEnemie += dt / 1000;
            if (this.score >= 100 && this.player1.getLevelPowerUp() == 0) {
                this.player1.addPowerUp();
                this.luckyAudio.play({ loop: false });
            }
            if (this.score >= 250 && this.player1.getLevelPowerUp() == 1) {
                this.player1.addPowerUp();
                this.luckyAudio.play({ loop: false });
            }
        }
        else {
            this.player1.StopX();
            this.player1.StopY();
            this.enemies.getChildren().forEach(enemy => {
                enemy.destroy();
            });
        }
    }

    getPlayer() {
        return this.player1;
    }

    getEnd() {
        return this.end;
    }

    addScore(points) {
        this.score += points;
    }
}