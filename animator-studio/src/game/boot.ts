import * as Phaser from "phaser";
import {
  Skin,
  SkinsAndAnimationBoundsProvider,
  SpineGameObject,
  SpinePlugin,
} from "../plugins/spine-phaser41";

//@ts-ignore
// import * as OldSpinePlugin from "../plugins/spine/dist/SpinePlugin.js";

// import * as rive from "@rive-app/canvas-advanced-single";
// import { Rive, RuntimeLoader } from "@rive-app/webgl";

// import { RiveLoaderPlugin } from "../plugins/rive/RiveLoader";

// import "phaser/plugins/spine4.1/dist/SpinePluginDebug";
// import ScalinePostFX from "./scanLines";

import GameConfig = Phaser.Types.Core.GameConfig;
// import ScenePreloadCallback = Phaser.Types.Scenes.ScenePreloadCallback;
// import SceneCreateCallback = Phaser.Types.Scenes.SceneCreateCallback;
// import SceneUpdateCallback = Phaser.Types.Scenes.SceneUpdateCallback;
// import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;
// import registerRiveFactory from "../plugins/rive/registerRiveObjectFactory";
// import { RiveObject } from "../plugins/rive/RiveObject";

// import Actor from "../plugins/nima/types/Actor";
// import { default as NimaActorLoader } from "../plugins/nima/ActorLoader.js";
// import Graphics from "../plugins/nima/Graphics.js";
// import type ActorLoader from "../plugins/nima/types/ActorLoader";
// import Archer from "./archer";
// import { NimaPlugin } from "./nimaPlugin";

// Define a Phaser Scene
class SpinePreviewScene extends Phaser.Scene {
  // test_nima: {
  //   screen: any;
  //   graphics: Graphics;
  //   loader: ActorLoader | null;
  //   actor: Actor | null;
  //   animation: any | null;
  //   animationTime: number;
  // };
  // t_rive: Rive;
  // screen: HTMLCanvasElement;
  // archer: Archer | undefined;

  texture: any;
  canvas: any;
  context: any;

  constructor() {
    super({
      key: "SpinePreviewScene",
      //   pack: {
      //     files: [
      //       {
      //         type: "scenePlugin",
      //         key: "SpinePlugin",
      //         url: "plugins/Spine3.8Plugin.js",
      //         sceneKey: "spine",
      //       },
      //     ],
      //   },
    });
    // this.screen = document.createElement("canvas");
    // this.screen.width = 400;
    // this.screen.height = 400;
    // this.screen.style.opacity = "0";
    // this.screen.style.position = "absolute";
    // this.screen.style.bottom = "0";
    // this.screen.style.right = "0";
    // this.screen.style.backgroundColor = "#f0f0f0";
    // this.screen.style.border = "1px solid #ccc";
    // document.body.appendChild(this.screen);

    // const offscreen = new OffscreenCanvas(400, 400);
    // this.test_nima = {
    //   screen: canvas, // offscreen
    //   graphics: new Graphics(canvas),
    //   loader: null,
    //   actor: null,
    //   animation: null,
    //   animationTime: 0,
    // };

    // RuntimeLoader.setWasmUrl("/rive/rive.wasm");

    // this.t_rive = new Rive({
    //   src: "/rive/marty.riv",
    //   canvas: this.screen,
    //   autoplay: true,
    // });

    // this.archer = new Archer(this.screen);
    // this.archer.load("/nima/Archer.nma", function (error) {
    //   if (error) {
    //     console.log("failed to load actor file...", error);
    //   }
    // });

    // this.screen.width = 120;

    // this.archer.setSize(120, 120);
  }

