<script lang="ts">
  import Nima from "$lib/nima/Nima";
  import { onMount } from "svelte";
  import Archer from "$lib/tests/archer";

  let archer: Archer;

  let canvas: HTMLCanvasElement;

  onMount(() => {
    archer = new Archer(canvas);
    archer.load("/res/Archer.nma", function (error) {
      if (error) {
        console.log("failed to load actor file...", error);
      }
    });

    archer.setSize(684, 387);

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

        archer.load(files[0], function (error) {
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
  <title>2Dimensions - Archer</title>
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
  />
</svelte:head>

<canvas
  id="canvas"
  style="position:absolute;margin:0;padding:0;"
  bind:this={canvas}
/>
<audio id="sound">
  <source src="/res/step.mp3" type="audio/mp3" />
</audio>

<style>
  :global(body) {
    padding: 0;
    margin: 0;
  }
</style>
