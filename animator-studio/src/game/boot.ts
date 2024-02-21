import * as Phaser from "phaser";
// import {
//   Skin,
//   SkinsAndAnimationBoundsProvider,
//   SpineGameObject,
//   SpinePlugin,
// } from "@esotericsoftware/spine-phaser";

//@ts-ignore
// import * as OldSpinePlugin from "../plugins/spine/dist/SpinePlugin.js";

import "phaser/plugins/spine4.1/dist/SpinePlugin";
import ScalinePostFX from "./scanLines";

import GameConfig = Phaser.Types.Core.GameConfig;
import ScenePreloadCallback = Phaser.Types.Scenes.ScenePreloadCallback;
import SceneCreateCallback = Phaser.Types.Scenes.SceneCreateCallback;
import SceneUpdateCallback = Phaser.Types.Scenes.SceneUpdateCallback;
import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

// Define a Phaser Scene
class SpinePreviewScene extends Phaser.Scene {
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

    this.load.setPath("/spine/girl/");
    this.load.spine("girl", "Girl.json", "Girl.atlas");

    // this.load.spineAtlas("Girl", "/spine/girl/Girl.atlas");
    // this.load.spineJson("girl", "/spine/girl/Girl.json");
    // this.load.spineAtlas("seele-atlas", "/spine/seele/seele.atlas");
    // this.load.spineJson("seele", "/spine/seele/seele.json");
    // this.load.spineAtlas("goblins-atlas", "/spine/goblins/goblins-pma.atlas");
    // this.load.spineJson("goblins", "/spine/goblins/goblins-pro.json");

    // this.load.setPath("/spine/seele/");
    // this.load.image("seele-hx", "hx.png");
    // this.load.spine("seele", "seele.json", "seele.atlas", true);
    // this.load.setPath("/spine/laishen/");
    // this.load.spine("laishen", "leishen.json", "leishen.atlas", true);

    // this.load.setPath("/spine/leiboss/");

    this.load.setPath("/spine/leiboss/");
    this.load.spine("laishen", "leiboss.json", "leiboss.atlas");

    // this.load.spineJson("hcg_boss_4", "/spine/hcg_boss_4/HCG_Boss4.json");
    // this.load.spineAtlas(
    //   "hcg_boss_4-atlas",
    //   "/spine/hcg_boss_4/HCG_Boss4.atlas"
    // );

    // this.load.spineJson("seele", "/spine/seele/seele.json");
    // this.load.spineAtlas("seele-atlas", "/spine/seele/seele.atlas");

    this.load.image("bg_boss", "bg_boss.png");
    this.load.spine("bg", "bg.json", "bg.atlas", true);
    // this.load.spineJson("bg", "/spine/leiboss/bg.json");
    // this.load.spineAtlas("bg-atlas", "/spine/leiboss/bg.atlas");
    // // this.load.spine("laishen", "leiboss.json", "leiboss.atlas", true);
    // this.load.spineJson("laishen", "/spine/leiboss/leiboss.json");
    // this.load.spineAtlas("laishen-atlas", "/spine/leiboss/leiboss.atlas");

    this.load.glsl("leiboss", "shaders/leiboss.glsl.js");
  }

  create() {
    // Enable input for drag-and-drop
    this.input.dragTimeThreshold = 100;
    this.input.setTopOnly(false);

    // Set up events for drag-and-drop
    this.input.on("dragstart", (pointer, gameObject) => {
      gameObject.setTint(0xff0000);
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on("dragend", (pointer, gameObject) => {
      gameObject.clearTint();
    });

    // Set background image
    const background = this.add.image(0, 0, "bg_boss").setOrigin(0);

    // Create Spine GameObject for background
    // const bgSpine = this.add.spine(0, 0, "bg", "animation_name", true);
    // const bgSpine = this.add.spine(
    //   0,
    //   0,
    //   "bg",
    //   "bg-atlas",
    //   new SkinsAndAnimationBoundsProvider(null, ["animation"])
    // );
    const bgSpine = this.add.spine(0, 0, "bg", "animation_name", true);
    bgSpine.setPosition(750, 550);
    bgSpine.setScale(1);

    // let spine = this.add.spine(400, 400, "seele", "animation", true);
    // let spine = this.add.spine(400, 400, "laishen", "animation", true);
    // let spine = this.add.spine(
    //   1500,
    //   1500,
    //   "hcg_boss_4",
    //   "hcg_boss_4-atlas",
    //   new SkinsAndAnimationBoundsProvider(null, ["G_3"])
    // );
    // spine.animationState.setAnimation(0, "G_3", true);
    let spine = this.add.spine(400, 400, "laishen", "animation", true);
    spine.setScale(0.95);
    spine.setPosition(720, 480);

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
    // let spine = this.add.spine(
    //   454,
    //   480,
    //   "goblins",
    //   "goblins-atlas",
    //   new SkinsAndAnimationBoundsProvider(null, ["goblingirl"])
    // );
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
      {
        key: "SpinePlugin", // @ts-ignore
        plugin: window.SpinePlugin,
        mapping: "spine",
      },
      //   {
      //     key: "SpinePlugin",
      //     plugin: "public/SpinePluginDebug.js",
      //     // plugin: OldSpinePlugin,
      //     mapping: "spine",
      //     sceneKey: "spine",
      //   },
      //   {
      //     key: "SpineLatestPlugin",
      //     plugin: SpinePlugin,
      //     mapping: "spineLatest",
      //     sceneKey: "spineLatest",
      //   },
    ],
  },
  //   pipeline: { ScalinePostFX },
};

// Create a new Phaser game instance
export const game = () => new Phaser.Game(config);
