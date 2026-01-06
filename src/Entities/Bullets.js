
export default class Bullet extends Phaser.GameObjects.Sprite {
    //Constructor, se llama al crear la entidad
    constructor(scene, x, y, texture, pool, dirX = 0, dirY = 1) {
        super(scene, x, y, texture); //super, esencial al heredar de Sprites de Phaser, (escena de dnd procede,posicion X, posicion Y, textura que recibe, y el frame inicial)
        this.speed = 150; //Velocidad de la entidad
        this.scene.add.existing(this); //Añade la entidad a la escena 
        this.scene.physics.add.existing(this);// Agregamos la caja a las físicas para que Phaser lo tenga en cuenta
        this.pool = pool;
        this.dirX = dirX;
        this.dirY = dirY;
        this.destroyNow = false;
    }
    preUpdate(t, dt) {
        super.preUpdate(t, dt); //LLamamos al preUpdate del padre para que las animaciones se ejucten correctamente
        if (this.y < 0 || this.x < 0 || this.x > this.scene.sys.game.canvas.width || this.y > this.scene.sys.game.canvas.height)
            this.destroyNow = true;
        if (this.destroyNow) {
            this.body.velocity.y = 0;
            this.destroyNow = false;
            this.pool.release(this);
        }
    }
    setSpeed() {
        this.dirX = this.scene.getPlayer().dirX;
        this.dirY = this.scene.getPlayer().dirY;
        this.body.setVelocity(this.dirX * this.speed, this.dirY * this.speed);
    }
};