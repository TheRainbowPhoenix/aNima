export default class ActorColliderCircle extends ActorCollider {
    _Radius: number;
    get radius(): number;
    makeInstance(resetActor: any): ActorColliderCircle;
}
import ActorCollider from "./ActorCollider.js";
