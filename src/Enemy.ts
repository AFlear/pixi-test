import {Application, Loader, AnimatedSprite, Sprite, Container, Text, Texture} from "pixi.js";

export default class Enemy extends AnimatedSprite {
        private index;
        private animations;
        private updateCounter;

        constructor(x: number, y: number, textures: Texture[],index: number, animations: {death: any; idle: any}, updateCounter: ()=> void) {
            super(textures);
            this.anchor.set(0.5, 0.5);
            this.width = 40;
            this.height = 60;
            this.position.set(x, y);
            this.interactive = true;
            this.animations = animations;
            this.index = index;
            this.updateCounter = updateCounter;
            this.on("mousedown", this.death);
            this.on("touchstart", this.death);
        }

    death(i: number, charFromSprite: AnimatedSprite): void {
        const deathAnimation = new AnimatedSprite(this.animations.death);
        this.stop();
        this.animationSpeed = 0.35;
        this.textures = deathAnimation.textures;
        this.loop = false;
        this.play();
        this.interactive = false;
        this.onFrameChange = (frame) => {
            this.alpha = this.alpha - +frame / 30;
        };
        this.onComplete = () => {
            setTimeout(() => {
                this.stop();
                this.destroy();
            }, 500);
            // enemies.splice(i,1);
            this.updateCounter();
        };
    }
    idle_animate() {
        this.loop = false;
        this.animationSpeed = 0.5;
        this.play();
    }
}
