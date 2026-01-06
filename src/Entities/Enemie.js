export default class enemie extends Phaser.GameObjects.Sprite {
    //Constructor, se llama al crear la entidad
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture); //super, esencial al heredar de Sprites de Phaser, (escena de dnd procede,posicion X, posicion Y, textura que recibe, y el frame inicial)
        this.speed = Phaser.Math.Between(15, 45); //Velocidad de la entidad
        this.dead = false;
        this.scene.add.existing(this); //Añade la entidad a la escena 
        this.scene.physics.add.existing(this); //Añade a la escena que este objeto tenga físicas
        this.dir = 1;
        this.horizontal = Phaser.Math.Between(0, 1) === 1;
        this.Spawn();
        this.play(texture);
    }
    preUpdate(t, dt) {
        super.preUpdate(t, dt); //LLamamos al preUpdate del padre para que las animaciones se ejucten correctamente
        if (!this.dead) {
            if (this.horizontal) {
                this.body.setVelocity(this.speed * this.dir, 0);
                if (this.spawnPos) {
                    if (this.x > this.scene.sys.game.canvas.width) this.destroy();
                }
                else {
                    if (this.x < 0) this.destroy();
                }
            }
            else {
                this.body.setVelocity(0, this.speed * this.dir);
                if (this.spawnPos) {
                    if (this.y > this.scene.sys.game.canvas.height) this.destroy();
                }
                else {
                    if (this.y < 0) this.destroy();
                }
            }
        }
        else {
            this.body.setVelocity(0, 0);
        }
    }

    Spawn() {
        this.spawnPos = Phaser.Math.Between(0, 1) === 1;
        if (this.horizontal) {
            this.y = Phaser.Math.Between(this.scene.sys.game.canvas.height * 0.1, this.scene.sys.game.canvas.height * 0.9);
            this.OgPos = this.y;
            if (this.spawnPos) {
                this.x = -20;
                this.dir = 1;
            }
            else {
                this.x = this.scene.sys.game.canvas.width * 1.1;
                this.dir = -1;
            }
            this.body.setVelocity(this.speed * this.dir, 0);
        }
        else {
            this.x = Phaser.Math.Between(this.scene.sys.game.canvas.width * 0.1, this.scene.sys.game.canvas.width * 0.9);
            this.OgPos = this.x;
            if (this.spawnPos) {
                this.y = -20;
                this.dir = 1;
            }
            else {
                this.y = this.scene.sys.game.canvas.height * 1.1;
                this.dir = -1;
            }
            this.body.setVelocity(0, this.speed * this.dir);
        }
    }
};