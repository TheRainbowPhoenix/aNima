declare class KeyFrame {
    _Value: number;
    _Time: number;
    _Type: number;
    _InFactor: number;
    _InValue: number;
    _OutFactor: number;
    _OutValue: number;
    _Curve: BezierAnimationCurve;
    setNext(nxt: any): void;
    _TmpBuffer: Float32Array;
    interpolate: ((t: any, nxt: any) => Float32Array) | ((t: any, nxt: any) => number) | ((t: any, nxt: any) => any);
    interpolateVertexBuffer(t: any, nxt: any): Float32Array;
    interpolateHold(t: any, nxt: any): number;
    interpolateCurve(t: any, nxt: any): any;
    interpolateLinear(t: any, nxt: any): number;
}
declare namespace KeyFrame {
    namespace Type {
        let Hold: number;
        let Linear: number;
        let Mirrored: number;
        let Asymmetric: number;
        let Disconnected: number;
        let Progression: number;
    }
}
export default KeyFrame;
import BezierAnimationCurve from "./BezierAnimationCurve.js";
