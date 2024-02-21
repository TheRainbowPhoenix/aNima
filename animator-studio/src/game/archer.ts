import {
  ActorLoader,
  AnimationInstance,
  Graphics,
} from "../plugins/anima/Nima";
import { mat2d, vec2 } from "gl-matrix";

export default class Archer {
  public _ViewCenter = [0.0, 100.0];
  public _Scale = 0.4;
  public _ScreenScale = 1.0;

  public _ScreenMouse = vec2.create();
  public _WorldMouse = vec2.create();
  public _FireNext = false;
  public _JumpNext = false;

  public _AimLookup: any[] = new Array(360);
  public _AimWalkingLookup: any[] = new Array(360);
  public _Actor: any;
  private _ActorInstance: any; // Nima.ActorInstance | null;

  private _MaxBoostSpeed: number = 1000.0;
  private _BoostForce: number = 6000.0;
  private _GravityForce: number = -3000.0;
  private _JumpForce: number = 50000.0;
  private _JumpForceTime: number = 0.3;
  private _JumpDelay: number = 0.2;

  private _Graphics: any;
  private _LastAdvanceTime: number;
  private _ViewTransform: any;
  private _AimAnimation: any;
  private _IdleAnimation: any;
  private _FireAnimation: any;
  private _ReloadAnimation: any;
  private _HorizontalSpeed: number = 0;
  private _Fast: boolean = false;
  private _JetSpeed: number = 0;
  private _WalkMix: number = 0;
  private _RunMix: number = 0;
  private _SoarMix: number = 0;
  private _FallMix: number = 0;
  private _AirTime: number = 0;

  private _BoostForward: any;
  private _BoostBackward: any;

  private _WalkAnimation: any;
  private _RunAnimation: any;
  private _SoarAnimation: any;
  private _FallAnimation: any;
  private _LandAnimation: any;
  private _JumpAnimation: any;

  private _WalkToIdle: any;

  private _JetOn: any;
  private _JetOff: any;

  private _GroundSpeedProperty: any;

  private _Y: number = 0.0;
  private _YVelocity: number = 0.0;
  private _OnGround: boolean = true;
  private _JumpEnergy: number = 0.0;
  private _BoostMix: number = 0.0;

  private _IdleTime: number = 0.0;
  private _RunTime: number = 0.0;
  private _SoarTime: number = 0.0;
  private _FallTime: number = 0.0;
  private _LandTime: number = 0.0;
  private _JumpTime: number = 0.0;
  private _JetOffTime: number = 0.0;
  private _JetOnTime: number = 0.0;
  private _AimTime: number = 0.0;
  private _FireTime: number = -1.0;
  private _ReloadTime: number = -1.0;
  private _WalkToIdleTime: number = 0.0;
  private _BoostForwardTime: number = 0.0;
  private _BoostBackwardTime: number = 0.0;
  private _ReloadMix: number = 0.0;
  private _IsReloadReceding: boolean = false;

  private _AdvanceTimeout: any;

