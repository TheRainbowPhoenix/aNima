/// <reference types="svelte" />
/// <reference types="vite/client" />

import { SpineGameObject } from "./plugins/spine-phaser41";

declare interface Window {
  spine: any;
  hasumi: SpineGameObject;
}
