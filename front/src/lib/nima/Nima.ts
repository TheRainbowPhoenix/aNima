import Graphics from "$lib/runtime/Graphics";
import type { Rect } from "./common";
import { Stage } from "./Stage";
import { TextureFilteringFlags } from "$lib/nima/common";

export default class Nima {
  public _BuildNumber: string;
  public _Graphics: GraphicsWrapper;
  public _Canvas: HTMLCanvasElement;
  public _EditorUI: any;
  public _UserPreferences: any;
  public _User: any;
  public _Author: any;
  public _Actor: any;
  public _LastAdvanceTime: number = 0;
  public _AdvanceTimeout: number = 0;
  public _IsDrawing: boolean = false;
  public _LowFrequencyAdvanceTime: number = (1 / 15) * 1e3;
  public _StartedDrawingTime: number = 0;
  public _EditingAnimation: any;
  public _EditingMesh: any;
  public _EditingWeights: any;
  public _IsAnimationEnabled: boolean = false;
  public _AutoKey: boolean = true;
  public _ErrorKey: any = null;
  public _File: any;
  public _ProjectPreferences: any;
  public _LocalPreferences: any;
  public _FilePreferences: any;
  public _RevisionManager: any;
  public _RMSaveAlert: any;
  public _ExpiredAlert: any;
  public _LastMouseX: number = 0;
  public _LastMouseY: number = 0;
  public _IncBrushSizeCallback: any = null;
  public _IncBrushFeatherCallback: any = null;
  public _IncBrushStrengthCallback: any = null;
  public _SelectIndexItemCallback: any = null;
  public _SelectIndexItemNextCallback: any = null;
  public _SelectIndexItemPreviousCallback: any = null;
  public _CleanupEvents: any[] = [];
  public _IsDragging: boolean = false;
  public _IsExporting: boolean = false;
  public _LastReportTime: number = 0;
  public _FileAccess: any;
  public _Journal: any[] = [];
  public _JournalIndex: number = -1;
  public _CancelCallback: any;
  public _SelectedItems: any[] = [];
  public _SaveLocalPreferencesTimeout: number = -1;
  public _SaveUserPreferencesTimeout: number = -1;
  public _SaveProjectPreferencesTimeout: number = -1;
  public _SaveCharacterPreferencesTimeout: number = -1;
  public _ReplaceTargets: any;
  public _WasCompensating: any;
  public _ExpandedHierarchyItems: Set<any>;

  private _OldErrorHandler: OnErrorEventHandler = null;
  private _Stage: Stage;

  constructor(
    canvasElem: HTMLCanvasElement,
    currentStage: any,
    user: any,
    preferences: any,
    buildNumber: string,
    fileData: any
  ) {
    this._BuildNumber = buildNumber;
    this._Graphics = new GraphicsWrapper(canvasElem);
    this._Canvas = canvasElem;
    this._EditorUI = currentStage;
    this._UserPreferences = preferences || {};
    this._User = user;
    this._Author = fileData.owner;
    this._Actor = null;
    this._StartedDrawingTime = performance.now();

    this._File = fileData || null;
    this._ProjectPreferences = {};
    this._LocalPreferences = {};
    this._FilePreferences = {};
    // this._RevisionManager = new

    this._WasCompensating = {
      compensateBones: false,
      compensateImages: false,
    };
    this._ExpandedHierarchyItems = new Set();
    // Initialization code goes here

    let userPreferences: Record<string, string> = {};
    var _userPreferences = localStorage.getItem("preferences-" + this._User.id);
    if (_userPreferences) {
      try {
        userPreferences = JSON.parse(_userPreferences);
      } catch (e) {
        console.warn("Failed to parse local preferences.");
      }
    }

    this._FilePreferences = fileData?.preferences || {};

    for (const p in userPreferences) {
      if (userPreferences.hasOwnProperty(p)) {
        this._LocalPreferences[p] = userPreferences[p];
      }
    }

    if ("dev-build" !== this._BuildNumber) {
      this._OldErrorHandler = window.onerror;
      window.onerror = this.onError;
    }

    this._Stage = new Stage(this, canvasElem, this._Graphics);
    // TODO ! Continue code ...
  }

  // Add your class methods here

  cleanup() {
    // Cleanup code goes here
  }

  // extra keys
  onError(message: any, url: any, line: any, i: any, r: any) {
    if (this._OldErrorHandler) {
      this._OldErrorHandler(message, url, line, i, r);
    }

    const currentTime = Date.now();

    if (!(currentTime - this._LastReportTime < 5000)) {
      this._LastReportTime = currentTime;

      const errorData = {
        error: {
          message: message,
          url: url,
          lineNumber: line,
        },
        stack: r && r.stack,
        build: this._BuildNumber,
        character: this._File,
        revisionManagerState: this._RevisionManager.state,
        editorState: this._EditorUI.getStateForLog(),
        screenshot: this._Canvas.toDataURL("image/jpeg", 0.67),
        userAgent: navigator.userAgent,
      };

      console.log("ERROR HERE", errorData);

      this._EditorUI.showCrash();

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/report_error/" + this._BuildNumber, true);

      xhr.onload = () => {
        try {
          const parsedResponse = JSON.parse(xhr.responseText);
          this._ErrorKey = parsedResponse.key;
        } catch (e) {
          console.warn("Failed to parse response text from report_error.");
        }
      };

      xhr.send(JSON.stringify(errorData));

      return false;
    }
  }

