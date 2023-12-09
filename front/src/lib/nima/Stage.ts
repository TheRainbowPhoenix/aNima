import type Graphics from "$lib/runtime/Graphics";
import type { GraphicsWrapper } from "./Nima";

import { mat2d, vec2 } from "gl-matrix";
import type Nima from "./Nima";
import { PanModes, type Rect } from "./common";
import { createEventDispatcher } from "svelte";
import { PieItem } from "./stage/items/Pie";
import { WeightsEditor } from "./stage/tools/WeightsEditor";

interface RegisteredItem {
  constructor: {
    initializeStageContext: (
      appGraphics: GraphicsWrapper,
      ctx: any,
      stage: Stage
    ) => any;
  };
  drawLayer: number;
  context?: any;
}

export enum TransformSpace {
  Local = 0,
  Parent = 1,
  World = 2,
}

export class Stage {
  private _AppContext: Nima;
  private _Graphics: GraphicsWrapper; // Replace with the actual type
  private _CursorElement: HTMLImageElement = document.createElement("img");
  private _Settings: {
    highlightColor: number[];
    selectionColor: number[];
    contourOpacity: number;
    contourThickness: number;
    showGridAxis: boolean;
    showGridSubdivisions: boolean;
    disableImageContour: boolean;
  };
  private _Translation: vec2;
  private _TranslationTarget: vec2;
  private _Scale: number;
  private _ScaleTarget: number;
  private _ViewTransform: mat2d;
  private _InverseViewTransform: mat2d;
  private _TransformSpace: TransformSpace;
  private _White: number[];
  private _Black: number[];
  private _ForceRedraw: boolean;
  private _WasAnimatingView: boolean;
  private _States: Record<string, any>;
  private _CursorState: any;
  private _HoverItem: any;
  private _LastDispatchedHoverItem: any;
  private _SelectedItems: any[];
  private _AllTools: any[];
  private _CurrentTool: any;
  private _SelectionFilter: SelectionFilter;
  private _DisabledSelectionFilter: any;
  private _CurrentToolClicked: boolean;
  private _CurrentOperation: any;
  private _ActiveDragTool: any;
  private _MouseX: any = undefined;
  private _MouseY: any = undefined;
  private _MouseDragged: boolean;
  private _SelectionsChanged: boolean;
  private _MouseDownSelected: boolean;
  private _MinZoom: number;
  private _MaxZoom: number;
  private _WorldMouse: vec2;
  private _LastClickedItem: any;
  private _QueuedRemove: any[];
  private _QueuedAdd: any[];
  private _SelectionLineBuffer: any;
  private _RenderTransform: mat2d;
  private _StageItems: any[];
  private _StageDrawLayers: any[];
  private _IsSelectionDisabled: boolean;
  private _IsDragDisabled: boolean;
  private _IsMouseOverStage: boolean;
  private _SuppressPanning: boolean;
  private _IsDraggingMarquee: boolean;
  private _DraggedMarquee: boolean;
  private _MarqueeStart: vec2;
  private _MarqueeEnd: vec2;
  private _PreMarqueeSelection: any[];
  private _MarqueeStrokeColor: number[];
  private _MarqueeFillColor: number[];
  private _GuideBackgroundColor: number[];
  private _HighlightItems: any[];
  private _MarqueeVertexBuffer: any;
  private _MarqueeIndexBuffer: any;
  private _SelectionReRoute: any;
  private _SelectionReRouteCanMarquee: boolean;
  private _IsSmallSize: boolean;
  private _ScreenScale: number;
  private _OriginTransform: any;
  private _OriginTranslation: vec2;
  private _OriginTranslationTarget: vec2;
  private _OriginRotation: number;
  private _OriginRotationTarget: number;
  private _SoloStrength: number;
  private _SoloFrameBuffer: any;
  private _SoloVertexBuffer: any;
  private _SoloIndexBuffer: any;
  private _SoloTransform: any;
  private _PreSoloScaleTarget: number;
  private _PreSoloTranslationTarget: vec2;
  private _SoloZoomed: boolean;
  private _SoloItems: any;
  private _HoverFallthrough: number;
  private _RenderCaptureTarget: any;
  private _RenderCaptureWidth: any;
  private _RenderCaptureHeight: any;
  private _RenderCaptureView: any;
  private _RenderCaptureCallback: any;
  private _MarqueeSilentChanges: any[];
  private _MouseDownTime: number;
  private _MouseMoveAccum: vec2;
  private _IsPreDrag: boolean;
  private _ReRoutedSelection: boolean;
  private _MoveTriggersPan: boolean;
  private _IsMouseDown: boolean;
  private _RegisteredStageItems: RegisteredItem[];
  private _LayerOptions: Record<string, any>;
  private _ContextLookup: Map<any, any>;
  private _MaxDrawLayer: number;
  private _BreakCapture: boolean;
  private _RegisteredItems: RegisteredItem[];
  private _RegisteredTools: any[];