  preload() {
    // Load the Spine plugin
    // this.load.scenePlugin("SpinePlugin", SpinePlugin, "spinePlugin", "spine");
    // this.load.scenePlugin(
    //   "SpinePlugin",
    //   "/plugins/Spine3.8Plugin.js",
    //   "spinePlugin",
    //   "spine"
    // );

    // Load any Spine assets you want to preview

    this.load.setPath("/spine/hasumi/");
    // this.load.spine("hasumi", "hasumiTfront.json", "hasumiTfront.atlas");
    this.load.spineAtlas("Hasumi", "hasumiTfront.atlas");
    this.load.spineJson("hasumi", "hasumiTfront.json");

    this.load.setPath("/spine/liya/");
    // this.load.spine("liya", "Liya.json", "Liya.atlas");
    this.load.spineAtlas("Liya", "Liya.atlas");
    this.load.spineJson("liya", "Liya.json");

    this.load.setPath("/spine/girl/");
    // this.load.spine("girl", "Girl.json", "Girl.atlas");

    this.load.spineAtlas("Girl", "Girl.atlas");
    this.load.spineJson("girl", "Girl.json");
    // this.load.spineAtlas("seele-atlas", "/spine/seele/seele.atlas");
    // this.load.spineJson("seele", "/spine/seele/seele.json");
    this.load.setPath("/spine/goblins/");
    this.load.spineAtlas("Goblins", "goblins-pma.atlas");
    this.load.spineJson("goblins", "goblins-pro.json");

    // this.load.setPath("/spine/seele/");
    // this.load.image("seele-hx", "hx.png");
    // this.load.spine("seele", "seele.json", "seele.atlas", true);
    // this.load.setPath("/spine/laishen/");
    // this.load.spine("laishen", "leishen.json", "leishen.atlas", true);

    // this.load.setPath("/spine/leiboss/");

    this.load.setPath("/spine/leiboss/");
    // this.load.spine("laishen", "leiboss.json", "leiboss.atlas");

    this.load.spineAtlas("Laishen", "leiboss.atlas");
    this.load.spineJson("laishen", "leiboss.json");

    // this.load.spineJson("hcg_boss_4", "/spine/hcg_boss_4/HCG_Boss4.json");
    // this.load.spineAtlas(
    //   "hcg_boss_4-atlas",
    //   "/spine/hcg_boss_4/HCG_Boss4.atlas"
    // );

    // this.load.spineJson("seele", "/spine/seele/seele.json");
    // this.load.spineAtlas("seele-atlas", "/spine/seele/seele.atlas");

    this.load.image("bg_boss", "bg_boss.png");

    // this.load.spine("bg", "bg.json", "bg.atlas", true);
    this.load.spineAtlas("Bg", "bg.atlas");
    this.load.spineJson("bg", "bg.json");

    // this.load.spineJson("bg", "/spine/leiboss/bg.json");
    // this.load.spineAtlas("bg-atlas", "/spine/leiboss/bg.atlas");
    // // this.load.spine("laishen", "leiboss.json", "leiboss.atlas", true);
    // this.load.spineJson("laishen", "/spine/leiboss/leiboss.json");
    // this.load.spineAtlas("laishen-atlas", "/spine/leiboss/leiboss.atlas");

    this.load.glsl("leiboss", "shaders/leiboss.glsl.js");

    this.load.setPath("/spine/spineboy/");
    // this.load.spine("spineboy", "spineboy-pro.json", "spineboy-pma.atlas");
    this.load.spineAtlas("Spineboy", "spineboy-pma.atlas");
    this.load.spineJson("spineboy", "spineboy-pro.json");

    // this.load.setPath("/rive");
    // this.load.rive("boy", "boy.riv");
    this.load.setPath("");

    // this.test_nima.loader = new NimaActorLoader() as ActorLoader;
    // this.test_nima.loader.load("/nima/Archer.nma", (actor: Actor) => {
    //   if (!actor || actor.error) {
    //     console.error("Failed to load NIMA actor.");
    //     return;
    //   }

    //   actor.initialize(this.test_nima.graphics);
    //   this.test_nima.actor = actor.makeInstance();
    //   this.test_nima.actor.initialize(this.test_nima.graphics);
    //   this.test_nima.animation = this.test_nima.actor.getAnimation("Run");
    //   this.test_nima.animationTime = 0;
    // });
  }

