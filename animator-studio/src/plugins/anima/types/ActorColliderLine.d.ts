export default class ActorColliderLine extends ActorCollider {
    _Vertices: Float32Array;
    get vertices(): Float32Array;
    makeInstance(resetActor: any): ActorColliderLine;
}
import ActorCollider from "./ActorCollider.js";
