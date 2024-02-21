export default class ActorRotationConstraint extends ActorTargetedConstraint {
    constructor(actor: any);
    _Copy: boolean;
    _EnableMin: boolean;
    _EnableMax: boolean;
    _Offset: boolean;
    _Min: number;
    _Max: number;
    _Scale: number;
    _SourceSpace: number;
    _DestSpace: number;
    _MinMaxSpace: number;
    _ComponentsA: Float32Array;
    _ComponentsB: Float32Array;
    makeInstance(resetActor: any): ActorRotationConstraint;
    constrain(tip: any): void;
}
import ActorTargetedConstraint from "./ActorTargetedConstraint.js";
