export default class ActorTransformConstraint extends ActorTargetedConstraint {
    constructor(actor: any);
    _SourceSpace: number;
    _DestSpace: number;
    _ComponentsA: Float32Array;
    _ComponentsB: Float32Array;
    makeInstance(resetActor: any): ActorTransformConstraint;
    constrain(tip: any): void;
}
import ActorTargetedConstraint from "./ActorTargetedConstraint.js";
