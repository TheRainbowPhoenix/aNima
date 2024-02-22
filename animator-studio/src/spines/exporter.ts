import {
  MeshAttachment,
  PathConstraintSpacingTimeline,
} from "@esotericsoftware/spine-phaser";
import {
  BoundingBoxAttachment,
  ClippingAttachment,
  Color,
  RegionAttachment,
} from "../plugins/spine-core";

interface SpineSkeletonHeader {
  /** The skeleton's name, which by default is the name of the skeleton data file, if possible. May be null. */
  name?: string | null | undefined;

  /** The Spine version used to export the skeleton data, or null. */
  spine?: string | null;

  /** The X coordinate of the skeleton's axis aligned bounding box in the setup pose. */
  x: number;

  /** The Y coordinate of the skeleton's axis aligned bounding box in the setup pose. */
  y: number;

  /** The width of the skeleton's axis aligned bounding box in the setup pose. */
  width: number;

  /** The height of the skeleton's axis aligned bounding box in the setup pose. */
  height: number;

  /** The skeleton data hash. This value will change if any of the skeleton data has changed. May be null. */
  hash?: string | null;

  // Nonessential
  /** The dopesheet FPS in Spine. Available only when nonessential data was exported. */
  fps: number;

  /** The path to the images directory as defined in Spine. Available only when nonessential data was exported. May be null. */
  images?: string | null;

  /** The path to the audio directory as defined in Spine. Available only when nonessential data was exported. May be null. */
  audioPath?: string | null | undefined;
}

interface SpineIK {}
interface SpineTransform {}

interface SpineJSON {
  skeleton: SpineSkeletonHeader;
  bones: SpineBone[];
  slots: SpineSlot[];
  ik?: SpineIK[];
  transform?: SpineTransform[];
  path?: SpinePath[];
  skins: SpineSkin[];
  events: {};
  animations: {};
}

interface SpineBone {
  index?: number;

  /** The name of the bone, which is unique across all bones in the skeleton. */
  name?: string;

  /** @returns May be null. */
  parent?: string;

  /** The bone's length. */
  length?: number;

  /** The local x translation. */
  x?: number;

  /** The local y translation. */
  y?: number;

  /** The local rotation. */
  rotation?: number;

  /** The local scaleX. */
  scaleX?: number;

  /** The local scaleY. */
  scaleY?: number;

  /** The local shearX. */
  shearX?: number;

  /** The local shearX. */
  shearY?: number;

  transform?: string;

  skin?: boolean;

  color?: string;
}

interface SpineSlot {}
interface SpinePath {}

interface SkinAttachment {
  type?: string;
  width?: number;
  height?: number;
}

interface SpineSkin {
  name: string;
  attachments: Record<string, Record<string, SkinAttachment>>;
}

const TransformMode = [
  "normal",
  "onlyTranslation",
  "noRotationOrReflection",
  "noScale",
  "noScaleOrReflection",
];

const BlendMode = ["normal", "additive", "multiply", "screen"];

const PositionMode = ["fixed", "percent"];

const SpacingMode = ["length", "fixed", "percent", "proportional"];

const RotateMode = ["tangent", "chain", "chainScale"];

function toHex(color: Color): string {
  // Convert each channel value to its hexadecimal representation
  let r = Math.round(color.r * 255)
    .toString(16)
    .padStart(2, "0");
  let g = Math.round(color.g * 255)
    .toString(16)
    .padStart(2, "0");
  let b = Math.round(color.b * 255)
    .toString(16)
    .padStart(2, "0");
  let a = Math.round(color.a * 255)
    .toString(16)
    .padStart(2, "0");

  // Construct the hexadecimal color string
  return "" + r + g + b + a;
}

const isNDef = (v?: number, def: number = 1) =>
  v !== null && v !== undefined && v != def;
const isNCol = (v?: Color, d: Color = new Color(0, 0, 0, 0)) =>
  v && !(v.r === d.r && v.g === d.g && v.b === d.b && v.a === d.a);

const readSequence = (sequence: any) => {
  let out: any = {};

  if (isNDef(sequence.start, 1)) out.start = sequence.start;
  if (isNDef(sequence.digits, 0)) out.digits = sequence.digits;
  if (isNDef(sequence.setupIndex, 0)) out.setup = sequence.setupIndex;
  return out;
};

const roundFloats = (verticles: any) =>
  [...verticles].map((x) => Math.round(x * 10000) / 10000);

