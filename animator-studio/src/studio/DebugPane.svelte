<script lang="ts">
  import { IProject } from "@theatre/core";
  import { IStudio } from "@theatre/studio";
  import { onMount } from "svelte";
  import { currentProject } from ".";

  export let test: string = "test";
  export let studio: IStudio;

  let duration: string = "3";

  let project: IProject = $currentProject;

  onMount(() => {
    console.log(project);
    console.log(studio);
  });

  const doPlay = () => {
    project
      .sheet("Hasumi")
      .sequence.play({
        iterationCount: Infinity,
        range: [0, parseInt(duration) || 6],
      });
  };
  const doPause = () => {
    project.sheet("Hasumi").sequence.pause();
  };
</script>

<div class="debug-pane">
  <h1>{test}</h1>
  <p>Duration: {duration}</p>
  <input type="text" bind:value={duration} />
  <button
    on:click={() => {
      duration += 0.1;
    }}>+</button
  >

  <button on:click={doPlay}>Play</button>
  <button on:click={doPause}>Pause</button>
</div>

{@html `
<style>
  .debug-pane {
    display: flex-inline;
    flex-direction: column;
    margin: 1rem;
  }

  .debug-pane button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #1a1a1a;
    color: white;
    cursor: pointer;
    transition: border-color 0.25s;
}
</style>
`}
