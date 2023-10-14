export default class ActorComponent {
    _Name: string;
    _Parent: any;
    _CustomProperties: any[];
    _DirtMask: number;
    _GraphOrder: number;
    _Dependents: any;
    _Actor: any;
    _ParentIdx: number;
    get parent(): any;
    onDirty(dirt: any): void;
    initialize(actor: any, graphics: any): void;
    update(dirt: any): void;
    advance(seconds: any): void;
    resolveComponentIndices(components: any): void;
    completeResolve(): void;
    copy(component: any, resetActor: any): void;
    _Idx: any;
    getCustomProperty(name: any): any;
}
