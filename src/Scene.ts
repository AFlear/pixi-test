import {Container} from "pixi.js";

export default class Scene extends Container {
    constructor(width:number, height:number) {
        super();
        this.position.x = 0;
        this.position.y = 0;
        this.width = width;
        this.height = height;
    }

}
