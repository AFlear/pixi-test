import {Sprite,Texture} from "pixi.js";

export default class Background extends Sprite {
    constructor(x: number, y: number, textures: Texture | undefined,gameHeight: number, gameWidth: number) {
        super(textures);
        this.width = gameWidth;
        this.height = gameHeight;
        this.anchor.x = 0;
        this.anchor.y = 0;
        this.position.x = 0;
        this.position.y = 0;
    }

}
