import {
  ActorLoader,
  AnimationInstance,
  Graphics as Graphics,
} from "$lib/runtime/Nima";
import { mat2d, vec2 } from "gl-matrix";

export default class Proto {
  public _ViewCenter = [0.0, 2000.0];
  public _Scale = 0.6;
  public _ScreenScale = 1.0;
  public _ScreenMouse = vec2.create();
  public _WorldMouse = vec2.create();

  private _Graphics: any; // Nima.Graphics;
  private _LastAdvanceTime: number;
  private _ViewTransform: mat2d;
  private _Actor: any; // Nima.Actor | null;
  private _ActorInstance: any; // Nima.ActorInstance | null;
  private _AnimationInstance: any; // Nima.AnimationInstance | null;

  private _TamedAnimation: any = null; // Nima.Animation | null;
  private _AttakedAnimation: any = null; // Nima.Animation | null;
  private _FearAnimation: any = null; // Nima.Animation | null;
  private _PreAnimation: any = null; // Nima.Animation | null;
  private _IdleAnimation: any = null; // Nima.Animation | null;

  private _AdvanceTimeout: any;

  private _ShallFear: boolean = false;
  private _Attacked: boolean = false;
  private _AttackedTime: number = 0;
  private _AttackedCount: number = 0;
  private _Tamed: boolean = false;
  private _TamedTime: number = 0;

  private _HitBox: HTMLDivElement | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this._Graphics = new Graphics(canvas);
    this._LastAdvanceTime = Date.now();
    this._ViewTransform = mat2d.create();
    this._ActorInstance = null;
    this._AnimationInstance = null;

    // this.setSize(window.innerWidth, window.innerHeight);

    const _This = this;

    this._ScheduleAdvance(_This);
    this._Advance(_This);

    this._HitBox = document.querySelector(".hitBox");

    if (this._HitBox) {
      this._HitBox.addEventListener("mouseenter", (ev) => {
        if (!this._ShallFear) {
          this._ShallFear = true;
          console.log("set _ShallFear to true");
        }
      });

      this._HitBox.addEventListener("mouseleave", (ev) => {
        if (this._ShallFear) {
          this._ShallFear = false;
          console.log("set _ShallFear to false");
        }
      });

      this._HitBox.addEventListener("click", (ev) => {
        if (!this._Attacked) {
          this._Attacked = true;
          console.log("got event _Attacked");
        }
      });
    }

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

  private _Advance(_This: Proto) {
    this.setSize(window.innerWidth, window.innerHeight);

    const now = Date.now();
    const elapsed = (now - this._LastAdvanceTime) / 1000.0;
    this._LastAdvanceTime = now;

    const actor = this._ActorInstance;

    if (actor) {
      const graphics = this._Graphics;

      const w = graphics.viewportWidth;
      const h = graphics.viewportHeight;

      const vt = this._ViewTransform;
      vt[0] = _Scale;
      vt[3] = _Scale;
      vt[4] = -_ViewCenter[0] * _Scale + w / 2;
      vt[5] = -_ViewCenter[1] * _Scale + h / 2;

      let now = new Date().getTime();

      // if (this._AttackedTime != 0) {
      //   console.log(this._AttackedTime, now, this._AttakedAnimation._Duration);
      // }

      if (this._Attacked) {
        this._Attacked = false;
        this._AttackedCount += 1;
        this._AttackedTime = now;
        this._AnimationInstance = this._AttakedAnimation;
      } else if (
        this._AttackedTime > 0 &&
        this._AttackedTime + this._AttakedAnimation._Duration * 1000 > now
      ) {
        this._AnimationInstance = this._AttakedAnimation;
      } else {
        if (this._AnimationInstance === null) {
          this._AnimationInstance = this._IdleAnimation;
        }

        if (this._AttackedCount > 10) {
          console.log("!!! Tamed !!!");
          this._AttackedCount = 0;
          this._Tamed = true;
          this._TamedTime = now;
          this._AnimationInstance = this._TamedAnimation;
        }

        if (
          this._AnimationInstance !== this._IdleAnimation &&
          !this._ShallFear
        ) {
          // reset to normal
          this._AnimationInstance = this._IdleAnimation;
        }

        if (
          this._ShallFear &&
          this._AnimationInstance !== this._FearAnimation
        ) {
          this._AnimationInstance = this._FearAnimation;
        }
      }

      if (this._Tamed) {
        if (this._TamedTime + this._TamedAnimation._Duration * 1000 > now) {
          this._AnimationInstance = this._TamedAnimation;
        } else {
          this._Tamed = false;
        }
      }

      if (this._AnimationInstance) {
        const ai = this._AnimationInstance;
        ai.time = (ai.time || 0) + elapsed;
        let time = ai.time % this._AnimationInstance._Duration;
        ai.apply(time, actor, 1.0);
      }

      // if (this._IdleAnimation) {
      //   var ai = this._IdleAnimation;
      //   this._IdleTime =
      //     (this._IdleTime + elapsed) % this._IdleAnimation._Duration;
      //   this._IdleAnimation.apply(this._IdleTime, actor, 1.0);
      // }

      actor.advance(elapsed);
    }

    this._Draw(this, this._Graphics);
    this._ScheduleAdvance(this);
  }

  private _Draw(viewer: Proto, graphics: any) {
    if (!viewer._Actor) {
      return;
    }

    graphics.clear();
    graphics.setView(viewer._ViewTransform);
    viewer._ActorInstance?.draw(graphics);
  }

  private _ScheduleAdvance(viewer: Proto) {
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

    this._ActorInstance.addEventListener("animationEvent", (event: any) => {
      console.log("animationEvent", event);
    });

    if (actorInstance) {
      actorInstance.initialize(this._Graphics);
      if (actorInstance._Animations.length) {
        console.log(actorInstance._Animations);

        this._TamedAnimation = actorInstance.getAnimation("Tamed");
        this._AttakedAnimation = actorInstance.getAnimation("Attaked");
        this._FearAnimation = actorInstance.getAnimation("Fear");
        this._PreAnimation = actorInstance.getAnimation("Pre");
        this._IdleAnimation = actorInstance.getAnimation("Idle");

        // this._IdleAnimation.time = 0.0;
        // this._IdleAnimation.apply(0.0, actor, 1.0);
        // actor.update();

        if (!this._AnimationInstance) {
          console.log("NO ANIMATION IN HERE!?");
          return;
        }
      }
    }
  }
}

// Define constants outside the class.
const _ViewCenter = [0.0, 150.0];
const _Scale = 0.8;
