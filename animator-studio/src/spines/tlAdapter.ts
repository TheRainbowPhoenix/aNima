import { types } from "@theatre/core";
import { get } from "svelte/store";
import { SpineGameObject } from "../plugins/spine-phaser41";
import { currentProject } from "../studio";

export const wrap = (sheetName: string, sgo: SpineGameObject) => {
  let tlPrj = get(currentProject);
  let tlHasumi = tlPrj.sheet(sheetName);

  console.log(sgo);
  //   sgo.skeleton.getRootBone()
  for (const bone of sgo.skeleton.bones) {
    const props = {
      rotation: types.number(bone.rotation, { range: [-360, 360] }),
      translate: types.compound({
        x: types.number(bone.x),
        y: types.number(bone.y),
      }),
      scale: types.compound({
        x: types.number(bone.scaleX),
        y: types.number(bone.scaleY),
      }),
      shear: types.compound({
        x: types.number(bone.shearX),
        y: types.number(bone.shearY),
      }),
    };

    const obj = tlHasumi.object("Spine / Bones / " + bone.data.name, props);

    obj.onValuesChange((obj) => {
      bone.rotation = obj.rotation;
      bone.x = obj.translate.x;
      bone.y = obj.translate.y;
      bone.scaleX = obj.scale.x;
      bone.scaleY = obj.scale.y;
      bone.shearX = obj.shear.x;
      bone.shearY = obj.shear.y;
      // TODO: only update the changed one ?
    });
  }
};
