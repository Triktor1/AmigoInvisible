export default class StartMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartMenuScene' }) //id de la escena
    }
    create() {
        this.cameras.main.setBackgroundColor(0x37946e);
        const TITLE = this.add.text(this.sys.game.canvas.width / 2, this.sys.game.canvas.height * 0.1, 'GOBLIN', {
            fontSize: '18px',
            color: '#99e550',
            fontFamily: 'sekuya',
            padding: { x: 10, y: 5 },
            stroke: '#323c39', // Color del borde
            strokeThickness: 4 // Grosor del borde
        }).setOrigin(0.5, 0);
        const TITLE2 = this.add.text(this.sys.game.canvas.width / 2, this.sys.game.canvas.height * 0.2, 'PARADE', {
            fontSize: '18px',
            color: '#99e550',
            fontFamily: 'sekuya',
            padding: { x: 10, y: 5 },
            stroke: '#323c39', // Color del borde
            strokeThickness: 4 // Grosor del borde
        }).setOrigin(0.5, 0);
        let Play;
        let Salir;
        //Para añadir una imagen (posicion X, posicion Y, id de la imagen)
        //En caso de que los botones sean texto
        Play = this.add.text(this.sys.game.canvas.width / 2, this.sys.game.canvas.height * 0.4, 'Jugar', {
            fontSize: '20px',
            color: '#639bff',
            fontFamily: 'sekuya',
            padding: { x: 10, y: 5 },
            stroke: '#306082', // Color del borde
            strokeThickness: 4 // Grosor del borde
        }).setOrigin(0.5, 0);
        Salir = this.add.text(this.sys.game.canvas.width / 2, this.sys.game.canvas.height * 0.6, 'Salir', {
            fontSize: '20px',
            color: '#d77bba',
            fontFamily: 'sekuya',
            padding: { x: 10, y: 5 },
            stroke: '#76428a', // Color del borde
            strokeThickness: 4 // Grosor del borde
        }).setOrigin(0.5, 0);
        Play.setInteractive();
        Play.on('pointerdown', pointer => {
            this.scene.start("MainScene");
        });
        Salir.setInteractive();
        Salir.on('pointerdown', pointer => {
            window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        });
    }
}