// const readVertices = () => {}

export const exportJSON = (g: SpineGameObject) => {
  const root: SpineJSON = {
    skeleton: {
      spine: "4.1.420",
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      fps: 0,
    },
    bones: [],
    slots: [],
    skins: [],
    events: {},
    animations: {},
  };

  // Header
  root.skeleton.hash = g.skeleton.data.hash;
  root.skeleton.spine = g.skeleton.data.version;
  root.skeleton.x = g.skeleton.data.x;
  root.skeleton.y = g.skeleton.data.y;
  root.skeleton.width = g.skeleton.data.width;
  root.skeleton.height = g.skeleton.data.height;
  root.skeleton.fps = g.skeleton.data.fps;
  root.skeleton.images = g.skeleton.data.imagesPath;

  // TODO: handle this ?
  // http://esotericsoftware.com/spine-loading-skeleton-data#Scaling
  let scale = g.skeleton.scaleX || 1; // TODO: unsure

  // Bones
  if (g.skeleton.data.bones) {
    root.bones = [];

    const defBoneColor = new Color(0, 0, 0, 0);

    for (let i = 0; i < g.skeleton.data.bones.length; i++) {
      let boneData = g.skeleton.data.bones[i];
      let boneMap: any = {};
      boneData.name && (boneMap.name = boneData.name);
      boneData.parent &&
        (boneMap.parent = boneData.parent ? boneData.parent.name : null);
      boneData.length && (boneMap.length = boneData.length / scale);
      boneData.x && (boneMap.x = boneData.x / scale);
      boneData.y && (boneMap.y = boneData.y / scale);
      boneData.rotation && (boneMap.rotation = boneData.rotation);

      isNDef(boneData.scaleX, 1) && (boneMap.scaleX = boneData.scaleX);
      isNDef(boneData.scaleY, 1) && (boneMap.scaleY = boneData.scaleY);
      isNDef(boneData.shearX, 0) && (boneMap.shearX = boneData.shearX);
      isNDef(boneData.shearY, 0) && (boneMap.shearY = boneData.shearY);

      boneData.transformMode > 0 &&
        (boneMap.transform = TransformMode[boneData.transformMode]);
      boneData.skinRequired && (boneMap.skin = boneData.skinRequired);
      isNCol(boneData.color, defBoneColor) &&
        (boneMap.color = toHex(boneData.color));

      root.bones.push(boneMap);
    }
  }

  // Slots
  if (g.skeleton.data.slots) {
    root.slots = [];

    const defSlotColor = new Color(1, 1, 1, 1);

    for (let i = 0; i < g.skeleton.data.slots.length; i++) {
      let slotData = g.skeleton.data.slots[i];
      let slotMap: any = {};
      slotData.name && (slotMap.name = slotData.name);
      slotData.boneData &&
        (slotMap.bone = slotData.boneData ? slotData.boneData.name : null);
      isNCol(slotData.color, defSlotColor) &&
        (slotMap.color = slotData.color ? toHex(slotData.color) : null);
      slotData.darkColor &&
        (slotMap.dark = slotData.darkColor ? toHex(slotData.darkColor) : null);
      slotData.attachmentName && (slotMap.attachment = slotData.attachmentName);
      slotData.blendMode > 0 && (slotMap.blend = BlendMode[slotData.blendMode]);

      root.slots.push(slotMap);
    }
  }

  // IK

  if (g.skeleton.data.ikConstraints) {
    root.ik = [];
    for (let i = 0; i < g.skeleton.data.ikConstraints.length; i++) {
      let ikData = g.skeleton.data.ikConstraints[i];
      let ikMap: any = {
        name: ikData.name,
        bones: ikData.bones.map((bone) => bone.name),
        target: ikData.target.name,
      };

      isNDef(ikData.order, 0) && (ikMap.order = ikData.order);
      ikData.skinRequired && (ikMap.skin = ikData.skinRequired);

      isNDef(ikData.mix, 1) && (ikMap.mix = ikData.mix);
      isNDef(ikData.softness, 0) && (ikMap.softness = ikData.softness / scale);
      isNDef(ikData.bendDirection, 1) && (ikMap.bendPositive = false);
      ikData.compress && (ikMap.compress = true);
      ikData.stretch && (ikMap.stretch = true);
      ikData.uniform && (ikMap.uniform = true);

      root.ik.push(ikMap);
    }
  }

  // Transform
  if (g.skeleton.data.transformConstraints) {
    root.transform = [];
    for (let i = 0; i < g.skeleton.data.transformConstraints.length; i++) {
      let tfData = g.skeleton.data.transformConstraints[i];
      let tfMap: SpineTransform | any = {
        name: tfData.name,
        bones: tfData.bones.map((bone) => bone.name),
        target: tfData.target.name,
      };

      if (tfData.order !== 0) tfMap.order = tfData.order;
      if (tfData.skinRequired !== false) tfMap.skin = tfData.skinRequired;
      if (tfData.local !== false) tfMap.local = tfData.local;
      if (tfData.relative !== false) tfMap.relative = tfData.relative;
      if (isNDef(tfData.offsetRotation, 0))
        tfMap.rotation = tfData.offsetRotation;
      if (isNDef(tfData.offsetX, 0)) tfMap.x = tfData.offsetX / scale;
      if (isNDef(tfData.offsetY, 0)) tfMap.y = tfData.offsetY / scale;
      if (isNDef(tfData.offsetScaleX, 0)) tfMap.scaleX = tfData.offsetScaleX;
      if (isNDef(tfData.offsetScaleY, 0)) tfMap.scaleY = tfData.offsetScaleY;
      if (isNDef(tfData.offsetShearY, 0)) tfMap.shearY = tfData.offsetShearY;
      // @ts-ignore
      if (isNDef(tfData.mixRotate, 1)) tfMap.mixRotate = tfData.mixRotate;
      // @ts-ignore
      if (isNDef(tfData.mixX, 1)) tfMap.mixX = tfData.mixX;
      // @ts-ignore
      if (isNDef(tfData.mixY, tfData.mixX)) tfMap.mixY = tfData.mixY;
      // @ts-ignore
      if (isNDef(tfData.mixScaleX, 1)) tfMap.mixScaleX = tfData.mixScaleX;
      // @ts-ignore
      if (isNDef(tfData.mixScaleY, tfData.mixScaleX))
        // @ts-ignore
        tfMap.mixScaleY = tfData.mixScaleY;
      // @ts-ignore
      if (isNDef(tfData.mixShearY, 1)) tfMap.mixShearY = tfData.mixShearY;

      root.transform.push(tfMap);
    }
  }

  // Paths

  if (g.skeleton.data.pathConstraints) {
    root.path = [];
    for (let i = 0; i < g.skeleton.data.pathConstraints.length; i++) {
      let ptData = g.skeleton.data.pathConstraints[i];
      let ptMap: SpineTransform | any = {
        name: ptData.name,
        bones: ptData.bones.map((bone) => bone.name),
        target: ptData.target.name,
      };

      if (ptData.order !== 0) ptMap.order = ptData.order;
      if (ptData.skinRequired !== false) ptMap.skin = ptData.skinRequired;

      ptData.positionMode !== 1 &&
        (ptMap.positionMode = PositionMode[ptData.positionMode]);
      ptData.spacingMode > 0 &&
        (ptMap.spacingMode = SpacingMode[ptData.spacingMode]);
      ptData.rotateMode > 0 &&
        (ptMap.rotateMode = RotateMode[ptData.rotateMode]);

      if (isNDef(ptData.offsetRotation, 0))
        ptMap.rotation = ptData.offsetRotation;
      if (isNDef(ptData.position, 0))
        ptMap.position =
          ptData.positionMode === 0 ? ptData.position / scale : ptData.position;
      if (isNDef(ptData.spacing, 0))
        ptMap.spacing =
          ptData.spacingMode === 0 || ptData.spacingMode === 1
            ? ptData.spacing / scale
            : ptData.spacing;
      // @ts-ignore
      if (isNDef(ptData.mixRotate, 1)) ptMap.mixRotate = ptData.mixRotate;
      // @ts-ignore
      if (isNDef(ptData.mixX, 1)) ptMap.mixX = ptData.mixX;
      // @ts-ignore
      if (isNDef(ptData.mixY, ptData.mixX)) ptMap.mixY = ptData.mixY;

      root.path.push(ptMap);
    }
  }

  // Skins

  if (g.skeleton.data.skins) {
    root.skins = [];
    for (let i = 0; i < g.skeleton.data.skins.length; i++) {
      let skinData = g.skeleton.data.skins[i];
      let skinMap: SpineSkin = {
        name: skinData.name,
        attachments: {},
      };

      // skinMap.bones = ["bone_name", "bone2_name"]
      // skinMap.ik = ["ik_name", "ik2_name"]
      // skinMap.transform = ["transform_name", "transform2_name"]
      // skinMap.path = ["path_name", "path2_name"]

      const defBoxColor = new Color(1, 1, 1, 1);

      // @ts-ignore
      for (const index of Object.values<number>(skinData._rebuild)) {
        try {
          if (index < g.skeleton.data.slots.length) {
            let slot = g.skeleton.data.slots[index];
            const name = slot.name;
            skinMap.attachments[name] = {};

            if (index < skinData.attachments.length) {
              const attached = skinData.attachments[index];

              for (const attachPair of Object.entries(attached)) {
                const attachElem = attachPair[1];
                const rebuildElem: Record<string, any> = {};

                if (attachElem) {
                  switch (attachElem.constructor.name) {
                    case "RegionAttachment":
                      const rg = attachElem as RegionAttachment;
                      // rebuildElem.type = "region";
                      if (isNDef(rg.x, 0)) rebuildElem.x = rg.x / scale;
                      if (isNDef(rg.y, 0)) rebuildElem.y = rg.y / scale;
                      if (isNDef(rg.scaleX, 1)) rebuildElem.scaleX = rg.scaleX;
                      if (isNDef(rg.scaleY, 1)) rebuildElem.scaleY = rg.scaleY;
                      if (isNDef(rg.rotation, 0))
                        rebuildElem.rotation = rg.rotation;
                      rebuildElem.width = rg.width / scale;
                      rebuildElem.height = rg.height / scale;

                      if (rg.sequence) {
                        rebuildElem.sequence = readSequence(rg.sequence);
                      }

                      break;
                    case "ClippingAttachment":
                      rebuildElem.type = "clipping";
                      const clp = attachElem as ClippingAttachment;
                      if (clp.endSlot) rebuildElem.end = clp.endSlot.name;
                      rebuildElem.vertexCount = clp.vertices.length >> 1;
                      if (isNCol(clp.color, defBoxColor)) {
                        rebuildElem.color = toHex(clp.color);
                      }
                      rebuildElem.vertices = roundFloats(clp.vertices);
                      break;
                    case "BoundingBoxAttachment":
                      rebuildElem.type = "boundingbox";
                      const bbx = attachElem as BoundingBoxAttachment;

                      if (bbx.name) attachElem.name = bbx.name;
                      if (isNCol(bbx.color, defBoxColor)) {
                        rebuildElem.color = toHex(bbx.color);
                      }
                      rebuildElem.vertexCount = bbx.vertices.length >> 1;
                      rebuildElem.vertices = roundFloats(bbx.vertices);

                      break;
                    case "MeshAttachment":
                      rebuildElem.type = "mesh"; // "linkedmesh"
                      const me = attachElem as MeshAttachment;

                      if (me.name !== me.path) {
                        rebuildElem.path = me.path;
                      }

                      if (me.sequence) {
                        rebuildElem.sequence = readSequence(me.sequence);
                      }
                      if (isNCol(me.color, defBoxColor)) {
                        rebuildElem.color = toHex(me.color);
                      }
                      if (isNDef(me.width, 0))
                        rebuildElem.width = me.width / scale;
                      if (isNDef(me.height, 0))
                        rebuildElem.height = me.height / scale;

                      // TODO: if in linkedMesh return / break in current state as LinkedMesh ??
                      if (me.vertices) {
                        if ((me as any)._base_vertices) {
                          rebuildElem.vertices = roundFloats(
                            (me as any)._base_vertices
                          );
                        } else {
                          rebuildElem.vertices = roundFloats(me.vertices);
                        }
                      }

                      if (me.regionUVs) rebuildElem.uvs = me.regionUVs;
                      if (me.triangles) rebuildElem.triangles = me.triangles;
                      if (me.edges) rebuildElem.edges = me.edges;
                      if (isNDef(me.hullLength, 0))
                        rebuildElem.hull = me.hullLength / 2;

                      break;
                    case "PathAttachment":
                      rebuildElem.type = "path";

                      break;
                    case "PointAttachment":
                      rebuildElem.type = "point";

                      break;
                  }
                }

                skinMap.attachments[name][attachPair[0]] = rebuildElem;
              }
            }
          }
        } catch (_) {}
      }

      root.skins.push(skinMap);
    }
  }

  console.log("=== READY FOR EXPORT ===");
  console.log(root);
  console.log(JSON.stringify(root));
};
