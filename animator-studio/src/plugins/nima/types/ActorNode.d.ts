/// <reference types="gl-matrix/index.js" />
export default class ActorNode extends ActorComponent {
    _Children: any[];
    _Transform: mat2d;
    _WorldTransform: mat2d;
    _OverrideWorldTransform: boolean;
    _Constraints: any;
    _PeerConstraints: any[];
    _Translation: vec2;
    _Rotation: number;
    _Scale: vec2;
    _Opacity: number;
    _RenderOpacity: number;
    _IsCollapsedVisibility: boolean;
    _RenderCollapsed: boolean;
    get constraints(): any;
    get allConstraints(): any;
    addConstraint(constraint: any): boolean;
    addPeerConstraint(constraint: any): void;
    markTransformDirty(): void;
    updateWorldTransform(): void;
    get isNode(): boolean;
    set translation(arg: vec2);
    get translation(): vec2;
    set scale(arg: vec2);
    get scale(): vec2;
    set x(arg: number);
    get x(): number;
    set y(arg: number);
    get y(): number;
    set scaleX(arg: number);
    get scaleX(): number;
    set scaleY(arg: number);
    get scaleY(): number;
    set rotation(arg: number);
    get rotation(): number;
    set opacity(arg: number);
    get opacity(): number;
    getWorldTransform(): mat2d;
    get transform(): mat2d;
    get worldTransform(): mat2d;
    get worldTranslation(): vec2;
    setCollapsedVisibility(v: any): void;
    makeInstance(resetActor: any): ActorNode;
    overrideWorldTransform(transform: any): void;
}
import ActorComponent from "./ActorComponent.js";
import { mat2d } from "gl-matrix";
import { vec2 } from "gl-matrix";