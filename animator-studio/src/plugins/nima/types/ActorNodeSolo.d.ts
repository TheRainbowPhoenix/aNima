export default class ActorNodeSolo extends ActorNode {
    _ActiveChildIndex: number;
    setActiveChildIndex(idx: any): void;
    set activeChildIndex(arg: number);
    get activeChildIndex(): number;
    makeInstance(resetActor: any): ActorNodeSolo;
}
import ActorNode from "./ActorNode.js";
