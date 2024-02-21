export default class ActorScaleConstraint extends ActorAxisConstraint {
    _ComponentsA: Float32Array;
    _ComponentsB: Float32Array;
    makeInstance(resetActor: any): ActorScaleConstraint;
    constrain(tip: any): void;
}
import ActorAxisConstraint from "./ActorAxisConstraint.js";
