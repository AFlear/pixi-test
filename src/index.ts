import { Application, Loader} from "pixi.js";
import CONFIG from "../config.json";
import "./style.css";
import Enemy from "./Enemy";
import Background from "./Background";
import Counter from "./Counter";
import Scene from "./Scene";

const gameWidth = 800;
const gameHeight = 600;
const enemy: { idle: any; death: any } = {idle: null, death: null};
let stage = null;
let ENEMY_COUNT = CONFIG.ENEMY_NUMBER;
let enemyCount: Counter;
const enemies: any = [];

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
    stage = new Scene(app.stage.width, app.stage.height);
    const background = new Background(0,0,Loader.shared.resources["background"].texture,gameHeight, gameWidth);
    stage.addChild(background);
    enemyCount = new Counter(stage.width / 2, stage.height / 12,`ENEMIES LEFT: ${ENEMY_COUNT}` );

    stage.addChild(enemyCount);
    for (let i = 0; i < CONFIG.ENEMY_NUMBER; i++) {
        const enemyMonster = new Enemy(CONFIG.ENEMIES_POSITIONS[i].x,
            CONFIG.ENEMIES_POSITIONS[i].y,
            enemy.idle,
            i,
            enemy,
            updateCounter
            );
        stage.addChild(enemyMonster);
        enemies.push(enemyMonster);
    }
    app.stage.addChild(stage);
    const interval = setInterval(function() {
        const t =  Math.floor(Math.random() * enemies.length);
        idle_animate(t);
    }, 500);
    if(enemies.length === 0) {
        clearInterval(interval);
    }
};

function updateCounter(){
    ENEMY_COUNT = ENEMY_COUNT !== 0 ? ENEMY_COUNT -1 : 0;
    enemyCount.text = `ENEMIES LEFT: ${ENEMY_COUNT}`;
}

async function loadGameAssets(): Promise<void> {
    return new Promise((res, rej) => {
        const loader = Loader.shared;
        loader.add("character", "./assets/atlas/atlas.json").add("background", "./assets/background.jpg");

        loader.onComplete.once(() => {
            res();
            const sheet = Loader.shared.resources["character"].spritesheet;
            enemy.idle = sheet?.animations["idle"];
            enemy.death = sheet?.animations["death"];
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

function idle_animate(i: number) {
   enemies[i].idle_animate();
}