  update(time: number, delta: number): void {
    // if (this.test_nima.actor) {
    //   const elapsedSeconds = delta / 1000;
    //   this.test_nima.animationTime =
    //     (this.test_nima.animationTime + elapsedSeconds) %
    //     this.test_nima.animation.duration;
    //   this.test_nima.animation.apply(
    //     this.test_nima.animationTime,
    //     this.test_nima.actor,
    //     1.0
    //   );
    //   this.test_nima.actor.advance(elapsedSeconds);
    //   this.test_nima.actor.draw(this.test_nima.graphics);
    // }
  }

  create() {
    window.spine = this.spine;
    // Enable input for drag-and-drop
    this.input.dragTimeThreshold = 100;
    this.input.setTopOnly(false);

    // Set background image
    const background = this.add.image(0, 0, "bg_boss").setOrigin(0);

    // Create Spine GameObject for background
    // const bgSpine = this.add.spine(0, 0, "bg", "animation_name", true);
    const bgSpine = this.add.spine(
      0,
      0,
      "bg",
      "Bg",
      new SkinsAndAnimationBoundsProvider(null, ["animation"])
    );
    // const bgSpine = this.add.spine(0, 0, "bg", "animation_name", true);
    bgSpine.setPosition(750, 550);
    bgSpine.setScale(1);

    // let spine = this.add.spine(400, 400, "seele", "animation", true);
    // let spine = this.add.spine(400, 400, "laishen", "animation", true);
    let spine = this.add.spine(
      1500,
      1500,
      "laishen",
      "Laishen",
      new SkinsAndAnimationBoundsProvider(null, ["animation"])
    );
    // @ts-ignore
    window.laishen = spine;
    spine.animationState.setAnimation(0, "animation", true);
    // let spine = this.add.spine(400, 400, "laishen", "animation", true);
    spine.setScale(0.95);
    spine.setPosition(720, 480);

    let spineboy = this.add.spine(
      200,
      400,
      "spineboy",
      "Spineboy",
      new SkinsAndAnimationBoundsProvider("idle", ["default"])
    );

    // @ts-ignore
    window.spineboy = spineboy;
    spineboy.animationState.setAnimation(0, "idle", true);

    // let spineboy = this.add.spine(200, 400, "spineboy", "idle", true);
    // spineboy.setAnimation(0, "xxBeHit_Gun", true);
    // spineboy.setSkinByName("Normal");
    spineboy.setScale(0.75);
    spineboy.setPosition(220, 480);

    let hasumi = this.add.spine(
      200,
      400,
      "hasumi",
      "Hasumi",
      new SkinsAndAnimationBoundsProvider(null, ["default"])
    );
    // let hasumi = this.add.spine(400, 400, "hasumi", "default", true);
    // spineboy.setAnimation(0, "xxBeHit_Gun", true);
    // spineboy.setSkinByName("Normal");
    // @ts-ignore
    window.hasumi = hasumi;
    // @ts-ignore

    // hasumi.drawDebug = true;
    // setDebugBones
    hasumi.setScale(3);
    hasumi.setPosition(420, 480);

    // const test = new RiveObject(this, "boy", 500, 500); // , artboard, stateMachine
    // console.log(test);
    // test.addToDisplayList();
    // test.addToUpdateList();
    // test.debug = true;
    // test.play("Strength40");
    // test.setInteractive();

    // let riveElem = this.add.dom(100, 100, this.screen);

    // @ts-ignore
    // this.nima.create(400, 400, 200, 200);

    // let nimaElem = this.add.dom(100, 100, this.test_nima.screen);

    // this.add.dom(0, 0, test);
    // this.add.existing(test);

    // let boy = this.add.rive()

    // let girl = this.add.spine(400, 400, "girl", "Idle_HandGun", true);
    // girl.setSkin("Normal");
    // girl.setScale(0.95);
    // girl.setPosition(720, 480);

    // spine.animationState.setAnimation(0, "animation", true);

    // this.cameras.main.setPostPipeline(ScalinePostFX);

    // const shader = this.cameras.main.getPostPipeline(ScalinePostFX);
    // this.input.on("pointermove", (pointer) => {
    //   shader.mouseX = pointer.x;
    //   shader.mouseY = pointer.y;
    // });

    // this.add.shader("Leiboss", 400, 300, 512, 512);

    // const frag = `
    //         precision mediump float;

    //         uniform vec2 resolution;
    //         uniform sampler2D iChannel0;

    //         varying vec2 fragCoord;

    //        uniform sampler2D uTexture; // Background texture

    // void main() {
    //     vec4 color = texture2D(uTexture, vec2(gl_FragCoord.x / 800.0, 1.0 - gl_FragCoord.y / 600.0)); // Adjust texture coordinates based on screen resolution
    //     color.rgb = 1.0 - color.rgb; // Invert RGB values
    //     gl_FragColor = color;
    // }
    //         `;

    // const base = new Phaser.Display.BaseShader("simpleTexture", frag);

    // const shader = this.add.shader(base, 400, 300, 800, 600);

    //  Or, set the texture like this:

    // shader.setChannel0('checker');

    // Create a Spine GameObject
    let goblins = this.add.spine(
      454,
      480,
      "goblins",
      "Goblins",
      new SkinsAndAnimationBoundsProvider(null, ["goblingirl"])
    );
    // @ts-ignore
    window.goblins = goblins;

    // spine.skeleton.setSkinByName("goblingirl");
    // spine.scaleX = -1;
    // let spine = this.add.spine(
    //   512,
    //   550,
    //   "girl",
    //   "Girl",
    //   new SkinsAndAnimationBoundsProvider(null, ["Idle_Rifle"])
    // );
    // spine.skeleton.setSkinByName("Normal");
    // spine.animationState.setAnimation(0, "Idle_Rifle", true);
    // let spine = this.add.spine(
    //   512,
    //   550,
    //   "seele",
    //   "seele-atlas",
    //   new SkinsAndAnimationBoundsProvider(null, ["animation"])
    // );
    // spine.skeleton.setSkinByName("default");
    // spine.setScale(0.5, 0.5);
    // spine.animationState.setAnimation(0, "animation", true);
    // spine.setY(10);

    // Make the Spine GameObject interactive
    // spine.setInteractive();
  }
}

