import { Application, Loader, AnimatedSprite, Sprite, Container, Text } from "pixi.js";
import CONFIG from "../config.json";
import "./style.css";

const gameWidth = 800;
const gameHeight = 600;
const enemy: { idle: any; death: any } = {};
let stage = null;
let ENEMY_COUNT = CONFIG.ENEMY_NUMBER;
let enemyCount = null;
const app = new Application({
    width: window.outerWidth,
    height: window.outerHeight,
    antialias: true,
    resizeTo: window,
    autoDensity: true,
});

window.onload = async (): Promise<void> => {
    await loadGameAssets();
    document.body.appendChild(app.view);
    resizeCanvas();
    stage = new Container();
    stage.width = app.stage.width;
    stage.height = app.stage.height;
    stage.position.x = 0;
    stage.position.y = 0;
    const background = new Sprite(Loader.shared.resources["background"].texture);
    background.width = gameWidth;
    background.height = gameHeight;
    background.anchor.x = 0;
    background.anchor.y = 0;
    background.position.x = 0;
    background.position.y = 0;
    stage.addChild(background);
    enemyCount = new Text(`ENEMIES LEFT: ${ENEMY_COUNT}`, {
        font: 'bold 64px Roboto', // Set  style, size and font
        fill: "#3498db", // Set fill color to blue
        align: "center", // Center align the text, since it's multiline
        stroke: "#34495e", // Set stroke color to a dark blue gray color
        strokeThickness: 20, // Set stroke thickness to 20
        lineJoin: "round", // Set the lineJoin to round
    });
    enemyCount.anchor.x = 0.5;
    enemyCount.x = stage.width / 2;
    enemyCount.y = stage.height / 12;
    stage.addChild(enemyCount);
    for (let i = 0; i < CONFIG.ENEMY_NUMBER; i++) {
        const charFromSprite = getChar();
        charFromSprite.anchor.set(0.5, 0.5);
        charFromSprite.width = 50;
        charFromSprite.height = 50;
        // charFromSprite.position.set(i * 50 + 25, getRandomPosition(stage.height / 2 - 50, stage.height - 25));
        charFromSprite.position.set(CONFIG.ENEMIES_POSITIONS[i].x, CONFIG.ENEMIES_POSITIONS[i].y);
        charFromSprite.interactive = true;
        charFromSprite.on("mousedown", death);
        charFromSprite.on("touchstart", death);
        stage.addChild(charFromSprite);
    }
    app.stage.addChild(stage);
};

async function loadGameAssets(): Promise<void> {
    return new Promise((res, rej) => {
        const loader = Loader.shared;
        loader.add("character", "./assets/atlas/atlas.json").add("background", "./assets/background.jpg");

        loader.onComplete.once(() => {
            res();
            const sheet = Loader.shared.resources["character"].spritesheet;
            enemy.idle = sheet?.animations["Idle"];
            enemy.death = sheet?.animations["Death"];
        });

        loader.onError.once(() => {
            rej();
        });

        loader.load();
    });
}

function resizeCanvas(): void {
    const resize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        app.stage.scale.x = window.innerWidth / gameWidth;
        app.stage.scale.y = window.innerHeight / gameHeight;
    };

    resize();

    window.addEventListener("resize", resize);
}

function getChar(): AnimatedSprite {
    const idleChar = new AnimatedSprite(enemy.idle);

    idleChar.loop = true;
    idleChar.animationSpeed = 0.5;
    idleChar.play();

    return idleChar;
}

function death(): void {
    const deathAnimation = new AnimatedSprite(enemy.death);
    this.stop();
    this.animationSpeed = 0.5;
    this.textures = deathAnimation.textures;
    this.loop = false;
    this.play();
    this.interactive = false;
    this.onFrameChange = (frame) => {
        this.alpha = this.alpha - +frame / 100;
    };
    this.onComplete = () => {
        setTimeout(() => {
            ENEMY_COUNT -= 1;
            enemyCount.text = `ENEMIES LEFT: ${ENEMY_COUNT}`;
            this.stop();
            this.destroy();
        }, 500);
    };
}
