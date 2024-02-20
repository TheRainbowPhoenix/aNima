<script lang="ts">
  import Nima from "$lib/nima/Nima";
  import type { Rect } from "$lib/nima/common";
  import { onMount, onDestroy, createEventDispatcher } from "svelte";

  let nima: any = null;
  let error: any = null;
  let tooltipRef: any;

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

  let canvas: HTMLCanvasElement;

  const dispatch = createEventDispatcher();

  onMount(() => {
    // Attempt to create a canvas element
    canvas.style.display = "none";

    dispatch("ready", {
      canvas,
    });
  });

  onDestroy(() => {
    // Perform cleanup when the component is unmounted
    // if (nima) {
    // Implement any necessary cleanup for the nima instance
    // }
  });
</script>

<canvas bind:this={canvas} class="Stage" style="display: none;" />