class RivePreviewScene extends Phaser.Scene {
  constructor() {
    super("RiveDemo");
  }

  preload() {}
}

// Initialize Phaser game configuration
const config = {
  type: Phaser.AUTO,
  width: 1600,
  height: 1000,
  backgroundColor: "#000",
  scene: [SpinePreviewScene],
  physics: {
    default: "matter",
    matter: {
      debug: true,
      gravity: { y: 5 },
    },
  },
  plugins: {
    scene: [
      // {
      //   key: "SpinePlugin", // @ts-ignore
      //   plugin: window.SpinePlugin,
      //   mapping: "spine",
      // },
      // {
      //   key: "RiveLoaderPlugin",
      //   plugin: RiveLoaderPlugin,
      //   mapping: "rive",
      //   sceneKey: "rive",
      // },
      // {
      //   key: "NimaPlugin",
      //   plugin: NimaPlugin,
      //   mapping: "nima",
      //   sceneKey: "nima",
      // },
      //   {
      //     key: "SpinePlugin",
      //     plugin: "public/SpinePluginDebug.js",
      //     // plugin: OldSpinePlugin,
      //     mapping: "spine",
      //     sceneKey: "spine",
      //   },
      {
        key: "SpineLatestPlugin",
        plugin: SpinePlugin,
        mapping: "spine",
        sceneKey: "spine",
      },
    ],
  },
  //   pipeline: { ScalinePostFX },
};

// Create a new Phaser game instance
export const game = () => new Phaser.Game(config);