  private _ExtraFilter: any = null;

  hold: any = null;

  constructor(
    appCtx: Nima,
    canvasElem: HTMLCanvasElement,
    appGraphics: GraphicsWrapper
  ) {
    this._AppContext = appCtx;
    this._Graphics = appGraphics;
    this._CursorElement = document.createElement("img");
    this._CursorElement.style.position = "absolute";
    this._CursorElement.style.pointerEvents = "none";
    this._Settings = {
      highlightColor: [1, 1, 1, 1],
      selectionColor: [0, 0.4, 1, 1],
      contourOpacity: 0.5,
      contourThickness: 0.125,
      showGridAxis: true,
      showGridSubdivisions: true,
      disableImageContour: appCtx.getPreference("disableImageContour"),
    };
    this._Translation = vec2.create();
    this._TranslationTarget = vec2.create();
    this._Scale = 0.01;
    this._ScaleTarget = 1;
    this._ViewTransform = mat2d.create();
    this._InverseViewTransform = mat2d.create();
    this._TransformSpace = TransformSpace.Local; // {Local: 0, Parent: 1, World: 2}
    this._White = [1, 1, 1, 1];
    this._Black = [0, 0, 0, 1];
    this._ForceRedraw = false;
    this._WasAnimatingView = false;
    this._States = {};
    this._CursorState = null;
    this._HoverItem = null;
    this._LastDispatchedHoverItem = null;
    this._SelectedItems = [];
    this._AllTools = [];
    this._CurrentTool = null;
    this._SelectionFilter = new SelectionFilter();
    this._DisabledSelectionFilter = null;
    this._CurrentToolClicked = false;
    this._CurrentOperation = null;
    this._ActiveDragTool = null;
    this._MouseDragged = false;
    this._SelectionsChanged = false;
    this._MouseDownSelected = false;
    this._MinZoom = 0.15;
    this._MaxZoom = 8;
    this._WorldMouse = vec2.create();
    this._LastClickedItem = null;
    this._QueuedRemove = [];
    this._QueuedAdd = [];
    this._SelectionLineBuffer = appGraphics.makeVertexBuffer([
      0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0,
    ]);
    this._RenderTransform = mat2d.create();
    this._StageItems = [];
    this._StageDrawLayers = [];
    this._IsSelectionDisabled = false;
    this._IsDragDisabled = false;
    this._IsMouseOverStage = false;
    this._SuppressPanning = false;
    this._IsDraggingMarquee = false;
    this._DraggedMarquee = false;
    this._MarqueeStart = vec2.create();
    this._MarqueeEnd = vec2.create();
    this._PreMarqueeSelection = [];
    this._MarqueeStrokeColor = [87 / 255, 165 / 255, 224 / 255, 1];
    this._MarqueeFillColor = [87 / 255, 165 / 255, 224 / 255, 0.3];
    this._GuideBackgroundColor = [42 / 255, 42 / 255, 42 / 255, 0.9];
    this._HighlightItems = [];

    this._MarqueeVertexBuffer = appGraphics.makeVertexBuffer([
      0, 0, 1, 0, 1, 1, 0, 1,
    ]);
    this._MarqueeIndexBuffer = appGraphics.makeIndexBuffer([0, 1, 2, 2, 3, 0]);
    this._SelectionReRoute = null;
    this._SelectionReRouteCanMarquee = false;
    this._IsSmallSize = false;
    this._ScreenScale = 1;
    this._OriginTransform = null;
    this._OriginTranslation = vec2.create();
    this._OriginTranslationTarget = vec2.create();
    this._OriginRotation = 0;
    this._OriginRotationTarget = 0;
    this._SoloStrength = 0;
    this._SoloFrameBuffer = null;
    this._SoloVertexBuffer = null;
    this._SoloIndexBuffer = null;
    this._SoloTransform = null;
    this._PreSoloScaleTarget = 1;
    this._PreSoloTranslationTarget = vec2.create();
    this._SoloZoomed = false;
    this._SoloItems = null;
    this._HoverFallthrough = 0;
    this._RenderCaptureTarget = null;
    this._RenderCaptureWidth = null;
    this._RenderCaptureHeight = null;
    this._RenderCaptureView = null;
    this._RenderCaptureCallback = null;
    this._MarqueeSilentChanges = [];
    this._MouseDownTime = Date.now();
    this._MouseMoveAccum = vec2.create();
    this._IsPreDrag = false;
    this._ReRoutedSelection = false;
    this._MoveTriggersPan = false;
    this._IsMouseDown = false;
    this._RegisteredStageItems = [];
    this._LayerOptions = {};
    this._ContextLookup = new Map();
    this._MaxDrawLayer = 0;
    this._BreakCapture = false;
    this._RegisteredItems = [];

    this._RegisteredTools = [
      WeightsEditor,
      /*
        p.default,
        y.default,
        m.default,
        v.default,
        g.default,
        _.default,
        b.default,
        w.default,
        h.default,
        f.default,
        O.default,
        S.default,
        k.default,
    */
    ];
    // this.registerItem(E.default, 4),
    // this.registerItem(T.default, 5),
    // this.registerItem(C.default, 8),
    // this.registerItem(L.default, 2),
    // this.registerItem(R.default, 2),
    // this.registerItem(F.default, 2),
    // this.registerItem(x.default, 2),
    // this.registerItem(I.default, 7),
    // this.registerItem(D.default, 3),
    // this.registerItem(M.default, 6),
    // this.registerItem(A.default, 3),
    // this.registerItem(j.default, 0),
    // this.registerItem(B.default, 4),
    // this.registerItem(V.default, 1),
    // this.registerItem(N.default, 3),
    // this.registerItem(z.default, 4),
    // this.registerItem(W.default, 4),
    this.registerItem(PieItem, 4); // H.default
    // this.registerItem(K.default, 4),
    // this.registerItem(U.default, 4);

    for (var o = 0; o < this._RegisteredItems.length; o++) {
      var regItem = this._RegisteredItems[o];

      var itemCtx = {
        constructor: regItem.constructor,
        context: {},
        drawLayer: regItem.drawLayer,
      };

      if (regItem.drawLayer > this._MaxDrawLayer) {
        this._MaxDrawLayer = regItem.drawLayer;
      }
      this._ContextLookup.set(regItem.constructor, itemCtx);
      this._RegisteredStageItems.push(itemCtx);

      var itemCtor = itemCtx.constructor.initializeStageContext;

      if (itemCtor && itemCtor.constructor === Function) {
        itemCtor(appGraphics, itemCtx.context, this);
      }
    }

    this._StageDrawLayers = [];

    for (var i = 0; i <= this._MaxDrawLayer; i++) {
      this._StageDrawLayers.push([]);
    }

    for (var i = 0; i < this._RegisteredTools.length; i++) {
      this._AllTools.push(new this._RegisteredTools[i](this));
    }

    return this;
  }

