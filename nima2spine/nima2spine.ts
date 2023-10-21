const text = await Deno.readTextFile("./awoo-spin.json");

const nima = JSON.parse(text);

function writeJson(path: string, data: object): string {
  try {
    Deno.writeTextFileSync(path, JSON.stringify(data));

    return "Written to " + path;
  } catch (e) {
    return e.message;
  }
}

function formatAtlasItem(atlasItem: AtlasType): string {
  const { name, size, format, filter, repeat, children } = atlasItem;
  const formattedFilter = filter.join(",");
  const formattedChildren = children
    .map((child) => `${child.name}\n\t  bounds: ${child.bounds.join(", ")}`)
    .join("\n");

  return `${name}\n\tsize: ${size[0]}, ${size[1]}\n\tformat: ${format}\n\tfilter: ${formattedFilter}\n\trepeat: ${repeat}\n${formattedChildren}`;
}

function writeAtlas(path: string, atlas: AtlasType[]): string {
  try {
    let data = "";

    atlas.forEach((atlasItem, index) => {
      data += formatAtlasItem(atlasItem);

      // Add a newline between items, except for the last one
      if (index < atlas.length - 1) {
        data += "\n\n";
      }
    });

    Deno.writeTextFileSync(path, data);

    return "Written to " + path;
  } catch (e) {
    return e.message;
  }
}

const rounded = (n: number) => Math.round(n * 100) / 100;

/**
 * Nima Interface
 */

const KeyFrame_Type = {
  Hold: 0,
  Linear: 1,
  Mirrored: 2,
  Asymmetric: 3,
  Disconnected: 4,
  Progression: 5,
};

interface FrameRotationKey {
  t: number /* Time start */;
  v: number /* value */;
  i: number /* type => KeyFrame_Type */;
  if: number /* inFactor */;
  iv: number /* inValue */;
  of: number /* outFactor */;
  ov: number /* outValue */;
}

interface NimaAnimationNode {
  frameRotation: FrameRotationKey[];
}

/**
 * Spine Interface
 */

class SkeletonData {
  /** The width of the skeleton's axis aligned bounding box in the setup pose. */
  width: number = 0;

  /** The height of the skeleton's axis aligned bounding box in the setup pose. */
  height: number = 0;

  /** The skeleton's name, which by default is the name of the skeleton data file, if possible. May be null. */
  name: string | null = null;

  /** The Spine version used to export the skeleton data, or null. */
  version?: string | null = null;

  /** The skeleton data hash. This value will change if any of the skeleton data has changed. May be null. */
  hash: string | null = null;

  //nonessential
  fps: number = 0;

  images?: string | null = null;
}

class SlotData {
  /** The name of the slot, which is unique across all slots in the skeleton. */
  name: string;

  /** The bone this slot belongs to. */
  bone: string;

  /** The name of the attachment that is visible for this slot in the setup pose, or null if no attachment is visible. */
  attachment: string | null = null;
}

class BoneData {
  /** The index of the bone in {@link Skeleton#getBones()}. */
  index?: number = 0;

  /** The name of the bone, which is unique across all bones in the skeleton. */
  name: string;

  /** @returns May be null. */
  parent?: string | null = null;

  /** The bone's length. */
  length?: number = 0;

  /** The local x translation. */
  x?: number = 0;

  /** The local y translation. */
  y?: number = 0;

  /** The local rotation. */
  rotation?: number = 0;

  /** The local scaleX. */
  scaleX?: number = 1;

  /** The local scaleY. */
  scaleY?: number = 1;

  /** The local shearX. */
  shearX?: number = 0;

  /** The local shearX. */
  shearY?: number = 0;
}

type SkinData = {
  [name: string]: {
    [fileName: string]: {
      name?: string;
      x: number;
      y: number;
      rotation: number;
      width: number;
      height: number;
    };
  };
};

interface Skin {
  name: string;
  attachments: SkinData;
}

interface InterpolationKey {
  time?: number | null;
  x?: number | null;
  y?: number | null;
  angle?: number | null;
  curve?: number | string | number[] | null;
  value?: number | string | null;
  c2?: number | null;
  c3?: number | null;
  c4?: number | null;
}

interface SlotInterpolationKey {
  time?: number | null;
  name?: string | null;
}

interface BoneAnimation {
  rotate?: InterpolationKey[];
  scale?: InterpolationKey[];
  translate?: InterpolationKey[];
}

interface SlotAnimation {
  attachment: any[];
}

interface SpineAnimation {
  slots?: { [slotName: string]: SlotAnimation } | undefined;
  bones?: { [boneName: string]: BoneAnimation } | undefined;
  deform?: { [skinName: string]: any } | undefined;
  ik?: { [ikName: string]: any } | undefined;
}

interface Spine {
  skeleton: SkeletonData;
  bones: Array<BoneData>;
  slots: Array<SlotData>;
  skins: Array<Skin>;
  animations: {
    [animationName: string]: SpineAnimation;
  };
}