  constructor(canvas: HTMLCanvasElement) {
    this._Graphics = new Graphics(canvas);
    this._LastAdvanceTime = Date.now();
    this._ViewTransform = mat2d.create();
    this._AimAnimation = null;
    this._IdleAnimation = null;
    this._FireAnimation = null;
    this._ReloadAnimation = null;
    this._HorizontalSpeed = 0;
    this._Fast = false;
    this._JetSpeed = 0;
    this._WalkMix = 0;
    this._RunMix = 0;
    this._SoarMix = 0;
    this._FallMix = 0;
    this._AirTime = 0;

    this._GroundSpeedProperty = null;

    this._Y = 0.0;
    this._YVelocity = 0.0;
    this._OnGround = true;
    this._JumpEnergy = 0.0;
    this._JumpDelay = 0.0;
    this._BoostMix = 0.0;

    this._IdleTime = 0.0;
    this._RunTime = 0.0;
    this._SoarTime = 0.0;
    this._FallTime = 0.0;
    this._LandTime = 0.0;
    this._JumpTime = 0.0;
    this._JetOffTime = 0.0;
    this._JetOnTime = 0.0;
    this._AimTime = 0.0;
    this._FireTime = -1.0;
    this._ReloadTime = -1.0;
    this._WalkToIdleTime = 0.0;
    this._BoostForwardTime = 0.0;
    this._BoostBackwardTime = 0.0;
    this._ReloadMix = 0.0;
    this._IsReloadReceding = false;

    var _This = this;

    this._ScheduleAdvance(_This);
    this._Advance(_This);

    document.addEventListener("keydown", (ev) => {
      switch (ev.keyCode) {
        case 32: // Enter
          this._JumpNext = true;
          break;
        case 16: // Shift
          this._Fast = true;
          break;
        case 68: // 'D'
        case 39: // right
          this._HorizontalSpeed = 1.0;
          break;
        case 65: // 'A'
        case 37: // left
          this._HorizontalSpeed = -1.0;
          break;
        case 87:
        case 38:
          this._JetSpeed = 1.0;
          break;
      }
    });

    document.addEventListener("keyup", (ev) => {
      switch (ev.keyCode) {
        case 16: // Shift
          this._Fast = false;
          break;
        case 68: // 'D'
        case 39: // right
          if (this._HorizontalSpeed === 1.0) {
            this._HorizontalSpeed = 0.0;
          }
          break;
        case 65: // 'A'
        case 37: // left
          if (this._HorizontalSpeed === -1.0) {
            this._HorizontalSpeed = 0.0;
          }
          break;
        case 87:
        case 38:
          this._JetSpeed = 0.0;
          break;
      }
    });

    document.addEventListener("mousemove", (ev) => {
      this._ScreenMouse[0] = ev.clientX;
      this._ScreenMouse[1] = ev.clientY;
    });

    document.addEventListener("mousedown", (ev) => {
      this._FireNext = true;
    });
  }

  public setSize(width: number, height: number) {
    this._Graphics.setSize(width, height);
  }

