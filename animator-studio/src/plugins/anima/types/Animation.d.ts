export default class Animation {
    constructor(actor: any);
    _Actor: any;
    _Components: any[];
    _TriggerComponents: any[];
    _Name: any;
    _FPS: number;
    _Duration: number;
    _Loop: boolean;
    get loop(): boolean;
    get duration(): number;
    triggerEvents(actorComponents: any, fromTime: any, toTime: any, triggered: any): void;
    apply(time: any, actor: any, mix: any): void;
}
