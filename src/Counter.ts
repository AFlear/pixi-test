import {Text} from "pixi.js";

export default class Counter extends Text {
    constructor(x: number, y: number, text: string) {
        super(text);
        this.style = {
            fill: "#3498db",
            align: "center",
            stroke: "#34495e",
            strokeThickness: 20,
            lineJoin: "round",
        }
        this.anchor.x = 0.5;
        this.x = x;
        this.y = y;

    }

}