  private _Advance(_This: Archer) {
    this.setSize(window.innerWidth, window.innerHeight);

    const now = Date.now();
    const elapsed = (now - this._LastAdvanceTime) / 1000.0;
    this._LastAdvanceTime = now;

    const graphics = this._Graphics;

    const w = graphics.viewportWidth;
    const h = graphics.viewportHeight;

    this._ViewCenter[1] = 0.5 * h;

    const vt = this._ViewTransform;
    vt[0] = this._Scale;
    vt[3] = this._Scale;
    vt[4] = -this._ViewCenter[0] * this._Scale + w / 2;
    vt[5] = -this._ViewCenter[1] * this._Scale + h / 2;

    var inverseViewTransform = mat2d.invert(mat2d.create(), vt);

    this._WorldMouse[0] = this._ScreenMouse[0] * this._ScreenScale;
    this._WorldMouse[1] =
      graphics.viewportHeight - this._ScreenMouse[1] * this._ScreenScale;

    vec2.transformMat2d(
      this._WorldMouse,
      this._WorldMouse,
      inverseViewTransform
    );

    const actor = this._ActorInstance;

    if (actor) {
      var scaleX = 1.0;
      if (this._WorldMouse[0] < actor._RootNode._Translation[0]) {
        scaleX = -1.0;
      }

      //actor._RootNode.opacity = 0.15;

      if (actor._RootNode._Scale[0] != scaleX) {
        actor._RootNode._Scale[0] = scaleX;
        actor._RootNode._IsDirty = true;
        actor._RootNode.markTransformDirty();
      }

      if (this._IdleAnimation) {
        var ai = this._IdleAnimation;
        this._IdleTime =
          (this._IdleTime + elapsed) % this._IdleAnimation._Duration;
        this._IdleAnimation.apply(this._IdleTime, actor, 1.0);
      }

      var mixSpeed = 3.5;
      if (
        this._OnGround &&
        this._HorizontalSpeed !== 0 &&
        this._JetSpeed === 0
      ) {
        if (this._Fast) {
          if (this._WalkMix > 0.0) {
            this._WalkMix = Math.max(0.0, this._WalkMix - elapsed * mixSpeed);
          }
          if (this._RunMix < 1.0) {
            this._RunMix = Math.min(1.0, this._RunMix + elapsed * mixSpeed);
          }
        } else {
          if (this._WalkMix < 1.0) {
            this._WalkMix = Math.min(1.0, this._WalkMix + elapsed * mixSpeed);
          }
          if (this._RunMix > 0.0) {
            this._RunMix = Math.max(0.0, this._RunMix - elapsed * mixSpeed);
          }
        }

        this._WalkToIdleTime = 0;
      } else {
        if (this._WalkMix > 0.0) {
          this._WalkMix = Math.max(0.0, this._WalkMix - elapsed * mixSpeed);
        }
        if (this._RunMix > 0.0) {
          this._RunMix = Math.max(0.0, this._RunMix - elapsed * mixSpeed);
        }
      }

      if (this._JetSpeed > 0 && Math.abs(this._HorizontalSpeed) > 0.0) {
        this._BoostMix +=
          Math.sign(this._HorizontalSpeed) *
          scaleX *
          Math.min(1.0, elapsed * 10);
        this._BoostMix = Math.max(-1.0, Math.min(1.0, this._BoostMix));
      } else {
        if (this._BoostMix > 0) {
          this._BoostMix -= elapsed;
          if (this._BoostMix < 0) {
            this._BoostMix = 0;
            this._BoostForwardTime = 0.0;
            this._BoostBackwardTime = 0.0;
          }
        } else if (this._BoostMix < 0) {
          this._BoostMix += elapsed;
          if (this._BoostMix > 0) {
            this._BoostMix = 0;
            this._BoostForwardTime = 0.0;
            this._BoostBackwardTime = 0.0;
          }
        }
      }

      if (this._JetSpeed !== 0.0) {
        this._SoarMix = Math.min(1.0, this._SoarMix + elapsed * mixSpeed);
      } else {
        this._SoarMix = Math.max(0.0, this._SoarMix - elapsed * mixSpeed);
      }

      var moveSpeed = this._Fast ? 1100.0 : 600.0;

      var speedModifier =
        (this._Fast
          ? 1.0 - this._GroundSpeedProperty.value
          : this._GroundSpeedProperty.value) *
          0.5 +
        0.5;
      actor._RootNode._Translation[0] +=
        this._HorizontalSpeed *
        speedModifier *
        /*(0.5 + 0.5*moveMix) */ elapsed *
        moveSpeed;
      actor._RootNode._IsDirty = true;
      actor._RootNode.markTransformDirty();

      if (this._JumpNext) {
        this._JumpDelay = this._JumpDelay;
        this._JumpNext = false;
        if (this._AirTime < 0.2) {
          this._JumpTime = 0.0;
        }
      }

      if (this._JumpDelay) {
        this._JumpDelay -= elapsed;
        if (this._JumpDelay <= 0.0) {
          this._JumpDelay = 0.0;
          if (this._OnGround) {
            this._JumpEnergy = this._JumpForceTime;
          }
        }
      }

      {
        this._YVelocity += elapsed * this._BoostForce * this._JetSpeed;
        this._YVelocity += elapsed * this._GravityForce;

        if (this._JumpEnergy > 0) {
          this._YVelocity += this._JumpEnergy * elapsed * this._JumpForce;
          this._JumpEnergy -= elapsed;
        }

        if (this._YVelocity > this._MaxBoostSpeed) {
          this._YVelocity = this._MaxBoostSpeed;
        }
      }

      this._Y += this._YVelocity * elapsed;

      var lastYVelocity = this._YVelocity;
      if (this._Y < 0) {
        this._Y = 0.0;
        this._YVelocity = 0.0;
      }

      if (this._Y > 0) {
        this._OnGround = false;
        this._AirTime += elapsed;
      } else if (!this._OnGround) {
        this._AirTime = 0;
        this._OnGround = true;
        // We hit! Play land animation.
        if (lastYVelocity < -1500.0) {
          this._LandTime = 0.0;
        } else {
          this._WalkToIdleTime = 0.0;
        }
      }
      actor._RootNode._Translation[1] = this._Y;
      actor._RootNode._IsDirty = true;
      actor._RootNode.markTransformDirty();

      if (this._YVelocity < 0.0) {
        this._FallMix = Math.min(1.0, this._FallMix + elapsed * mixSpeed);
      } else {
        this._FallMix = Math.max(0.0, this._FallMix - elapsed * mixSpeed);
      }

      var walk = this._WalkAnimation;
      var run = this._RunAnimation;
      var soar = this._SoarAnimation;
      var fall = this._FallAnimation;
      if (
        (this._HorizontalSpeed === 0 || !this._OnGround) &&
        this._WalkMix === 0 &&
        this._RunMix === 0
      ) {
        walk.time = 0.0;
        this._RunTime = 0.0;
      } else {
        walk.advance(
          elapsed *
            0.9 *
            Math.sign(this._HorizontalSpeed) *
            scaleX *
            (this._Fast ? 1.2 : 1.0)
        );
        //this._WalkTime = (this._WalkTime + elapsed*0.9 * Math.sign(this._HorizontalSpeed) * scaleX)%walk._Duration;
        /*if(this._WalkTime < 0.0)
				{
					this._WalkTime += walk._Duration;
				}*/
        this._RunTime = (walk.time / walk._Animation._Duration) * run._Duration;
      }

      if (this._WalkMix != 0.0) {
        //walk.setTime(walk.getTime() + elapsed*0.9 * Math.sign(this._HorizontalSpeed) * scaleX);
        walk.apply(actor, this._WalkMix);
      }
      if (this._RunMix != 0.0) {
        //run.setTime(run.getTime() + elapsed*0.9 * Math.sign(this._HorizontalSpeed) * scaleX);
        run.apply(this._RunTime, actor, this._RunMix);
      }
      if (this._SoarMix != 0.0) {
        this._SoarTime = (this._SoarTime + elapsed) % soar._Duration;
        soar.apply(this._SoarTime, actor, this._SoarMix);
      }
      if (this._FallMix != 0.0) {
        this._FallTime = (this._FallTime + elapsed) % fall._Duration;
        fall.apply(this._FallTime, actor, this._FallMix);
      }

      if (this._BoostMix > 0.0) {
        this._BoostForwardTime += elapsed;
        this._BoostForward.apply(this._BoostForwardTime, actor, this._BoostMix);
      } else if (this._BoostMix < 0.0) {
        this._BoostBackwardTime += elapsed;
        this._BoostBackward.apply(
          this._BoostBackwardTime,
          actor,
          -this._BoostMix
        );
      }

      if (
        this._OnGround &&
        this._HorizontalSpeed === 0 &&
        this._WalkToIdleTime < this._WalkToIdle._Duration
      ) {
        this._WalkToIdleTime += elapsed;
        this._WalkToIdle.apply(
          this._WalkToIdleTime,
          actor,
          Math.min(1.0, this._WalkToIdleTime / this._WalkToIdle._Duration)
        );
        this._RunMix = this._WalkMix = 0.0;
      }

      if (this._LandTime < this._LandAnimation._Duration) {
        this._LandTime += elapsed;
        this._LandAnimation.apply(
          this._LandTime,
          actor,
          Math.min(1.0, this._LandTime / 0.15)
        );
      }
      if (this._JumpTime < this._JumpAnimation._Duration) {
        this._JumpTime += elapsed;
        this._JumpAnimation.apply(
          this._JumpTime,
          actor,
          Math.min(1.0, this._JumpTime / 0.15)
        );
      }

      if (this._JetSpeed) {
        this._JetOnTime += elapsed;
        this._JetOn.apply(
          this._JetOnTime,
          actor,
          Math.min(1.0, this._JetOnTime / 0.1)
        );
        this._JetOffTime = 0.0;
      } else {
        this._JetOffTime += elapsed;
        this._JetOff.apply(
          this._JetOffTime,
          actor,
          Math.min(1.0, this._JetOffTime / 0.1)
        );
        this._JetOnTime = 0.0;
      }

      if (this._AimAnimation) {
        var inverseToActor = mat2d.invert(
          mat2d.create(),
          actor._RootNode.getWorldTransform()
        );
        var actorMouse = vec2.transformMat2d(
          vec2.create(),
          this._WorldMouse,
          inverseToActor
        );
        // See where the mouse is relative to the tip of the weapon
        var maxDot = -1;
        var bestIndex = 0;
        var lookup =
          this._HorizontalSpeed === 0
            ? this._AimLookup
            : this._AimWalkingLookup;
        for (var i = 0; i < lookup.length; i++) {
          var aim: any[] = lookup[i];
          var aimDir = vec2.clone(aim[0]);
          var aimPos = vec2.clone(aim[1]);

          //aimPos[0] *= scaleX;
          //aimDir[0] *= scaleX;

          var targetDir = vec2.subtract(vec2.create(), actorMouse, aimPos);
          vec2.normalize(targetDir, targetDir);
          var d = vec2.dot(targetDir, aimDir);
          if (d > maxDot) {
            maxDot = d;
            bestIndex = i;
          }
        }

        var aimTime =
          (bestIndex / (lookup.length - 1)) * this._AimAnimation._Duration;
        this._AimTime += (aimTime - this._AimTime) * Math.min(1, elapsed * 10);
        this._AimAnimation.apply(this._AimTime, actor, 1.0);
      }

      if (this._FireNext) {
        this._FireTime = 0.0;
        this._FireNext = false;
      }
      if (this._FireTime >= 0.0) {
        this._FireTime += elapsed;
        this._FireAnimation.apply(this._FireTime, actor, 1.0);
        if (this._FireTime >= this._FireAnimation._Duration) {
          this._FireTime = -1;
          this._ReloadTime = 0.0;
          this._ReloadMix = 0.0;
          this._IsReloadReceding = false;
        }
      }
      if (this._ReloadTime >= 0.0) {
        var mixSpeed = 8.0;
        if (this._IsReloadReceding) {
          this._ReloadMix = Math.max(0.0, this._ReloadMix - elapsed * mixSpeed);
          if (this._ReloadMix <= 0.0) {
            this._ReloadTime = -1;
            this._IsReloadReceding = false;
          } else {
            this._ReloadAnimation.apply(
              this._ReloadTime,
              actor,
              this._ReloadMix
            );
          }
        } else {
          this._ReloadMix = Math.min(1.0, this._ReloadMix + elapsed * mixSpeed);
          this._ReloadTime += elapsed;
          if (this._ReloadTime >= this._ReloadAnimation._Duration) {
            this._IsReloadReceding = true;
          }
          this._ReloadAnimation.apply(this._ReloadTime, actor, this._ReloadMix);
        }
      }

      actor.advance(elapsed);
    }

    this._Draw(this, this._Graphics);
    this._ScheduleAdvance(this);
  }