interface AtlasType {
  name: string;
  size: [number, number];
  format: string;
  filter: [string, string];
  repeat: string;
  children: { name: string; bounds: [number, number, number, number] }[];
}

let atlas: AtlasType[] = [];

let spine: Spine = {
  skeleton: {
    width: 1000,
    height: 1000,
    fps: 24,
    hash: " ",
    name: "purpur",
    images: "./assets/",
  },
  bones: [],
  slots: [],
  skins: [
    {
      name: "default",
      attachments: {},
    },
  ],
  animations: {},
};

let nameCache: string[] = [];
let nameCounter = 0;

let idToName: { [id: string]: string } = {};

// console.log(nima);

const parseChild = (parentName: string, elem: any) => {
  //   console.log(elem);

  let ret = {};

  let name = elem?.name;

  if (nameCache.includes(name)) {
    name = elem?.name + "_" + elem?.id;
  }

  while (nameCache.includes(name)) {
    name = elem?.name + "_" + nameCounter;
    nameCounter++;
  }

  if (elem.type === "bone") {
    let pl = Math.round(elem.length);
    spine.bones.push({
      name: name || "Bone #0",
      length: pl,
      rotation: rounded(elem.rotation),
      x: rounded(elem?.translation?.[0] || 0),
      y: rounded(elem?.translation?.[1] || 0),
      parent: parentName || "root",
    });
    nameCache.push(name);

    idToName[elem.id] = name;
  } else if (elem.type === "rootBone") {
    spine.bones.push({
      name: name || "Root Bone #0",
      x: rounded(elem?.translation?.[0] || 0),
      y: rounded(elem?.translation?.[1] || 0),
      parent: parentName,
    });
    nameCache.push(name);
  } else if (elem.type === "image") {
    spine.slots.push({
      name: name || "Image #0",
      bone: parentName,
      attachment: elem?.asset,
    });

    let asset = elem?.asset;

    let width = elem?.width || 0;
    let height = elem?.height || 0;

    let skin = {
      [asset]: {
        // name: "assets/" + asset + ".png",
        x: rounded(elem?.translation?.[0] || 0),
        y: rounded(elem?.translation?.[1] || 0),
        rotation: rounded(elem?.rotation || 0),
        width,
        height,
      },
    };
    spine.skins[0].attachments[name] = skin;

    /*

assets/local-171.png
    size: 872, 1234
    format: RGBA8888
    filter: Linear,Linear
    repeat: none
local-171
    bounds: 0, 0, 872, 1234
    
    */
    atlas.push({
      name: "assets/" + asset + ".png",
      size: [width, height],
      format: "RGBA8888",
      filter: ["Linear", "Linear"],
      repeat: "none",
      children: [
        {
          name: asset,
          bounds: [0, 0, width, height],
        },
      ],
    });
  }

  if (elem.children) {
    for (const child of elem.children) {
      parseChild(name, child);
    }
  }

  return ret;
};

if (nima.root) {
  spine.bones.push({
    name: "root",
  });
  nameCache.push("root");

  if (nima.root.children) {
    for (const pChild of nima.root.children) {
      parseChild("root", pChild);

      //   if (pChild.type === "rootBone") {
      //     // Parent root bone
      //     if (pChild.translation) {
      //       let name = pChild?.name || "Root Bone #0";
      //       spine.bones.push({
      //         name,
      //         x: rounded(pChild?.translation?.[0] || 0),
      //         y: rounded(pChild?.translation?.[1] || 0),
      //         parent: "root",
      //       });
      //       nameCache.push(name);

      //       for (const child of pChild.children) {
      //         console.log(parseChild(pChild.name, child));
      //       }
      //     }
      //   }
    }
  }
}

if (nima.animations) {
  console.log(idToName);
  for (const anim of nima.animations) {
    let spineAnim: SpineAnimation = {};

    if (anim.nodes) {
      spineAnim.bones = {};

      for (const [id, _node] of Object.entries(anim.nodes)) {
        if (!idToName[id]) {
          console.warn("Unknown ID : ", id);
        }

        const node = _node as NimaAnimationNode;

        let nodeName = idToName[id] || "root";
        spineAnim.bones[nodeName] = {};

        console.log(nodeName);

        if (node?.frameRotation) {
          let rotations: InterpolationKey[] = [];

          for (const frame of node?.frameRotation) {
            rotations.push({
              time: rounded(frame.t),
              angle: rounded((frame.v * 180) / Math.PI),
            });
          }

          spineAnim.bones[nodeName].rotate = rotations;
        }
      }
    }

    spine.animations[anim.name] = spineAnim;
  }
}

// console.log(spine);

console.log(writeJson("./spine_out.json", spine));
console.log(writeAtlas("./spine_out.atlas", atlas));
