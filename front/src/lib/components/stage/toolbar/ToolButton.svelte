<script lang="ts">
  import { onMount, getContext, createEventDispatcher } from "svelte";

  export let type: string;
  export let cssID: string;
  export let icon: string;
  export let isSelected: boolean = false;
  export let isActive: boolean = false;
  export let tip: any;

  let hover = false;

  const dispatch = createEventDispatcher();

  function mouseOver() {
    // const tooltip = getContext("tooltip");
    // tooltip.enter(this);
    hover = true;
  }

  function mouseOut() {
    // const tooltip = getContext("tooltip");
    // tooltip.leave(this);
    hover = false;
  }

  function click(event: MouseEvent) {
    event.stopPropagation();
    // const tooltip = getContext("tooltip");
    // tooltip.click(this);

    dispatch("selected", type, event);
  }
</script>

<div
  class="ToolButton"
  on:click={click}
  on:mouseenter={mouseOver}
  on:mouseleave={mouseOut}
  on:keydown={() => {}}
  id={cssID}
  role="button"
  tabindex="0"
>
  <div class="ToolSelected" style="opacity: {isSelected ? 1 : 0}" />

  <svg
    class={isSelected ? "ToolIcon ToolIconActive" : "ToolIcon"}
    style="fill: {isActive ? '#000' : null}"
  >
    <use xlink:href={icon} />
  </svg>
</div>