  private _Draw(viewer: any, graphics: any) {
    if (!viewer._Actor) {
      return;
    }

    graphics.clear();
    graphics.setView(viewer._ViewTransform);

    let aabb = viewer._ActorInstance.computeAABB();

    let width = (aabb[2] - aabb[0]) * 0.5;
    let height = (aabb[3] - aabb[1]) * 0.5;

    if (!viewer.vb) {
      let v = [0, 0, 0, 0, 100, 0, 0, 0, 100, 100, 0, 0, 0, 100, 0, 0];
      let i = [0, 1, 2, 0, 2, 3];
      viewer.vb = graphics.makeVertexBuffer(v);
      viewer.ib = graphics.makeIndexBuffer(i);
    }
    let v = [
      aabb[0],
      aabb[1],
      0,
      0,
      aabb[2],
      aabb[1],
      0,
      0,
      aabb[2],
      aabb[3],
      0,
      0,
      aabb[0],
      aabb[3],
      0,
      0,
    ];
    viewer.vb.update(v);

    //graphics.disableBlending();
    //graphics.drawTextured(mat2d.create(), viewer.vb, viewer.ib, 1.0, [1.0, 1.0, 1.0, 1.0], viewer._ActorInstance._Atlases[0]);

    viewer._ActorInstance.draw(graphics);
  }

