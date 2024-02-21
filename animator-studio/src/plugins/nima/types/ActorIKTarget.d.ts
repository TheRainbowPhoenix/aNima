export default class ActorIKTarget extends ActorNode {
    _Order: number;
    _Strength: number;
    _InvertDirection: boolean;
    _InfluencedBones: any[];
    _Constraint: ActorIKConstraint;
    set strength(arg: any);
    get strength(): any;
    makeInstance(resetActor: any): ActorIKTarget;
}
import ActorNode from "./ActorNode.js";
import ActorIKConstraint from "./ActorIKConstraint.js";
