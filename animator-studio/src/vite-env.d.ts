/// <reference types="svelte" />
/// <reference types="vite/client" />

import { IStudio } from "@theatre/studio";
import { SpineGameObject } from "./plugins/spine-phaser41";

declare interface Window {
  spine: any;
  hasumi: SpineGameObject;
  studio: IStudio;
}
