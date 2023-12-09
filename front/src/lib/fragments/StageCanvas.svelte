<script lang="ts">
  import Nima from "$lib/nima/Nima";
  import type { Rect } from "$lib/nima/common";
  import { onMount, onDestroy } from "svelte";

  export let user: any;
  export let preferences: any;
  export let buildNumber: any;
  export let file: any;

  let ddid = 0;
  let dropDownPopups = [];
  let isMeshMode = false;
  let nima: any = null;
  let error: any = null;
  let tooltipRef: any;

  // Initialize preferences with default values
  let _Preferences = {
    filePanelWidth: 300,
    selectionPanelWidth: 200,
    animationPanelHeight: 260,
  };

  // Create a tooltip object with methods
  const tooltip = {
    enter: (e: any) => {
      if (tooltipRef) tooltipRef.showFor(e);
    },
    leave: (e: any) => {
      if (tooltipRef) tooltipRef.hideFor(e);
    },
    click: (e: any) => {
      if (tooltipRef) tooltipRef.hideImmediatelyFor(e);
    },
  };

  // Helper function to show files modal
  const showFilesModal = (path: any) => {
    // Implement your logic to show the files modal here
  };

  let currentStage: any;
  let canvas: HTMLCanvasElement;

  onMount(() => {
    currentStage = {
      // EditorUI
      todo: "props here",
      getStageRect: (): Rect => canvas.getBoundingClientRect(), // TODo
    };

    ddid = 0;
    dropDownPopups = [];
    isMeshMode = false;

    // Attempt to create a canvas element
    canvas.style.display = "none";
    try {
      // Initialize nima using Svelte's reactive statements
      nima = new Nima(
        canvas,
        currentStage,
        user,
        preferences,
        buildNumber,
        file
      ); // 1209

      // Initialize shortcuts, keyMap, and other settings
      //   const shortcuts = new u.default(nima);
      //   const keyMap = new c.default(
      //     shortcuts.onAction,
      //     shortcuts.onActionReleased
      //   );

      //   // Configure keyMap based on the platform
      //   if (true === l.default.mac) {
      //     keyMap.parse(d.default.OSX);
      //   } else {
      //     keyMap.parse(d.default.Windows);
      //   }

      //   // Set the toolType
      //   nima.stage.toolType = A.default;

      //   // Retrieve and set preferences
      //   const i = nima.getPreference("editor") || {};
      //   _Preferences = {
      //     ..._Preferences,
      //     ...i,
      //   };

      //   // Handle showing files modal based on the URL hash
      //   if (
      //     window.location.hash &&
      //     window.location.hash.indexOf("#files") === 0
      //   ) {
      //     showFilesModal(window.location.hash.toString());
      //   }
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
  });

  onDestroy(() => {
    // Perform cleanup when the component is unmounted
    if (nima) {
      // Implement any necessary cleanup for the nima instance
    }
  });
</script>

<canvas bind:this={canvas} class="Stage" style="display: none;" />
