// import { Loader } from "phaser";

import { RiveObject } from "./RiveObject";
import { RiveObjectFactory } from "./RiveObjectFactory";

interface RivFileConfig {
  type: "rive";
  key: string;
  url: string;
  extension: "riv";
}

class RivFile extends Phaser.Loader.FileTypes.BinaryFile {
  onProcess(): void {
    this.state = Phaser.Loader.FILE_PROCESSING;
    this.data = this.xhrLoader.response;
    RiveObjectFactory.processRivFile(this.key, new Uint8Array(this.data)).then(
      () => {
        this.onProcessComplete();
      }
    );
  }
}

function riveLoaderCallback(
  this: Phaser.Loader.LoaderPlugin,
  key: string,
  url: string
): Phaser.Loader.LoaderPlugin {
  const fileConfig: RivFileConfig = {
    type: "rive",
    key,
    url,
    extension: "riv",
  };
  this.addFile(new RivFile(this, fileConfig));

  return this;
}

class RivePackFile extends Phaser.Loader.File {
  constructor(
    loader: Phaser.Loader.LoaderPlugin,
    fileConfig: Phaser.Types.Loader.FileConfig
  ) {
    super(loader, fileConfig);
    this.type = "rivePackFile";
  }

  onProcess() {
    if (this.state !== Phaser.Loader.FILE_POPULATED) {
      this.state = Phaser.Loader.FILE_PROCESSING;

      this.data = JSON.parse(this.xhrLoader.responseText);
    }
    this.processPackFile();
    this.onProcessComplete();
  }

  private processPackFile() {
    this.data.forEach((value) => {
      const files = value.files;
      if (!files || !Array.isArray(files)) {
        return;
      }
      files.forEach((file) => {
        const absoluteUrl = new URL(
          file.url,
          document.location.toString()
        ).toString();
        const key = file.key;
        this.loader.rive(key, absoluteUrl);
      });
    });
  }
}

function rivePackloaderCallback(
  this: Phaser.Loader.LoaderPlugin,
  key: string,
  url: string
): Phaser.Loader.LoaderPlugin {
  const config = {
    key,
    url,
  };

  const fileConfig = {
    type: "rivePackFile",
    key,
    url,
    extension: "json",
    config,
    cache: this.cacheManager.json,
  };
  this.addFile(new RivePackFile(this, fileConfig));

  return this;
}

export class RiveLoaderPlugin extends Phaser.Plugins.ScenePlugin {
  cache: Phaser.Cache.BaseCache;
  riveTextures: Phaser.Cache.BaseCache;
  drawDebug: boolean;

  constructor(
    scene: Phaser.Scene,
    pluginManager: Phaser.Plugins.PluginManager,
    pluginKey: string
  ) {
    super(scene, pluginManager, pluginKey);

    var game = pluginManager.game;

    this.cache = game.cache.addCustom("rive");
    this.riveTextures = game.cache.addCustom("riveTextures");
    this.drawDebug = false;

    pluginManager.registerFileType("rivePack", rivePackloaderCallback);
    pluginManager.registerFileType("rive", riveLoaderCallback);
  }

  add(
    key: string,
    x?: number,
    y?: number,
    artboard?: string,
    stateMachine?: string
  ): RiveObject | undefined {
    if (this.scene) {
      var riveGO = new RiveObject(
        this.scene,
        key,
        x,
        y,
        artboard,
        stateMachine
      );
      console.log(this);
      // riveGO.displayList.add(riveGO);
      riveGO.addToDisplayList();
      riveGO.addToUpdateList();

      // this.displayList.add(riveGO);
      // this.updateList.add(riveGO);
      return riveGO;
    }
    return;
  }
}

declare module "phaser" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Loader {
    interface LoaderPlugin {
      rivePack(key?: string, url?: string): this;
      rive(key: string, url?: string): this;
    }
  }
}
