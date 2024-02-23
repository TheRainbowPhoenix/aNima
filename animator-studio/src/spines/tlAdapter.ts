import { types, val } from "@theatre/core";
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

  for (const ik of sgo.skeleton.ikConstraints) {
    const props = {
      mix: types.number(ik.mix, { range: [0, 1] }),
      bendPositive: types.boolean(ik.bendDirection > 0),
      softness: types.number(ik.softness, { range: [0, 1] }),
      compress: types.boolean(ik.compress),
      stretch: types.boolean(ik.stretch),
    };

    const obj = tlHasumi.object("Spine / IK / " + ik.data.name, props);

    obj.onValuesChange((obj) => {
      ik.mix = obj.mix;
      ik.bendDirection = obj.bendPositive ? 1 : -1;
      ik.softness = obj.softness;
      ik.compress = obj.compress;
      ik.stretch = obj.stretch;

      // TODO: only update the changed one ?
    });
  }

  for (const tf of sgo.skeleton.transformConstraints) {
    const props = {
      mixRotate: types.number(tf.mixRotate, { range: [0, 1] }),
      mixX: types.number(tf.mixX, { range: [0, 1] }),
      mixY: types.number(tf.mixY, { range: [0, 1] }),
      mixScaleX: types.number(tf.mixScaleX, { range: [0, 1] }),
      mixScaleY: types.number(tf.mixScaleY, { range: [0, 1] }),
      mixShearY: types.number(tf.mixShearY, { range: [0, 1] }),
    };

    const obj = tlHasumi.object("Spine / Transform / " + tf.data.name, props);

    obj.onValuesChange((obj) => {
      tf.mixRotate = obj.mixRotate;
      tf.mixX = obj.mixX;
      tf.mixY = obj.mixY;
      tf.mixScaleX = obj.mixScaleX;
      tf.mixScaleY = obj.mixScaleY;
      tf.mixShearY = obj.mixShearY;
      // TODO: only update the changed one ?
    });
  }

  let dictionary: any = sgo.skeleton.skin
    ? sgo.skeleton.skin.attachments
    : sgo.skeleton.data.defaultSkin
    ? sgo.skeleton.data.defaultSkin.attachments
    : {};

  for (let i = 0; i < sgo.skeleton.slots.length; i++) {
    let slot = sgo.skeleton.slots[i];

    const baseName = slot.attachment?.name || "_default";

    const props: any = {};
    if (dictionary[i]) {
      const choices = Object.keys(dictionary[i]);
      const current = baseName;
      const values: any = {
        [current]: current,
      };
      for (const c of choices) {
        values[c] = c;
      }
      props.attachment = types.stringLiteral(current, values);
    }

    const obj = tlHasumi.object("Spine / Slots / " + slot.data.name, props);

    obj.onValuesChange((obj) => {
      if (
        obj.attachment && slot.attachment?.name
          ? slot.attachment.name !== obj.attachment
          : obj.attachment !== "_default"
      ) {
        sgo.skeleton.setAttachment(
          slot.data.name,
          obj.attachment === "_default" ? null : obj.attachment
        );
      }
      // TODO: only update the changed one ?
    });
  }
};
