export default class ActorAxisConstraint extends ActorTargetedConstraint {
    constructor(actor: any);
    _CopyX: boolean;
    _CopyY: boolean;
    _ScaleX: number;
    _ScaleY: number;
    _EnableMinX: boolean;
    _MinX: number;
    _EnableMaxX: boolean;
    _MaxX: number;
    _EnableMinY: boolean;
    _MinY: number;
    _EnableMaxY: boolean;
    _MaxY: number;
    _Offset: boolean;
    _SourceSpace: number;
    _DestSpace: number;
    _MinMaxSpace: number;
}
import ActorTargetedConstraint from "./ActorTargetedConstraint.js";
