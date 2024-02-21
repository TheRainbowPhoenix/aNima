export default class ActorConstraint extends ActorComponent {
    _IsEnabled: boolean;
    _Strength: number;
    makeInstance(resetActor: any): ActorConstraint;
    markDirty(): void;
    set strength(arg: any);
    set isEnabled(arg: boolean);
    get isEnabled(): boolean;
}
import ActorComponent from "./ActorComponent.js";