  private _ScheduleAdvance(viewer: Archer) {
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
        this.setActor(actor);
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

    var archer = this;
    this._ActorInstance.addEventListener("animationEvent", (event: any) => {
      switch (event.name) {
        case "Step":
          // Only play the step sound if the run or walk animation is mixed enough over a threshold.
          if (archer._WalkMix > 0.5 || archer._RunMix > 0.5) {
            let sound: HTMLAudioElement | null = document.getElementById(
              "sound"
            ) as HTMLAudioElement;
            if (sound) {
              sound.currentTime = 0;
              sound.play();
            }
          }
          break;
      }
    });

    if (actorInstance) {
      actorInstance.initialize(this._Graphics);
      if (actorInstance._Animations.length) {
        this._FireAnimation = actorInstance.getAnimation("Fire");
        this._ReloadAnimation = actorInstance.getAnimation("Reload");
        this._WalkToIdle = actorInstance.getAnimation("WalkToIdle");
        this._WalkAnimation = actorInstance.getAnimationInstance("Walk");
        this._RunAnimation = actorInstance.getAnimation("Run");
        this._IdleAnimation = actorInstance.getAnimation("Idle");
        this._JetOn = actorInstance.getAnimation("JetOn");
        this._JetOff = actorInstance.getAnimation("JetOff");
        this._SoarAnimation = actorInstance.getAnimation("Soar");
        this._FallAnimation = actorInstance.getAnimation("Fall");
        this._LandAnimation = actorInstance.getAnimation("Land");
        this._JumpAnimation = actorInstance.getAnimation("Jump");

        this._LandTime = this._LandAnimation._Duration;
        this._JumpTime = this._JumpAnimation._Duration;

        this._BoostForward = actorInstance.getAnimation("BoostForward");
        this._BoostBackward = actorInstance.getAnimation("BoostBackward");

        var aim = (this._AimAnimation = actorInstance.getAnimation("Aim2"));
        if (aim) {
          // Find arrow node.
          var arrowNode = actor.getNode("Muzzle");

          var character = actorInstance.getNode("Character");
          if (character) {
            this._GroundSpeedProperty =
              character.getCustomProperty("GroundSpeed");
          }

          // Build look up table.
          if (arrowNode) {
            for (var i = 0; i < this._AimLookup.length; i++) {
              var position = (i / (this._AimLookup.length - 1)) * aim._Duration;
              aim.apply(position, actor, 1.0);
              actor.update();
              var m = arrowNode.getWorldTransform();
              this._AimLookup[i] = [
                vec2.normalize(
                  vec2.create(),
                  vec2.set(vec2.create(), m[0], m[1])
                ),
                vec2.set(vec2.create(), m[4], m[5]),
              ];
            }

            // Apply first frame of walk to extract the aim while walking lookup.
            this._WalkAnimation.time = 0.0;
            this._WalkAnimation.apply(actor, 1.0);
            for (var i = 0; i < this._AimWalkingLookup.length; i++) {
              var position =
                (i / (this._AimWalkingLookup.length - 1)) * aim._Duration;
              aim.apply(position, actor, 1.0);
              actor.update();
              var m = arrowNode.getWorldTransform();
              this._AimWalkingLookup[i] = [
                vec2.normalize(
                  vec2.create(),
                  vec2.set(vec2.create(), m[0], m[1])
                ),
                vec2.set(vec2.create(), m[4], m[5]),
              ];
            }
          }

          this._JetOffTime = this._JetOff._Duration;
          this._JetOff.apply(this._JetOffTime, actor, 1.0);
        }
      }
    }
  }
}
