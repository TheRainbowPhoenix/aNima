import type { Rect } from "$lib/nima/common";
import Nima from "$lib/nima/Nima";
import { getContext, setContext } from "svelte";
import { get, writable, type Writable } from "svelte/store";

// export const width = writable(window.innerWidth);
// export const height = writable(window.innerHeight);
// export const pixelRatio = writable(window.devicePixelRatio);
// export const context = writable();
// export const canvas = writable();
// export const time = writable(0);

export const stageRect = writable<Rect>({
  top: 0,
  bottom: 0,
  width: 0,
  height: 0,
  left: 0,
});

// export const props = deriveObject({
//   context,
//   canvas,
//   width,
//   height,
//   pixelRatio,
// });

export const appKey = Symbol();
export const editorNodeKey = Symbol("editorNodeKey");

export const getState = (): { nima: Nima } => {
  const app: any = getContext(appKey);
  return app;
};
export const getEditorNode = () => {
  const node: HTMLDivElement = getContext(editorNodeKey);
  return node;
};

interface NimaUser {
  id: number;
  username: string;
}

interface FileOwner extends NimaUser {
  name: string;
  avatar: string;
}

interface SignedUser extends NimaUser {
  signedIn: boolean;
}

// TODO: types states
type NimaPreferences = Record<string, any>;

interface NimaFile {
  id: number;
  name: string;
  revision: string;
  updated: number;
  access: "read" | "write"; // Assuming access can be either "read" or "write"
  isPublic: boolean;
  showProperties: boolean;
  canFork: boolean;
  isForked: boolean;
  license: string | null; // Assuming license can be a string or null
  preferences: NimaPreferences; // Assuming preferences can be any key-value pairs
  product: string;
  favicon: string;
  previewPage: string;
  owner: FileOwner;
}

export interface EditorUIProps {
  environment?: string;
  staticPath?: string;
  stripe?: string;
  fb?: string;
  user: SignedUser;
  preferences: NimaPreferences;
  buildNumber: string;
  file: NimaFile;
  workers: Record<string, string>;
}

export interface EditorStates {
  animationIsResizing: boolean;
  contextMenus: any[];
  error: null;
  exportOpen: boolean;
  meshMode: boolean;
  settingsOpen: boolean;
  showBrowserWarning: boolean;
  showCrashError: boolean;
  showExportToEngine: boolean;
  showGuides: boolean;
  siteMenuOpen: boolean;
  isFilesModalOpen: boolean;
  isFilesModalClosing: boolean;
  isPropertiesModalOpen: boolean;
  isPropertiesModalClosing: boolean;
}

export interface RenderableElement {
  draw: () => void;
}

export class EditorUI {
  public nima?: Nima;
  public state: EditorStates;

  public ddid = 0;
  public dropDownPopups = [];
  public isMeshMode = false;
  public listeningForMenuClose = false;
  private _PreferencesTimeout = null;

  // Initialize preferences with default values
  private _Preferences: NimaPreferences = {
    filePanelWidth: 300,
    selectionPanelWidth: 200,
    animationPanelHeight: 260,
  };

  public filePanelWidth = 300;
  public selectionPanelWidth = 200;
  public animationPanelHeight = 260;

  public readonly verticalRuler: Writable<RenderableElement | null>;
  public readonly horizontalRuler: Writable<RenderableElement | null>;
  protected stagePanel: HTMLElement | null;

  constructor() {
    this.state = {
      animationIsResizing: false,
      contextMenus: [],
      error: null,
      exportOpen: false,
      meshMode: false,
      settingsOpen: false,
      showBrowserWarning: false,
      showCrashError: false,
      showExportToEngine: false,
      showGuides: false,
      siteMenuOpen: false,
      isFilesModalOpen: false,
      isFilesModalClosing: false,
      isPropertiesModalOpen: false,
      isPropertiesModalClosing: false,
    };

    this.verticalRuler = writable(null);
    this.horizontalRuler = writable(null);
    this.stagePanel = null;
  }

