/// <reference types="gl-matrix/index.js" />
export default class JellyComponent extends ActorComponent {
    _EaseIn: number;
    _EaseOut: number;
    _ScaleIn: number;
    _ScaleOut: number;
    _InTargetIdx: number;
    _OutTargetIdx: number;
    _InTarget: any;
    _OutTarget: any;
    _Bones: any[];
    _InPoint: vec2;
    _InDirection: vec2;
    _OutPoint: vec2;
    _OutDirection: vec2;
    makeInstance(resetActor: any): JellyComponent;
    updateJellies(): void;
    _Cache: {
        tip: vec2;
        out: vec2;
        in: vec2;
        sin: number;
        sout: number;
    };
    get tipPosition(): vec2;
}
import ActorComponent from "./ActorComponent.js";
import { vec2 } from "gl-matrix";
