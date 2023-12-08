import Graphics from "$lib/runtime/Graphics";

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
  public _ErrorKey: any;
  public _File: any;
  public _ProjectPreferences: any;
  public _LocalPreferences: any;
  public _FilePreferences: any;
  public _RevisionManager: any;
  public _RMSaveAlert: any;
  public _ExpiredAlert: any;
  public _LastMouseX: number = 0;
  public _LastMouseY: number = 0;
  public _IncBrushSizeCallback: any;
  public _IncBrushFeatherCallback: any;
  public _IncBrushStrengthCallback: any;
  public _SelectIndexItemCallback: any;
  public _SelectIndexItemNextCallback: any;
  public _SelectIndexItemPreviousCallback: any;
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

  constructor(
    canvas: HTMLCanvasElement,
    currentStage: any,
    user: any,
    preferences: any,
    buildNumber: string,
    file: any
  ) {
    this._BuildNumber = buildNumber;
    this._Graphics = new GraphicsWrapper(canvas);
    this._Canvas = canvas;
    this._EditorUI = currentStage;
    this._UserPreferences = preferences || {};
    this._User = user;
    this._Author = file.owner;
    this._Actor = null;
    this._StartedDrawingTime = performance.now();
    this._ExpandedHierarchyItems = new Set();
    // Initialization code goes here
  }

  // Add your class methods here

  cleanup() {
    // Cleanup code goes here
  }
}

class GraphicsWrapper {
  _graphics: Graphics;

  constructor(canvas: HTMLCanvasElement) {
    this._graphics = new Graphics(canvas);
    // r.default.call(this); // defines PieShader and stuff, also drawGrid and Selection Shader
  }
}