  onMount(stageCanvas: HTMLCanvasElement, props: EditorUIProps) {
    this.ddid = 0;
    this.dropDownPopups = [];
    this.isMeshMode = false;

    // @ts-ignore
    window.editor = this;

    let isBrowserUnsupported = false; // !(browserIs.chrome || browserIs.firefox || browserIs.safari || browserIs.opera)
    this.listeningForMenuClose = false;
    this.state.showBrowserWarning = isBrowserUnsupported;

    try {
      this.nima = new Nima(
        stageCanvas,
        this,
        props.user,
        props.preferences,
        props.buildNumber,
        props.file
      ); // 1209

      this._Preferences = this.nima.getPreference("editor") || {};
      this._PreferencesTimeout = null;

      this.filePanelWidth = this._Preferences.filePanelWidth || 300;
      this.selectionPanelWidth = this._Preferences.selectionPanelWidth || 200;
      this.animationPanelHeight = this._Preferences.animationPanelHeight || 260;

      // Handle showing files modal based on the URL hash
      if (
        window.location.hash &&
        window.location.hash.indexOf("#files") === 0
      ) {
        // showFilesModal(window.location.hash.toString());
      }

      //   // Retrieve and set preferences
      //   const i = nima.getPreference("editor") || {};
      //   _Preferences = {
      //     ..._Preferences,
      //     ...i,
      //   };
    } catch (err) {
      console.error("Nima boot error", err);
      //   if (err && err.constructor === M.default) {
      //     error = H.default.WebGLDisabled;
      //   } else {
      //     const t =
      //       (err &&
      //         err.constructor &&
      //         err.constructor.toString &&
      //         err.constructor.toString()) ||
      //       "unknown";
      //     console.warn(
      //       "Nima failed to instance due to an unhandled error. Error constructor " +
      //         t
      //     );
      //     error = H.default.Unknown;
      //   }
    }

    // Initialize shortcuts, keyMap, and other settings
    //   const shortcuts = new shortcutsMap(nima);
    //   const keyMap = new keyBindingHandler(
    //     shortcuts.onAction,
    //     shortcuts.onActionReleased
    //   );

    // TODO: tooltip show / hide

    //   // Configure keyMap based on the platform
    //   if (true === l.default.mac) {
    //     keyMap.parse(d.default.OSX);
    //   } else {
    //     keyMap.parse(d.default.Windows);
    //   }

    //   // Set the toolType
    //   nima.stage.toolType = A.default;
  }

  onDestroy() {
    window.removeEventListener("resize", this.windowResize);
    if (this.nima) {
      // this.nima.removeEventListener("ready", this.nimaReady);
      this.nima.cleanup();
      this.nima = undefined;
    }
  }

  setStagePanel(stagePanel: HTMLElement) {
    this.stagePanel = stagePanel;
  }
  nimaReady() {
    // this.nima.loadFile();
  }

  visibleStageResize() {
    this.updateStageRect(false);
  }

  windowResize() {
    this.visibleStageResize();
  }

  getStageRect(): Rect {
    return get(stageRect);
  }

  drawRulers() {
    if (this.verticalRuler) {
      get(this.verticalRuler)?.draw();
    }
    if (this.horizontalRuler) {
      get(this.horizontalRuler)?.draw();
    }
  }

  updateStageRect(dispatch: boolean) {
    // stageRect.set(stagePanel.getBoundingClientRect());
    // var t = this.stagePanel.getBoundingClientRect();
    // TODO
  }

  setHorizontalRuler(horizontalRuler: HTMLElement) {
    // this.horizontalRuler = horizontalRuler;
  }
  setVerticalRuler(verticalRuler: HTMLElement) {
    // this.verticalRuler = verticalRuler;
  }

  getGuides(): any[] {
    return [];
  }
  getStageRec() {
    // Rect
    return null;
  }
}

export function editorNodeUI(node: HTMLDivElement) {
  setContext(editorNodeKey, node);

  // const handleClick = (event: MouseEvent) => {
  //   if (!node.contains(event.target)) {
  //     node.dispatchEvent(new CustomEvent("outclick"));
  //   }
  // };

  // document.addEventListener("click", handleClick, true);

  return {
    destroy() {
      // document.removeEventListener("click", handleClick, true);
    },
  };
}
