export default class ActorTargetedConstraint extends ActorConstraint {
    _TargetIdx: number;
    _Target: any;
    makeInstance(resetActor: any): ActorTargetedConstraint;
}
import ActorConstraint from "./ActorConstraint.js";