  dispatchHoverItemChange(): void {
    if (this._LastDispatchedHoverItem !== this._HoverItem) {
      if (this._LastDispatchedHoverItem) {
        this._LastDispatchedHoverItem.dispatch("hoverChange");
      }

      if (this._HoverItem) {
        this._HoverItem.dispatch("hoverChange");
      }

      this._LastDispatchedHoverItem = this._HoverItem;
    }
  }

  registerItem(ctor: any, layer: any) {
    this._RegisteredItems.push({
      constructor: ctor,
      drawLayer: layer || 0,
    });
  }

  isEnabled(stateId: number) {
    return true === this._States[stateId];
  }

  enableState(stateName: string) {
    if (this._States[stateName] !== true) {
      this._States[stateName] = true;
      this.updateCursorState();
      this._ForceRedraw = true;
      return true;
    }
    return false;
  }

  disableState(stateName: string) {
    if (this._States[stateName] === true) {
      this._States[stateName] = false;
      this.updateCursorState();
      this._ForceRedraw = true;
      return true;
    }
    return false;
  }

  screenScaleRect(rect: Rect) {
    if (this._ScreenScale != 1) {
      rect = {
        width: rect.width * this._ScreenScale,
        height: rect.height * this._ScreenScale,
        bottom: rect.bottom * this._ScreenScale,
        top: rect.top * this._ScreenScale,
        left: rect.left * this._ScreenScale,
      };
    }
    return rect;
  }

  getVisibleStageArea() {
    var rect = this._AppContext.getStageRect();
    return this.screenScaleRect(rect);
  }

  rectToWorld(rect: Rect): Rect {
    var scale = this._Scale;
    return {
      top: 0,
      left: (rect.left - this._Translation[0]) / scale,
      width: rect.width / scale,
      height: rect.height / scale,
      bottom: (rect.bottom - this._Translation[1] - rect.height) / scale,
    };
  }

  rerouteSelection(selectionReRoute: any, canMarquee: boolean) {
    this._SelectionReRouteCanMarquee = canMarquee === true;
    this._SelectionReRoute = selectionReRoute;
  }

  clearRerouteSelection(selectionReRoute: any) {
    if (this._SelectionReRoute == selectionReRoute) {
      this._SelectionReRoute = null;
    }
  }

