<script lang="ts">
  import { onMount } from "svelte";
  import { type Writable, writable } from "svelte/store";

  export let game: () => Phaser.Game;

  let gameInstance: Writable<Phaser.Game> = writable();

  onMount(async () => {
    const g = game();
    gameInstance.set(g);
    // @ts-ignore
    window.game = g;
  });
</script>

<main>Svelte</main>

<style>
</style>
