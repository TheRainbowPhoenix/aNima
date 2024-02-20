import Graphics from "$lib/runtime/Graphics";
import type { Rect } from "./common";
import { Stage } from "./Stage";
import { TextureFilteringFlags } from "$lib/nima/common";
import type { EditorUI } from "$lib/components/editor/EditorUI";
import { GraphicsWrapper } from "./graphics/wrapper";

export default class Nima {
  public _BuildNumber: string;
  public _Graphics: GraphicsWrapper;
  public _Canvas: HTMLCanvasElement;
  public _EditorUI: EditorUI;
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
    editorUI: EditorUI,
    user: any,
    preferences: any,
    buildNumber: string,
    fileData: any
  ) {
    this._BuildNumber = buildNumber;
    this._Graphics = new GraphicsWrapper(canvasElem);
    this._Canvas = canvasElem;
    this._EditorUI = editorUI;
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

  public get stage(): Stage {
    return this._Stage;
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

  // KV events
  advance() {
    // TODO
    this.draw();
    // this._EditorUI.resizePanels();
  }

  draw() {
    // renamed from "draw"
    this._Stage.draw();
    this._EditorUI.drawRulers();

    var guides = this._EditorUI.getGuides();
    if (guides && guides.length) {
      this._Stage.drawGuides(guides);
    }
  }
}