  setSize(e: number, t: number, n?: number, i?: number): boolean {
    // let r = false;
    // this._ScreenScale = n || 1;

    // const o = this._Graphics.viewportWidth;
    // const a = this._Graphics.viewportHeight;

    // if (this._Graphics.setSize(e, t)) {
    //   this._ForceRedraw = true;
    //   r = true;

    //   const s = this._Translation[0] - o / 2;
    //   const l = this._Translation[1] - a / 2;

    //   this._TranslationTarget[0] = this._Translation[0] = s + e / 2;
    //   this._TranslationTarget[1] = this._Translation[1] = l + t / 2;

    //   if (this._IsSmallSize) {
    //     if (e > 720 && t > 810) {
    //       this.zoomTo(e / 2, t / 2, this._ScaleTarget / (440 / 680));
    //       this._IsSmallSize = false;
    //     }
    //   } else {
    //     if (e < 720 || t < 810) {
    //       this.zoomTo(e / 2, t / 2, this._ScaleTarget * (440 / 680));
    //       this._IsSmallSize = true;
    //     }
    //   }
    // }

    // if (this._Scale === 0) {
    //   this._Scale = 0.5;
    //   this._ScaleTarget = 1;

    //   const u = this.getVisibleStageArea();
    //   if (u) {
    //     this._TranslationTarget[0] = this._Translation[0] =
    //       u.left + u.width / 2;
    //     this._TranslationTarget[1] = this._Translation[1] = 0.33333 * u.height;
    //   } else {
    //     this._TranslationTarget[0] = this._Translation[0] = e / 2;
    //     this._TranslationTarget[1] = this._Translation[1] = 0.33333 * t;
    //   }

    //   this.dispatch("zoomChanged", this._ScaleTarget);
    // }

    // return r;
    throw new Error("Method Stage.setSize not implemented.");

    return false;
  }

  getZoomFitViewTransform(e: any, t: any) {
    // for (var n, i = this._StageItems, r = 0; r < i.length; r++) {
    //   var o = i[r];
    //   o.isVisible &&
    //     o.isSelectable &&
    //     o.constructor !== N.default &&
    //     (n
    //       ? n.combine(o.aabb)
    //       : (n = new u.default()).set(o.aabb.min, o.aabb.max));
    // }
    // var s = mat2d.create();
    // if (!n) return s;
    // var l = n.center,
    //   c = Math.min(e / n.boxWidth, t / n.boxHeight);
    // return (
    //   (s[0] = c),
    //   (s[3] = c),
    //   (s[4] = e / 2 - l[0] * c),
    //   (s[5] = t / 2 - l[1] * c),
    //   s
    // );
    throw new Error("Method Stage.getZoomFitViewTransform not implemented.");
  }

  filterItems(predicate: (item: any) => boolean): any[] {
    const filteredItems: any[] = [];

    for (let n = 0; n < this._StageItems.length; n++) {
      const item = this._StageItems[n];
      if (predicate(item)) {
        filteredItems.push(item);
      }
    }

    return filteredItems;
  }

  getCombinedAABB(items?: any[]): any /* u.default | null */ {
    // let combinedAABB: u.default | null = null;

    // items = items || this._StageItems;

    // for (let i = 0; i < items.length; i++) {
    //   const item = items[i];

    //   if (
    //     item.isVisible &&
    //     (!this._SoloItems ||
    //       item.isSolo ||
    //       (item.parent && item.parent.isSolo)) &&
    //     item.constructor !== N.default
    //   ) {
    //     if (item.constructor === j.default) {
    //       item.node.updateDeform(true);
    //       item.updateMesh();
    //     }

    //     if (combinedAABB) {
    //       combinedAABB.combine(item.aabb);
    //     } else {
    //       combinedAABB = new u.default().set(item.aabb.min, item.aabb.max);
    //     }
    //   }
    // }

    // return combinedAABB;
    throw new Error("Method Stage.getCombinedAABB not implemented.");
  }

  zoomFit(e: any) {
    e || (e = this._MaxZoom);
    var t = this._SelectedItems,
      n = null !== this._SoloItems,
      i = void 0;
    if (n && this._OriginTransform) {
      //   e = 1;
      //   var r = Number.MAX_VALUE,
      //     o = Number.MAX_VALUE,
      //     s = -Number.MAX_VALUE,
      //     l = -Number.MAX_VALUE,
      //     c = this.soloItem,
      //     d = [
      //       a.vec2.create(),
      //       a.vec2.create(),
      //       a.vec2.create(),
      //       a.vec2.create(),
      //     ],
      //     h = c.min,
      //     f = c.max,
      //     p = [
      //       a.vec2.set(d[0], h[0], h[1]),
      //       a.vec2.set(d[1], f[0], h[1]),
      //       a.vec2.set(d[2], f[0], f[1]),
      //       a.vec2.set(d[3], h[0], f[1]),
      //     ],
      //     y = c.renderTransform,
      //     m = a.mat2d.create();
      //   a.mat2d.fromTranslation(m, this._OriginTranslationTarget),
      //     (y = a.mat2d.mul(a.mat2d.create(), m, y)),
      //     a.mat2d.fromRotation(m, this._OriginRotationTarget),
      //     (y = a.mat2d.mul(a.mat2d.create(), m, y));
      //   for (var v = 0; v < p.length; v++) {
      //     var g = p[v],
      //       _ = a.vec2.transformMat2d(g, g, y);
      //     _[0] < r && (r = _[0]),
      //       _[1] < o && (o = _[1]),
      //       _[0] > s && (s = _[0]),
      //       _[1] > l && (l = _[1]);
      //   }
      //   (i = new u.default()).set([r, o], [s, l]);
      // } else {
      //   0 == t.length && (t = this._StageItems);
      //   for (var b = 0; b < t.length; b++) {
      //     var w = t[b];
      //     w.isVisible &&
      //       w.isSelectable &&
      //       (!n || w.isSolo || (w.parent && w.parent.isSolo)) &&
      //       w.constructor !== N.default &&
      //       (i
      //         ? i.combine(w.aabb)
      //         : (i = new u.default()).set(w.aabb.min, w.aabb.max));
      //   }
      // }
      // if (i) {
      //   var O = i.center,
      //     S = this.getVisibleStageArea();
      //   (this._ScaleTarget = Math.min(
      //     e,
      //     Math.max(
      //       this._MinZoom,
      //       Math.min(S.width / i.boxWidth, S.height / i.boxHeight)
      //     )
      //   )),
      //     (this._TranslationTarget[0] =
      //       S.left + S.width / 2 - O[0] * this._ScaleTarget),
      //     (this._TranslationTarget[1] =
      //       this._Graphics.viewportHeight -
      //       S.bottom +
      //       S.height / 2 -
      //       O[1] * this._ScaleTarget),
      //     this.dispatch("zoomChanged", this._ScaleTarget);
    }
    throw new Error("Method Stage.zoomFit not implemented.");
  }

