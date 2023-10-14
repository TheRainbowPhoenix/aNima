export default class ActorColliderRectangle extends ActorCollider {
    _Width: number;
    _Height: number;
    get width(): number;
    get height(): number;
    makeInstance(resetActor: any): ActorColliderRectangle;
}
import ActorCollider from "./ActorCollider.js";
