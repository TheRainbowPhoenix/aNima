<script lang="ts">
  import { glMatrix } from "gl-matrix";
  import Nima from "$lib/nima/Nima";
  import SoloSlide from "$lib/tests/soloSlide";
  import { onMount } from "svelte";

  let soloSlide: SoloSlide;

  let canvas: HTMLCanvasElement;

  onMount(() => {
    soloSlide = new SoloSlide(canvas);
    soloSlide.load("/res/SlidingSolo.nma", function (error) {
      if (error) {
        console.log("failed to load actor file...", error);
      }
    });

    soloSlide.setSize(684, 387);

    document.body.addEventListener(
      "dragover",
      function (evt: DragEvent | any) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = "copy";
      },
      true
    );

    document.body.addEventListener("dragleave", function (evt: DragEvent) {
      evt.stopPropagation();
      evt.preventDefault();
    });

    document.body.addEventListener(
      "drop",
      function (evt: DragEvent | any) {
        // Reload another actor by dragging and dropping the file in.
        evt.stopPropagation();
        evt.preventDefault();

        var files = evt.dataTransfer.files;

        soloSlide.load(files[0], function (error) {
          if (error) {
            console.log("oh no", error);
          }
        });
      },
      true
    );
  });
</script>

<svelte:head>
  <title>2Dimensions - SoloSlide</title>
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
  />
</svelte:head>
<!-- <script src="../build/Nima.min.js"></script>
    <script src="../build/gl-matrix.js"></script> -->

<canvas
  id="canvas"
  style="position:absolute;margin:0;padding:0;"
  bind:this={canvas}
/>

<style>
  :global(body) {
    padding: 0;
    margin: 0;
  }
</style>
