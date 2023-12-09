import { TextureFilteringFlags } from "$lib/nima/common";

class MakePath {
  static make(path: string) {
    return "/static/3049" + path;
    // return (!o.default.isNode && __props.staticPath) || "/static" + path;
  }
}

export class PieItem {
  constructor() {}

  static initializeStageContext(e: any, t: any) {
    t.vertexTargetImage = e.loadTexture(
      MakePath.make("/images/vertex_paint_target.png"),
      TextureFilteringFlags.MultiplyAlpha
    );
  }
}
