declare class ActorImage extends ActorNode {
    _DrawOrder: number;
    _BlendMode: number;
    _AtlasIndex: number;
    _NumVertices: number;
    _HasVertexDeformAnimation: boolean;
    _AnimationDeformedVertices: Float32Array;
    _Vertices: any;
    _Triangles: any;
    _ConnectedBones: any[];
    _BoneMatrices: Float32Array;
    _IsInstance: boolean;
    _IsHidden: boolean;
    _VertexBuffer: any;
    _IndexBuffer: any;
    _DeformVertexBuffer: any;
    _SequenceFrames: any;
    _SequenceFrame: number;
    _SequenceUVs: any;
    _SequenceUVBuffer: any;
    set isHidden(arg: boolean);
    get isHidden(): boolean;
    set hasVertexDeformAnimation(arg: boolean);
    get hasVertexDeformAnimation(): boolean;
    computeAABB(): Float32Array;
    computeWorldVertices(): Float32Array;
    dispose(actor: any, graphics: any): void;
    _Texture: any;
    advance(): void;
    _VerticesDirty: boolean;
    draw(graphics: any): void;
    makeInstance(resetActor: any): ActorImage;
    _VertexStride: any;
}
declare namespace ActorImage {
    namespace BlendModes {
        let Normal: number;
        let Multiply: number;
        let Screen: number;
        let Additive: number;
    }
}
export default ActorImage;
import ActorNode from "./ActorNode.js";
