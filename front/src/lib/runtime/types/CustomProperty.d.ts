declare class CustomProperty extends ActorComponent {
    _PropertyType: any;
    _Value: number;
    get propertyType(): any;
    get value(): number;
    makeInstance(resetActor: any): CustomProperty;
}
declare namespace CustomProperty {
    namespace Type {
        let Integer: number;
        let Float: number;
        let String: number;
        let Boolean: number;
    }
}
export default CustomProperty;
import ActorComponent from "./ActorComponent.js";