  zoomTo(e: number, t: number, n: number): void {
    let minZoom = this._MinZoom;

    if (this._IsSmallSize) {
      minZoom /= 4;
    }

    n = Math.min(this._MaxZoom, Math.max(minZoom, n));

    const scaleTarget = this._ScaleTarget;
    this._ScaleTarget = n;

    const o = this._ScaleTarget / scaleTarget;
    const a = e - this._TranslationTarget[0];
    const s = t - this._TranslationTarget[1];
    const l = a * o;
    const u = s * o;

    this._TranslationTarget[0] += a - l;
    this._TranslationTarget[1] += s - u;

    this.dispatch("zoomChanged", this._ScaleTarget);
  }

  updateWorldMousePosition() {
    // (this._WorldMouse[0] = this._MouseX * this._ScreenScale),
    //   (this._WorldMouse[1] =
    //     this._Graphics.viewportHeight - this._MouseY * this._ScreenScale),
    //   a.vec2.transformMat2d(
    //     this._WorldMouse,
    //     this._WorldMouse,
    //     this._InverseViewTransform
    //   );
    // var e = this.canSelect,
    //   t = this._HoverItem;
    // if (
    //   !this.isEnabled(Y.Drag) &&
    //   !this._IsSelectionDisabled &&
    //   this._IsMouseOverStage
    // ) {
    //   var n = 0 != this._SoloStrength;
    //   this._HoverItem = null;
    //   for (
    //     var i = null,
    //       r = 0,
    //       o = this._HoverFallthrough,
    //       s = this._StageDrawLayers.length - 1;
    //     s >= 0 && null == this._HoverItem;
    //     s--
    //   ) {
    //     var l = this._StageDrawLayers[s],
    //       u = this._LayerOptions[s];
    //     if (u) {
    //       if (u.disableSelection) continue;
    //       u.overrideItems && (l = u.overrideItems(l, this));
    //     }
    //     for (var c = l.length - 1; c >= 0; c--) {
    //       var d = l[c];
    //       if (
    //         e(d) &&
    //         d.isVisible &&
    //         d.isSelectable &&
    //         (!n ||
    //           d.drawAfterSelections ||
    //           d.isSolo ||
    //           (d.parent && d.parent.isSolo)) &&
    //         d.isPointOver(this._WorldMouse[0], this._WorldMouse[1])
    //       ) {
    //         if (!(r < o)) {
    //           this._HoverItem = d;
    //           break;
    //         }
    //         r++, null === i && (i = d);
    //       }
    //     }
    //   }
    //   this._HoverItem ||
    //     null === i ||
    //     ((this._HoverItem = i), (this._HoverFallthrough = 0));
    // }
    // t !== this._HoverItem &&
    //   ((this._ForceRedraw = true),
    //   this._CurrentTool &&
    //     this._CurrentTool.hoverItemChange &&
    //     this._CurrentTool.hoverItemChange(this._HoverItem)),
    //   this.dispatchHoverItemChange();
    throw new Error("Method Stage.updateWorldMousePosition not implemented.");
  }

