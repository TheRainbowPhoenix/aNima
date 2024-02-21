<script lang="ts">
  import { onMount } from "svelte";
  import { type Writable, writable } from "svelte/store";

  export let game: () => Phaser.Game;

  let gameInstance: Writable<Phaser.Game> = writable();

  let drawMeshTriangles: boolean = false;
  let drawDebug: boolean = false;

  onMount(async () => {
    const g = game();
    gameInstance.set(g);
    // @ts-ignore
    window.game = g;
  });
</script>

<main>
  <div class="actions">
    <label>
      Debug Spine
      <input
        type="checkbox"
        on:change={() => {
          window.spine.drawDebug = !drawDebug;
        }}
        bind:checked={drawDebug}
      />
    </label>

    <label>
      Mesh Triangles
      <input
        type="checkbox"
        on:change={() => {
          window.spine.skeletonDebugRenderer.drawMeshTriangles =
            drawMeshTriangles;
        }}
        bind:checked={drawMeshTriangles}
      />
    </label>
  </div>
</main>

<style>
  .actions {
    display: flex;
    flex-direction: column;
  }
</style>
