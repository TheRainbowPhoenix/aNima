/// <reference types="gl-matrix/index.js" />
export default class ActorBoneBase extends ActorNode {
    _Length: number;
    _IsConnectedToImage: boolean;
    get tipWorldTranslation(): vec2;
    set length(arg: number);
    get length(): number;
    get firstBone(): ActorBoneBase;
}
import ActorNode from "./ActorNode.js";
import { vec2 } from "gl-matrix";