  advance(e: any) {
    var t = this._ScaleTarget - this._Scale,
      n = this._TranslationTarget[0] - this._Translation[0],
      i = this._TranslationTarget[1] - this._Translation[1],
      r = Math.min(1, 15 * e),
      o = false;
    if (
      (this._ForceRedraw && ((o = true), (this._ForceRedraw = false)),
      Math.abs(t) > 1e-5 && ((t *= r), (o = true)),
      Math.abs(n) > 0.01 && ((n *= r), (o = true)),
      Math.abs(i) > 0.01 && ((i *= r), (o = true)),
      (this._Scale += t),
      (this._Translation[0] += n),
      (this._Translation[1] += i),
      this._OriginTranslation && mat2d.identity(this._ViewTransform),
      (this._ViewTransform[0] = this._Scale),
      (this._ViewTransform[3] = this._Scale),
      (this._ViewTransform[4] = this._Translation[0]),
      (this._ViewTransform[5] = this._Translation[1]),
      this._OriginTransform)
    ) {
      var s = this._OriginTranslationTarget[0] - this._OriginTranslation[0],
        l = this._OriginTranslationTarget[1] - this._OriginTranslation[1],
        u = this._OriginRotationTarget - this._OriginRotation;
      Math.abs(u) > 1e-5 && ((u *= r), (o = true)),
        Math.abs(s) > 0.01 && ((s *= r), (o = true)),
        Math.abs(l) > 0.01 && ((l *= r), (o = true)),
        (this._OriginRotation += u),
        (this._OriginTranslation[0] += s),
        (this._OriginTranslation[1] += l),
        mat2d.fromRotation(this._OriginTransform, this._OriginRotation),
        mat2d.mul(
          this._ViewTransform,
          this._ViewTransform,
          this._OriginTransform
        ),
        mat2d.fromTranslation(this._OriginTransform, this._OriginTranslation),
        mat2d.mul(
          this._ViewTransform,
          this._ViewTransform,
          this._OriginTransform
        ),
        o ||
          0 != this._OriginTranslation[0] ||
          0 != this._OriginTranslation[1] ||
          0 != this._OriginRotation ||
          (this._OriginTransform = null);
    }
    if (
      (mat2d.invert(this._InverseViewTransform, this._ViewTransform),
      0 != this._SoloStrength || this._SoloItems)
    ) {
      var c = 3.22 * e;
      (1 == this._SoloStrength && this._SoloItems) || (o = true),
        o &&
          ((this._SoloStrength += this._SoloItems ? c : -c),
          (this._SoloStrength = Math.min(1, Math.max(0, this._SoloStrength)))),
        0 != this._SoloStrength ||
          this._SoloItems ||
          (this._SoloFrameBuffer.destroy(),
          (this._SoloFrameBuffer = null),
          (this._SoloTransform = null));
    }
    return (
      this._WasAnimatingView && !o && this.updateWorldMousePosition(),
      (this._WasAnimatingView = o),
      o
    );
  }

  setSoloItems(e: any, t: any) {
    if (this._SoloItems)
      for (var n = 0; n < this._SoloItems.length; n++)
        this._SoloItems[n].isSolo = false;
    this._SoloItems = e.slice(0);
    for (var i = 0; i < this._SoloItems.length; i++)
      this._SoloItems[i].isSolo = true;
    if (
      !this._SoloFrameBuffer &&
      ((this._SoloFrameBuffer = this._Graphics.makeFrameBuffer()),
      (this._SoloTransform = mat2d.create()),
      !this._SoloVertexBuffer)
    ) {
      (this._SoloVertexBuffer = this._Graphics.makeVertexBuffer([
        0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0,
      ])),
        (this._SoloIndexBuffer = this._Graphics.makeIndexBuffer([
          0, 1, 2, 2, 3, 0,
        ]));
    }
    t &&
      (this._SoloZoomed ||
        ((this._PreSoloScaleTarget = this._ScaleTarget),
        vec2.copy(this._PreSoloTranslationTarget, this._TranslationTarget)),
      (this._SoloZoomed = true),
      this.zoomFit(1),
      this.dispatch("zoomChanged", this._ScaleTarget));
  }

  clearSoloItems() {
    if (this._SoloItems) {
      for (var e = 0; e < this._SoloItems.length; e++) {
        this._SoloItems[e].isSolo = false;
      }

      this._SoloItems = null;

      if (this._SoloZoomed) {
        this._SoloZoomed = false;
        this._ScaleTarget = this._PreSoloScaleTarget;
        vec2.copy(this._TranslationTarget, this._PreSoloTranslationTarget);
        this.dispatch("zoomChanged", this._ScaleTarget);
      }
    }
  }

  setViewOrigin(e: any) {
    this._OriginTransform = mat2d.create();

    if (e) {
      this._OriginTranslationTarget[0] = -e[4];
      this._OriginTranslationTarget[1] = -e[5];
      // @ts-ignore : TODO: fix this mat2d.getRotation ??
      this._OriginRotationTarget = -mat2d.getRotation(e);
    } else {
      vec2.set(this._OriginTranslationTarget, 0, 0);
      this._OriginRotationTarget = 0;
    }
  }

  setLayerOptions(name: any, options: any) {
    var n = this._ContextLookup.get(name);
    if (!n) return null;

    var i = (n && n.drawLayer) || 0;
    this._LayerOptions[i] = options;
    this.dispatch("updateLayerOptions");
  }

