export default class ActorIKConstraint extends ActorTargetedConstraint {
    constructor(actor: any);
    _InvertDirection: boolean;
    _InfluencedBones: any[];
    _FKChain: any[];
    _BoneData: any[];
    makeInstance(resetActor: any): ActorIKConstraint;
    constrain(tip: any): void;
    solve1(fk1: any, worldTargetTranslation: any): boolean;
    solve2(fk1: any, fk2: any, worldTargetTranslation: any): boolean;
    solve(worldTargetTranslation: any, strength: any): void;
}
import ActorTargetedConstraint from "./ActorTargetedConstraint.js";
