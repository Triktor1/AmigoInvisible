import player from "./player.js"
export default class player1 extends player {
    //Constructor, se llama al crear la entidad
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        //Inputs
        this.leftMovKey = this.scene.input.keyboard.addKey('A'); //izquierda
        this.rightMovKey = this.scene.input.keyboard.addKey('D'); //derecha
        this.upMovKey = this.scene.input.keyboard.addKey('W'); //arriba
        this.downMovKey = this.scene.input.keyboard.addKey('S'); //abajo
        this.attackKey = this.scene.input.keyboard.addKey('Space'); //atacar
    }
    preUpdate(t, dt) {
        super.preUpdate(t, dt); //LLamamos al preUpdate del padre para que las animaciones se ejucten correctamente
    }
};