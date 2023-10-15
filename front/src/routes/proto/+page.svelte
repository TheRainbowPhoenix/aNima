<script lang="ts">
  import { glMatrix } from "gl-matrix";
  import Nima from "$lib/nima/Nima";
  import { onMount } from "svelte";
  import Proto from "$lib/tests/proto";

  let proto: Proto;

  let canvas: HTMLCanvasElement;

  onMount(() => {
    proto = new Proto(canvas);
    proto.load("/res/proto/json/Proto.nma", function (error) {
      if (error) {
        console.log("failed to load actor file...", error);
      }
    });

    proto.setSize(684, 387);

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

        proto.load(files[0], function (error) {
          if (error) {
            console.log("oh no", error);
          }
        });
      },
      true
    );
  });

  let hits: any[] = [];

  const doHit = (ev: MouseEvent) => {
    hits.push({
      x: ev.clientX,
      y: ev.clientY,
    });
    hits = [...hits];

    setTimeout(() => {
      hits = hits.slice(1);
    }, 2 * 1000);
  };
</script>

<svelte:head>
  <title>2Dimensions - proto</title>
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

<div
  class="hitBox"
  on:click={doHit}
  on:keydown={() => {}}
  role="button"
  tabindex="-1"
>
  {#each hits as hit}
    <span class="hit" style={`left: ${hit.x - 50}px; top: ${hit.y - 20}px`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 25 10"
      >
        <defs>
          <linearGradient id="a">
            <stop offset="0" stop-color="#f0381f" />
            <stop offset="1" stop-color="#c4215f" />
          </linearGradient>
          <linearGradient
            xlink:href="#a"
            id="b"
            x1="14"
            x2="14"
            y1="1043.3622"
            y2="1049.3622"
            gradientTransform="translate(0 1.0009047)"
            gradientUnits="userSpaceOnUse"
          />
        </defs>
        <g color="#000">
          <path
            fill="#65252b"
            d="M0 1042.3613v10h16v-4h1v4h6v-4h2v-6z"
            font-family="sans-serif"
            font-weight="400"
            overflow="visible"
            style="line-height:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000;text-transform:none;block-progression:tb;white-space:normal;isolation:auto;mix-blend-mode:normal;solid-color:#000;solid-opacity:1"
            transform="translate(0 -1042.3622)"
          />
          <path
            fill="url(#b)"
            d="M1 1043.3622v8h4v-2h1v2h4v-8H6v3H5v-3H1zm10 0v8h4v-8h-4zm5 0v4h2v4h4v-4h2v-4h-8z"
            overflow="visible"
            style="isolation:auto;mix-blend-mode:normal;solid-color:#000;solid-opacity:1"
            transform="translate(0 -1042.3622)"
          />
        </g>
      </svg>
    </span>
  {/each}
</div>

<style>
  :global(body) {
    padding: 0;
    margin: 0;
  }

  .hitBox {
    display: flex;
    justify-content: center;
    align-items: center;

    position: fixed;
    top: 10%;
    height: 85%;
    width: 50%;
    left: 25%;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 50% 50% 10% 10%;
  }

  .hit {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
  }

  .hit svg {
    width: 100px;
    animation: hitMe 2s linear 1 forwards;
  }

  @keyframes hitMe {
    0% {
      opacity: 1;
      transform: scale(0.8);
    }
    10% {
      opacity: 1;
      transform: scale(1.6);
    }
    100% {
      opacity: 0.2;
      transform: scale(0);
    }
  }
</style>