  setLayerRenderExtensions(name: string, ext: any) {
    this._LayerOptions[name] = ext;
  }

  getLayerOptions(name: any) {
    var layer = this._ContextLookup.get(name);
    if (!layer) return null;

    var drawLayer = (layer && layer.drawLayer) || 0;
    let options = this._LayerOptions[drawLayer];

    return options || (options = this._LayerOptions[drawLayer] = {}), options;
  }

  drawRenderCapture(e: any) {
    e.setup && (e.context = e.setup()),
      e.context &&
        (e.context.renderWidth &&
          (this._RenderCaptureWidth = e.context.renderWidth),
        e.context.renderHeight &&
          (this._RenderCaptureHeight = e.context.renderHeight)),
      this._RenderCaptureTarget.bind(
        this._RenderCaptureWidth,
        this._RenderCaptureHeight
      ),
      e.context && e.context.renderView
        ? (this._ViewTransform = e.context.renderView)
        : (this._ViewTransform = this._RenderCaptureView),
      mat2d.invert(this._InverseViewTransform, this._ViewTransform),
      this.drawTo(
        this._RenderCaptureTarget,
        this._RenderCaptureWidth,
        this._RenderCaptureHeight
      );
    var t = this._RenderCaptureTarget.read();
    e.complete
      ? e.complete(
          t,
          this._RenderCaptureWidth,
          this._RenderCaptureHeight,
          e.context
        )
      : e(t),
      e.cleanup && e.cleanup(e.context),
      (e = null);

    // throw new Error("Method Stage.drawRenderCapture not implemented.");
  }

  draw() {
    if (this._RenderCaptureCallback) {
      var viewTransform = this._ViewTransform;
      if (this._RenderCaptureCallback.constructor === Array) {
        this._BreakCapture = false;
        var t = this._RenderCaptureCallback.slice(0);
        this._RenderCaptureCallback = null;
        for (var n = 0; !this._BreakCapture && n < t.length; n++) {
          var i = t[n];
          this.drawRenderCapture(i);
        }
      } else {
        var r = this._RenderCaptureCallback;
        (this._RenderCaptureCallback = null), this.drawRenderCapture(r);
      }
      this._RenderCaptureTarget.unbind(),
        (this._ViewTransform = viewTransform),
        mat2d.invert(this._InverseViewTransform, this._ViewTransform);
    }
    this.drawTo(null);
  }

  drawTo(e: any, t?: any, n?: any) {
    let i = false;
    let r = [];
    let selectionDisabled = this._IsSelectionDisabled;
    let selectable = this.canSelect;

    if (!e) {
      this._Graphics.disableBlending();
      var l = Math.min(1, Math.pow(this._Scale, 2.4)),
        u = Math.min(1, Math.pow(this._Scale, 0.7));
      this._Graphics.drawGrid(
        this._Settings.showGridAxis,
        this._Settings.showGridSubdivisions,
        this._Translation[0],
        this._Translation[1],
        128 * this._Scale,
        128 * this._Scale,
        1,
        l,
        u
      ),
        this._SoloStrength > 0 &&
          ((i = true), (r = []), this._SoloFrameBuffer.bind());
    }
    this._Graphics.enableBlending();

    let panEnabled =
      this.isEnabled(PanModes.Pan) || this.isEnabled(PanModes.PanModifier);
    let d = [];

    for (var h = 0; h < this._StageDrawLayers.length; h++) {
      var f = this._StageDrawLayers[h],
        p = this._LayerOptions[h],
        y = true;
      if (
        (p &&
          (p.overrideItems && (f = p.overrideItems(f, this)),
          p.drawPrep && (f = p.drawPrep.call(p, f, this._Graphics, this)),
          p.disableDraw && (y = false)),
        f && y)
      )
        for (var m = 0; m < f.length; m++) {
          var v = f[m];
          v.isVisible &&
            (i && (v.isSolo || (v.parent && v.parent.isSolo))
              ? r?.push(v)
              : v.drawAfterSelections
              ? d.push(v)
              : v.draw(
                  this._Graphics,
                  v == this._HoverItem && !panEnabled,
                  !selectionDisabled && v.isSelected && selectable(v)
                ));
        }
      p && p.drawCleanup && p.drawCleanup.call(p, this._Graphics);
    }
    if (i) {
      this._SoloFrameBuffer.unbind(),
        mat2d.fromScaling(this._SoloTransform, [
          this._Graphics.viewportWidth,
          this._Graphics.viewportHeight,
        ]);
      var g = 0.15 + 0.85 * (1 - this._SoloStrength);
      this._Graphics.drawTextured(
        this._SoloTransform,
        this._SoloVertexBuffer,
        this._SoloIndexBuffer,
        1,
        [1, 1, 1, g],
        this._SoloFrameBuffer.texture
      );
      for (var _ = 0; _ < r.length; _++) {
        var b = r[_];
        b.draw(this._Graphics, b == this._HoverItem && !panEnabled);
      }
    }
    if (!selectionDisabled)
      for (var w = 0; w < this._SelectedItems.length; w++) {
        var O = this._SelectedItems[w];
        selectable(O) &&
          O.drawSelection(this._Graphics, O == this._HoverItem && !panEnabled);
      }
    if (
      (panEnabled ||
        !this._HoverItem ||
        (!this._IsSelectionDisabled && this._HoverItem.isSelected) ||
        this._HoverItem.drawSelection(this._Graphics),
      this._CurrentTool && this._CurrentTool.drawPrep(this._Graphics),
      !this._IsSelectionDisabled)
    )
      for (var S = this.canSelect, k = 0; k < d.length; k++) {
        var P = d[k];
        S(P) && P.draw(this._Graphics, P == this._HoverItem && !panEnabled);
      }
    if (this._DraggedMarquee) {
      this._Graphics.enableBlending();
      var E = this._MarqueeStart[0] < this._MarqueeEnd[0],
        T = this._MarqueeStart[1] < this._MarqueeEnd[1],
        C = E ? this._MarqueeStart[0] : this._MarqueeEnd[0],
        x = T ? this._MarqueeStart[1] : this._MarqueeEnd[1],
        I = E ? this._MarqueeEnd[0] : this._MarqueeStart[0],
        D = T ? this._MarqueeEnd[1] : this._MarqueeStart[1],
        M = this._Graphics.makeThickLine(
          [
            [C, x],
            [I, x],
            [I, D],
            [C, D],
          ],
          true
        ),
        A = mat2d.fromScaling(mat2d.create(), [I - C, D - x]);
      (A[4] = C),
        (A[5] = x),
        this._Graphics.drawColor(
          A,
          this._MarqueeVertexBuffer,
          this._MarqueeIndexBuffer,
          0.5,
          this._MarqueeFillColor
        ),
        this._Graphics.drawThickLine(
          mat2d.create(),
          M,
          1,
          1,
          this._MarqueeStrokeColor
        );
    }
  }

