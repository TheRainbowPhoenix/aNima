import {
  ActorLoader,
  AnimationInstance,
  Graphics as Graphics,
} from "$lib/runtime/Nima";
import { mat2d, vec2 } from "gl-matrix";

export default class SoloSlide {
  public _ViewCenter = [0.0, 2000.0];
  public _Scale = 0.2;
  public _ScreenScale = 1.0;
  public _ScreenMouse = vec2.create();
  public _WorldMouse = vec2.create();

  private _Graphics: any; // Nima.Graphics;
  private _LastAdvanceTime: number;
  private _ViewTransform: mat2d;
  private _Actor: any; // Nima.Actor | null;
  private _ActorInstance: any; // Nima.ActorInstance | null;
  private _AnimationInstance: any; // Nima.AnimationInstance | null;
  private _SlideAnimation: any; // Nima.Animation | null;
  private _SoloSkaterAnimation: any; // Nima.Animation | null;
  private _AdvanceTimeout: any;

  constructor(canvas: HTMLCanvasElement) {
    this._Graphics = new Graphics(canvas);
    this._LastAdvanceTime = Date.now();
    this._ViewTransform = mat2d.create();
    this._ActorInstance = null;
    this._AnimationInstance = null;
    this._SlideAnimation = null;
    this._SoloSkaterAnimation = null;

    // this.setSize(window.innerWidth, window.innerHeight);

    const _This = this;

    this._ScheduleAdvance(_This);
    this._Advance(_This);

    document.addEventListener("keydown", (ev) => {
      switch (ev.keyCode) {
        case 32: // Enter
          break;
        case 16: // Shift
          break;
        case 68: // 'D'
        case 39: // right
          break;
        case 65: // 'A'
        case 37: // left
          break;
        case 87:
        case 38:
          break;
      }
    });
  }

  public setSize(width: number, height: number) {
    this._Graphics.setSize(width, height);
  }

  private _Advance(_This: SoloSlide) {
    this.setSize(window.innerWidth, window.innerHeight);

    const now = Date.now();
    const elapsed = (now - this._LastAdvanceTime) / 1000.0;
    this._LastAdvanceTime = now;

    const actor = this._ActorInstance;

    if (this._AnimationInstance) {
      const ai = this._AnimationInstance;
      ai.time = ai.time + elapsed;
      ai.apply(this._ActorInstance, 1.0);
    }

    if (this._ActorInstance) {
      const graphics = this._Graphics;

      const w = graphics.viewportWidth;
      const h = graphics.viewportHeight;

      const vt = this._ViewTransform;
      vt[0] = _Scale;
      vt[3] = _Scale;
      vt[4] = -_ViewCenter[0] * _Scale + w / 2;
      vt[5] = -_ViewCenter[1] * _Scale + h / 2;

      this._ActorInstance.advance(elapsed);
    }

    this._Draw(this, this._Graphics);
    this._ScheduleAdvance(this);
  }

  private _Draw(viewer: SoloSlide, graphics: any) {
    if (!viewer._Actor) {
      return;
    }

    graphics.clear();
    graphics.setView(viewer._ViewTransform);
    viewer._ActorInstance?.draw(graphics);
  }

  private _ScheduleAdvance(viewer: SoloSlide) {
    clearTimeout(viewer._AdvanceTimeout);
    // if (document.hasFocus()) {
    window.requestAnimationFrame(() => {
      this._Advance(viewer);
    });
    /*else
    {
        viewer._AdvanceTimeout = setTimeout(function()
            {
                _Advance(viewer);
            }, _LowFrequencyAdvanceTime);
    }*/
  }

  public load(url: string, callback: (error?: any) => void) {
    const loader = new ActorLoader();
    const _This = this;
    loader.load(url, (actor: any /* Nima.Actor ? */ | null) => {
      if (!actor || actor.error) {
        callback(!actor ? null : actor.error);
      } else {
        _This.setActor(actor);
        callback();
      }
    });
  }

  public setActor(actor: any /* Nima.Actor ? */) {
    if (this._Actor) {
      this._Actor.dispose(this._Graphics);
    }
    if (this._ActorInstance) {
      this._ActorInstance.dispose(this._Graphics);
    }
    actor.initialize(this._Graphics);

    const actorInstance = actor.makeInstance();
    actorInstance.initialize(this._Graphics);

    this._Actor = actor;
    this._ActorInstance = actorInstance;

    if (actorInstance) {
      actorInstance.initialize(this._Graphics);
      if (actorInstance._Animations.length) {
        this._SlideAnimation = actorInstance._Animations[0];
        this._AnimationInstance = new AnimationInstance(
          this._SlideAnimation._Actor,
          this._SlideAnimation
        );

        if (!this._AnimationInstance) {
          console.log("NO ANIMATION IN HERE!?");
          return;
        }
      }
    }
  }
}

// Define constants outside the class.
const _ViewCenter = [0.0, 2000.0];
const _Scale = 0.2;
