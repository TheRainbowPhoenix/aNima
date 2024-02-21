export default class ActorColliderTriangle extends ActorCollider {
    _Width: number;
    _Height: number;
    get width(): number;
    get height(): number;
    makeInstance(resetActor: any): ActorColliderTriangle;
}
import ActorCollider from "./ActorCollider.js";