  drawGuides(e: any) {
    for (
      var t = mat2d.create(), n = [87 / 255, 165 / 255, 224 / 255, 1], i = 0;
      i < e.length;
      i++
    ) {
      var r = e[i],
        o = mat2d.fromScaling(t, [r.w, r.h]);
      (o[4] = r.x),
        (o[5] = r.y),
        this._Graphics.drawColor(
          o,
          this._MarqueeVertexBuffer,
          this._MarqueeIndexBuffer,
          r.o,
          n
        );
    }
  }

  canSelect(e: any) {
    var t = this._SelectionFilter,
      n = this._ExtraFilter;
    return !(t && !t.canSelect(e)) && !(n && !n(e));
  }

  dispatch(
    eventName: any,
    evtData: any = undefined,
    extraCtx: any = undefined
  ) {
    var r = this.hold;
    if (r && (r = r.get(eventName)))
      return (
        r.squash && (r.list.length = 0),
        void r.list.push({
          data: evtData,
          extraContext: extraCtx,
        })
      );
    // TODO : make a svelte event dispatcher, that dispatch on some div / common element "hub" that can be listened from DOM
    const dispatch = createEventDispatcher();

    dispatch(
      eventName,
      evtData
        ? {
            data: evtData,
            extraContext: extraCtx,
          }
        : undefined
    );

    // var o = this.events.get(eventName);
    // if (o) {
    //   this.dispatchGuard = !0;
    //   var i = !0,
    //     a = !1,
    //     s = void 0;
    //   try {
    //     for (
    //       var l, u = o[Symbol.iterator]();
    //       !(i = (l = u.next()).done);
    //       i = !0
    //     ) {
    //       l.value.call(this, evtData, extraCtx);
    //     }
    //   } catch (e) {
    //     (a = !0), (s = e);
    //   } finally {
    //     try {
    //       !i && u.return && u.return();
    //     } finally {
    //       if (a) throw s;
    //     }
    //   }
    //   if (((this.dispatchGuard = !1), this.removeLater.length)) {
    //     var c = !0,
    //       f = !1,
    //       d = void 0;
    //     try {
    //       for (
    //         var h, p = this.removeLater[Symbol.iterator]();
    //         !(c = (h = p.next()).done);
    //         c = !0
    //       ) {
    //         var v = h.value;
    //         this.removeEventListener(v.event, v.callback);
    //       }
    //     } catch (e) {
    //       (f = !0), (d = e);
    //     } finally {
    //       try {
    //         !c && p.return && p.return();
    //       } finally {
    //         if (f) throw d;
    //       }
    //     }
    //     this.removeLater.length = 0;
    //   }
    // }
  }

  updateCursorState() {
    // TODO
  }
}

class SelectionFilter {
  constructor() {}

  canSelect(e: any): boolean {
    return this.canSelectType(e.constructor) || e.drawAfterSelections;
  }

  canSelectType(e: any): boolean {
    return true;
  }
}
