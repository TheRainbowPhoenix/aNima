<script lang="ts">
  import "./app.css";

  import { onMount } from "svelte";
  import { type Writable, writable } from "svelte/store";

  import studio from "@theatre/studio";
  import { IProject } from "@theatre/core";

  import {
    DEBUG_BONES,
    DEBUG_REGION_ATTACHMENTS,
    DEBUG_BOUNDING_BOXES,
    DEBUG_MESH_HULL,
    DEBUG_MESH_TRIANGLES,
    DEBUG_PATHS,
    DEBUG_SKELETON_XY,
    DEBUG_CLIPPING,
  } from "./plugins/spine-webgl";
  import { exportJSON } from "./spines/exporter";
  import { initialize } from "./studio";
  import { extensionConfig } from "./studio/extends";

  export let game: () => Phaser.Game;

  let gameInstance: Writable<Phaser.Game> = writable();

  let debugMask: number = 0;

  let drawDebug: boolean = false;
  const updateDebug = () => {
    // @ts-ignore
    (window.currentSpine ? window.currentSpine : window.hasumi).setDebugMask(
      drawDebug ? debugMask : 0
    );
  };

  let project: IProject;

  onMount(async () => {
    const g = game();
    gameInstance.set(g);
    // @ts-ignore
    window.game = g;
    // @ts-ignore
    window.exportJSON = exportJSON;

    console.log(studio);

    // @ts-ignore
    window.studio = studio;

    studio.extend(extensionConfig);
    studio.initialize();
    project = initialize();

    /* Export anything :
      
    spns = window.hasumi.scene.children.list.filter(
      (x) => x.type === "spine"
    );
    window.exportJSON(spns[0]);

    */
  });

  const exportSpine = () => {
    console.log(studio.createContentOfSaveFile("Spine"));

    // @ts-ignore
    const g: SpineGameObject = window.hasumi;
    exportJSON(g);
  };
</script>

<main>
  <div class="actions">
    <button on:click={exportSpine}> 📥 Export </button>

    <button
      on:click={() => {
        if (debugMask === 0) {
          drawDebug = false;
        } else {
          drawDebug = !drawDebug;
        }

        updateDebug();
      }}
      >{drawDebug ? "☑" : "☐"} Debug Spine
    </button>

    <button
      on:click={() => {
        debugMask ^= DEBUG_MESH_TRIANGLES;
        updateDebug();
      }}
      >{(debugMask & DEBUG_MESH_TRIANGLES) !== 0 ? "☑" : "☐"} Mesh Triangles
    </button>

    <button
      on:click={() => {
        debugMask ^= DEBUG_BOUNDING_BOXES;
        updateDebug();
      }}
      >{(debugMask & DEBUG_BOUNDING_BOXES) !== 0 ? "☑" : "☐"} Bounding Boxes
    </button>

    <button
      on:click={() => {
        debugMask ^= DEBUG_BONES;
        updateDebug();
      }}
      >{(debugMask & DEBUG_BONES) !== 0 ? "☑" : "☐"} Bones
    </button>

    <button
      on:click={() => {
        debugMask ^= DEBUG_REGION_ATTACHMENTS;
        updateDebug();
      }}
      >{(debugMask & DEBUG_REGION_ATTACHMENTS) !== 0 ? "☑" : "☐"} Region Attachments
    </button>

    <button
      on:click={() => {
        debugMask ^= DEBUG_MESH_HULL;
        updateDebug();
      }}
      >{(debugMask & DEBUG_MESH_HULL) !== 0 ? "☑" : "☐"} Mesh Hull
    </button>

    <button
      on:click={() => {
        debugMask ^= DEBUG_PATHS;
        updateDebug();
      }}
      >{(debugMask & DEBUG_PATHS) !== 0 ? "☑" : "☐"} Paths
    </button>

    <button
      on:click={() => {
        debugMask ^= DEBUG_SKELETON_XY;
        updateDebug();
      }}
      >{(debugMask & DEBUG_SKELETON_XY) !== 0 ? "☑" : "☐"} Skeleton XY
    </button>

    <button
      on:click={() => {
        debugMask ^= DEBUG_CLIPPING;
        updateDebug();
      }}
      >{(debugMask & DEBUG_CLIPPING) !== 0 ? "☑" : "☐"} Clipping
    </button>
  </div>
</main>

<style>
  .actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>
