export default class ActorColliderPolygon extends ActorCollider {
    _ContourVertices: Float32Array;
    get contourVertices(): Float32Array;
    makeInstance(resetActor: any): ActorColliderPolygon;
}
import ActorCollider from "./ActorCollider.js";
