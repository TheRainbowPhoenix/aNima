import { getProject, IProject, types } from "@theatre/core";
import { get, writable } from "svelte/store";
import { projectState } from "./state";

export const currentProject = writable<IProject>();

export const initialize = (): IProject => {
  // @ts-ignore
  window.getProject = getProject;

  let project = getProject("Spine", {
    state: get(projectState),
  });
  currentProject.set(project);
  console.log(project);
  //@ts-ignore
  window.project = project;

  const sheet1 = project.sheet("Sheet 1");
  const sheet3 = project.sheet("Sheet (Animation) 3");

  const obj = sheet1.object("Heading 1", {
    y: 0, // you can use just a simple default value
    opacity: types.number(1, { range: [0, 1] }), // or use a type constructor to customize
  });

  const obj1 = sheet1.object("Basics / Boxes / box-0", { x: 0 });
  const obj2 = sheet1.object("Basics / Boxes / box-1", { x: 0 });

  obj.onValuesChange((obj) => {
    console.log(obj.y, obj.opacity);
  });

  console.log(sheet1);

  //   project.ready.then(() => {
  //     sheet1.sequence.play({ iterationCount: Infinity, range: [0, 6] });
  //   });

  return project;
};
