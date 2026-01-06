import Bullet from "./Bullets.js";
import Pool from "./pool.js";
export default class player extends Phaser.GameObjects.Sprite {
    //Constructor, se llama al crear la entidad
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture); //super, esencial al heredar de Sprites de Phaser, (escena de dnd procede,posicion X, posicion Y, textura que recibe, y el frame inicial)
        this.speed = 50; //Velocidad de la entidad
        this.scene.add.existing(this); //Añade la entidad a la escena 
        this.scene.physics.add.existing(this); //Añade a la escena que este objeto tenga físicas
        this.body.setCollideWorldBounds();
        this.shootCooldown = 1;
        this.lastShoot = 0;
        this.canShoot = false;
        this.poolMax = 100;
        this.powerups = 0;

        //Inputs
        this.leftMovKey;
        this.rightMovKey;
        this.upMovKey;
        this.downMovKey;
        this.attackKey;
        this.dirX = 0;
        this.dirY = -1;

        //Pool de Balas
        this.bulletsPool = new Pool(scene, this.poolMax, false);
        let bulletsP1 = []
        for (let i = 0; i < 30; i++) {
            let bullet = new Bullet(scene, 0, 0, 'bala', this.bulletsPool, this.dirX, this.dirY);
            bullet.setVisible(false);
            bulletsP1.push(bullet);
        }
        this.bulletsPool.addMultipleEntity(bulletsP1);

    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt); //LLamamos al preUpdate del padre para que las animaciones se ejucten correctamente
        if (!this.canShoot && !this.scene.getEnd()) {
            if (this.lastShoot >= this.shootCooldown) {
                this.canShoot = true;
                this.lastShoot = 0;
            }
            else this.lastShoot += dt / 1000;
        }
        else {
            this.shoot();
        }
    }

    //Control del movimiento del jugador
    moveRight() {
        this.body.setVelocity(this.speed, 0);
        this.dirX = 1;
        this.dirY = 0;
        this.setRotation(90 * Math.PI / 180);
    }
    moveLeft() {
        this.body.setVelocity(-this.speed, 0);
        this.dirX = -1;
        this.dirY = 0;
        this.setRotation(270 * Math.PI / 180);
    }
    moveUp() {
        this.body.setVelocity(0, -this.speed); //Asignamos la velocidad hacia arriba   
        this.dirY = -1;
        this.dirX = 0;
        this.setRotation(0);
    }
    moveDown() {
        this.body.setVelocity(0, this.speed); //Asignamos la velocidad hacia abajo 
        this.dirY = 1;
        this.dirX = 0;
        this.setRotation(180 * Math.PI / 180);
    }
    shoot() {
        if (this.canShoot) {
            this.audioShoot = this.scene.sound.add('shoot');
            this.audioShoot.setVolume(0.2);
            if (!this.audioShoot.isPlaying) {
                this.audioShoot.play({ loop: false });
            }
            switch (this.powerups) {
                case 0:
                    this.canShoot = false;
                    this.bulletsPool.spawn(this.x, this.y);
                    break;
                case 1: case 2:
                    this.canShoot = false;
                    this.bulletsPool._group.getChildren().forEach(bullet => {
                        bullet.setTexture('bala2');
                    });
                    this.bulletsPool.spawn(this.x, this.y);
                    break;
                default:
                    this.canShoot = false;
                    this.bulletsPool.spawn(this.x, this.y);
                    break;
            }
        }
    }
    StopY() {
        this.body.setVelocity(this.body.velocity.x, 0); //Igualamos todas las velicidades a 0
    }
    StopX() {
        this.body.setVelocity(0, this.body.velocity.y); //Igualamos todas las velicidades a 0
    }

    //Detector de Inputs
    attackPress() {
        return Phaser.Input.Keyboard.JustDown(this.attackKey);
    }
    attackRelease() {
        return Phaser.Input.Keyboard.JustUp(this.attackKey);
    }

    death() {
        // Deshabilitar los inputs
        this.StopX();
        this.StopY();
        this.body.enable = false;
        this.leftMovKey.enabled = false;
        this.rightMovKey.enabled = false;
        this.upMovKey.enabled = false;
        this.downMovKey.enabled = false;
        this.attackKey.enabled = false;
        this.setActive(false);
        this.setVisible(false);
    }
    addPowerUp() {
        this.powerups += 1;
        if (this.powerups > 2) {
            this.shootCooldown -= 0.2;
        }
        this.speed += 10 * this.powerups;
    }
    getLevelPowerUp() {
        return this.powerups;
    }

};