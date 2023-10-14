<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import StageCanvas from "$lib/fragments/StageCanvas.svelte";

  export let props: any = {};

  let editorUI: any;

  onMount(async () => {
    // @ts-ignore
    window.editor = {};
    console.log(editorUI);
  });
</script>

<StageCanvas {...props} bind:this={editorUI} />

<div id="container">
  <!-- TODO UIPanels -->
</div>
