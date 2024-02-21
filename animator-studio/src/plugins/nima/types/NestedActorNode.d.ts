export default class NestedActorNode extends ActorNode {
    _DrawOrder: number;
    _Asset: any;
    _Instance: any;
    makeInstance(resetActor: any): NestedActorNode;
    computeAABB(): any;
    draw(graphics: any): void;
}
import ActorNode from "./ActorNode.js";