  getPreference(key: string) {
    var filePref = this._FilePreferences[key];
    if (void 0 !== filePref) return filePref;
    var projPref = this._ProjectPreferences[key];
    if (void 0 !== projPref) return projPref;
    var localPref = this._LocalPreferences[key];
    return void 0 !== localPref ? localPref : this._UserPreferences[key];
  }

  getStageRect(): Rect {
    return this._EditorUI.getStageRect();
  }
}

export type GraphicsTexture = WebGLTexture & {
  flags: number;
  isLoaded: boolean;
  width: number;
  height: number;
};

export class GraphicsWrapper extends Graphics {
  viewportWidth: number = 0;
  viewportHeight: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    // r.default.call(this); // defines PieShader and stuff, also drawGrid and Selection Shader
    Object.assign(this, {
      loadTexture: this._loadTexture,
    });
  }

  _loadTexture(
    elem: string | ArrayBuffer,
    flags: TextureFilteringFlags,
    preTexture: WebGLTexture
  ) {
    let gl: WebGLRenderingContext = this._GL;
    let isArray = elem.constructor === ArrayBuffer;
    // if (!isArray) {
    //   var texture = u[elem]; // cache ?
    //   if (texture) return texture;
    // }
    var texture: GraphicsTexture = Object.assign(
      preTexture || gl.createTexture(),
      {
        flags: flags || 0,
        isLoaded: false,
        width: 0,
        height: 0,
      }
    );

    // isArray || (u[elem] = texture);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);

    let img_tex: GraphicsTexture;
    let img = new Image();

    if (isArray) {
      var blob = new Blob([elem], {
        type: "image/jpeg",
      });
      elem = (window.URL || window.webkitURL).createObjectURL(l);
    }

    img.src = elem as string;
    // T() => y++
    img.onload =
      ((img_tex = texture),
      function () {
        let isNotClampEdge =
          0 != (img_tex.flags & TextureFilteringFlags.ClampToEdge);
        let isNotMipMapped =
          0 != (img_tex.flags & TextureFilteringFlags.MipMapped);
        // x(); =>  _this.advanceProgress...
        img_tex.width = texture.width;
        img_tex.height = texture.height;

        var isEven = !(
          0 == img.width ||
          img.width & (img.width - 1) ||
          0 == img.height ||
          img.height & (img.height - 1)
        );
        gl.bindTexture(gl.TEXTURE_2D, img_tex);

        if (img_tex.flags & TextureFilteringFlags.MultiplyAlpha) {
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        } else {
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        }

        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          this as TexImageSource // TODO
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(
          gl.TEXTURE_2D,
          gl.TEXTURE_MIN_FILTER,
          isEven && isNotMipMapped ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR
        );

        gl.texParameteri(
          gl.TEXTURE_2D,
          gl.TEXTURE_WRAP_S,
          isEven && !isNotClampEdge ? gl.REPEAT : gl.CLAMP_TO_EDGE
        );
        gl.texParameteri(
          gl.TEXTURE_2D,
          gl.TEXTURE_WRAP_T,
          isEven && !isNotClampEdge ? gl.REPEAT : gl.CLAMP_TO_EDGE
        );
        isEven && isNotMipMapped && gl.generateMipmap(gl.TEXTURE_2D),
          gl.bindTexture(gl.TEXTURE_2D, null);
      });
    img.onerror = (e) => {
      return function () {
        texture.isLoaded = false;
      };
    };

    console.log("_loadTexture");

    return texture;
  }

  drawThickLine(
    arg0: any,
    M: void,
    arg2: number,
    arg3: number,
    _MarqueeStrokeColor: number[]
  ) {
    throw new Error("Method not implemented.");
  }
  drawColor(
    A: any,
    _MarqueeVertexBuffer: any,
    _MarqueeIndexBuffer: any,
    arg3: number,
    _MarqueeFillColor: number[]
  ) {
    throw new Error("Method not implemented.");
  }
  makeThickLine(arg0: number[][], arg1: boolean) {
    throw new Error("Method not implemented.");
  }
  drawTextured(
    _SoloTransform: any,
    _SoloVertexBuffer: any,
    _SoloIndexBuffer: any,
    arg3: number,
    arg4: number[],
    texture: any
  ) {
    throw new Error("Method not implemented.");
  }
  drawGrid(
    showGridAxis: boolean,
    showGridSubdivisions: boolean,
    arg2: number,
    arg3: number,
    arg4: number,
    arg5: number,
    arg6: number,
    l: number,
    u: number
  ) {
    throw new Error("Method not implemented.");
  }

  makeFrameBuffer(): any {
    // TODO !!
    throw new Error("Method not implemented.");
  }
}
