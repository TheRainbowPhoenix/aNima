<script lang="ts">
  import { onMount, getContext, createEventDispatcher } from "svelte";

  export let name: string;
  export let icon: string = "/images/symbol-defs.svg#icon-mesh";

  let hover = false;
  let toggleOn = false;

  const dispatch = createEventDispatcher();

  function mouseOver() {
    hover = true;
  }

  function mouseOut() {
    hover = false;
  }

  function mouseDown(event: MouseEvent) {
    event.stopPropagation();

    dispatch("toggle", !toggleOn, event);
    toggleOn = !toggleOn;
  }

  function setToggleValue(value: boolean) {
    toggleOn = value;
  }
</script>

<div
  class="VisibilityToggle"
  on:mousedown={mouseDown}
  on:mouseenter={mouseOver}
  on:mouseleave={mouseOut}
  on:keydown={() => {}}
  id={name}
  role="button"
  tabindex="0"
>
  <svg class={toggleOn ? "ToggleIcon ToggleIconActive" : "ToggleIcon"}>
    <use xlink:href={icon} />
  </svg>
  <div class="ToggleHighlight {toggleOn ? 'ToggleVisible' : 'ToggleHidden'}" />
</div>
