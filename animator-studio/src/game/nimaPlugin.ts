import { Textures } from "phaser";
import Archer from "./archer";

import {
  ActorLoader,
  AnimationInstance,
  Graphics,
} from "../plugins/anima/Nima";
import { mat2d, vec2 } from "gl-matrix";

export class NimaPlugin extends Phaser.Plugins.ScenePlugin {
  texture: Textures.CanvasTexture | null;
  canvas?: HTMLCanvasElement;
  context?: WebGLRenderingContext | null;
  maxIterations: number;
  graphics?: Graphics;

  constructor(
    scene: Phaser.Scene,
    pluginManager: Phaser.Plugins.PluginManager,
    pluginKey: string
  ) {
    super(scene, pluginManager, pluginKey);

    this.texture = null;
    this.canvas;
    this.context;
    this.maxIterations = 100;
  }

  create(x: number, y: number, w: number, h: number) {
    if (this.scene) {
      this.canvas = document.createElement("canvas");

      this.context = this.canvas.getContext("webgl");
      this.canvas.id = "nima-canvas";
      document.body.appendChild(this.canvas);

      //   this.texture = this.scene.textures.createCanvas("FractalPlugin", w, h);
      this.texture = this.scene.textures.addCanvas("nima-canvas", this.canvas);

      if (this.texture) {
        // this.canvas = this.texture.canvas;
        // this.context = this.texture.context;

        this.graphics = new Graphics(this.context);

        // this.drawJulia();

        const loader = new ActorLoader();
        loader.load("/nima/Archer.nma", (actor: any) => {
          if (!actor || actor.error) {
            console.log(
              "failed to load actor file...",
              !actor ? null : actor.error
            );
          } else {
            actor.initialize(this.graphics);
            const actorInstance = actor.makeInstance();
            actorInstance.initialize(this.graphics);

            // this.actor = actor;
            // this.actorInstance = actorInstance;
            if (actorInstance) {
              actorInstance.initialize(this.graphics);

              if (actorInstance._Animations.length) {
                const idleAnimation = actorInstance.getAnimation("Idle");
                idleAnimation.apply(0, actor, 1.0);
              }
            }

            //    this.setActor(actor);
          }
        });

        // let archer = new Archer(this.canvas);
        // archer.load("/nima/Archer.nma", function (error) {
        //   if (error) {
        //     console.log("failed to load actor file...", error);
        //   }
        // });

        // archer.setSize(120, 120);

        this.texture.refresh();

        let image = this.scene.add.image(x, y, "FractalPlugin");

        return image;
      }
    }
    return null;
  }

  update() {
    this.drawJulia();
  }

  drawJulia() {
    if (this.canvas && this.context) {
      let cw = this.canvas.width;
      let ch = this.canvas.height;
      let imageData = this.context.createImageData(cw, ch);
      let data = imageData.data;

      let x0 = -0.4;
      let y0 = -0.6;
      for (let i = 0; i < ch; i++) {
        for (let j = 0; j < cw; j++) {
          // limit the axis
          let x = -1.5 + (j * 3.0) / cw;
          let y = -1.0 + (i * 2.0) / ch;
          let iteration = 0;
          while (x * x + y * y < 4 && iteration < this.maxIterations) {
            let xN = x * x - y * y + x0;
            let yN = 2 * x * y + y0;
            x = xN;
            y = yN;
            iteration++;
          }
          // set pixel color [r,g,b,a]
          data[i * cw * 4 + j * 4 + 0] = iteration * 8;
          data[i * cw * 4 + j * 4 + 1] = iteration * 5;
          data[i * cw * 4 + j * 4 + 2] = iteration * 25;
          data[i * cw * 4 + j * 4 + 3] = iteration * 8;
        }
      }
      this.context.putImageData(imageData, 0, 0);
    }
  }
}
