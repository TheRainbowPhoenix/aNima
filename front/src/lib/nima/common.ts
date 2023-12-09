export interface Rect {
  top: number;
  bottom: number;
  width: number;
  height: number;
  left: number;
}

export enum PanModes {
  PanModifier = 1,
  Pan = 2,
  Drag = 3,
}

export enum TextureFilteringFlags {
  MipMapped = 1,
  ClampToEdge = 2,
  MultiplyAlpha = 4,
  LinearFilter = 8,
  FlipY = 16,
}
