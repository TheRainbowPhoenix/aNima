export default class ActorDistanceConstraint extends ActorTargetedConstraint {
    constructor(actor: any);
    _Distance: number;
    _Mode: number;
    makeInstance(resetActor: any): ActorDistanceConstraint;
    set distance(arg: number);
    get distance(): number;
    set mode(arg: number);
    get mode(): number;
    constrain(tip: any): boolean;
}
import ActorTargetedConstraint from "./ActorTargetedConstraint.js";
