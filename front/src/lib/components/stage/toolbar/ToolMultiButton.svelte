<script lang="ts">
  import { onMount, getContext, createEventDispatcher } from "svelte";

  export let cssID: string;
  export let tip: any;
  export let data: any;

  let hover = false;
  let isOpen = false;
  let popupOpacity = 0;
  let togglesSizeCalc: any;
  let togglesWidth = 0;
  let timeout: number = 0;
  let activeStates = [0, 0, 0];
  let isMouseOver = false;

  const dispatch = createEventDispatcher();

  function mouseOver() {
    if (!isOpen) {
      // const tooltip = getContext("tooltip");
      // tooltip.enter(this);
    }
    hover = true;
  }

  function mouseDown() {
    // const tooltip = getContext("tooltip");
    // tooltip.click(this);
    open();
  }

  function open() {
    // TODO: use svelte click-outside !
    window.addEventListener("mousedown", close, true);
    timeout && clearTimeout(timeout);
    popupOpacity = 1;
    isOpen = true;
  }

  function close() {
    window.removeEventListener("mousedown", close, true);
    isOpen = false;
    timeout = setTimeout(() => {
      popupOpacity = 0;
    }, 125);
  }

  function togglesWidthCalc() {
    if (togglesSizeCalc) {
      togglesWidth = togglesSizeCalc.getBoundingClientRect().width;
    }
  }

  function onToggleSelected(option: any) {
    if (data?.radio && data?.options) {
      // Handle radio behavior
      data?.options.forEach((opt: any) => {
        if (opt !== option && opt.activeState()) {
          opt.toggle();
        }
      });
    }
    option.toggle();
    data?.closeOnSelect && close();

    dispatch("change", option);
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

    dispatch("selected", event);
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
  <div
    class={isOpen
      ? "ToolSelectedPopup ToolSelectedPopupOpen"
      : "ToolSelectedPopup"}
    style="opacity: {popupOpacity}; width: {isOpen
      ? togglesWidth + 60 + 'px'
      : ''}; left: {isOpen ? -togglesWidth + 'px' : ''}"
  >
    <div
      class="ToggleWrapper"
      style="width: {isOpen ? togglesWidth + 'px' : ''}"
    >
      <div bind:this={togglesSizeCalc} class="TogglesSizeCalc">
        {#each data?.options as option, index (index)}
          <!-- l.default not div -->
          <div
            class={option.className}
            on:click={() => onToggleSelected(option)}
            on:mouseenter={() => (option.isMouseOver = true)}
            on:mouseleave={() => (option.isMouseOver = false)}
            on:keydown={() => {}}
            role="button"
            tabindex="0"
          >
            {#if option.useTxtLabel}
              <div class="ToolIcon">{option.txtLabel}</div>
            {:else}
              <svg class="ToolIcon{option.isMouseOver ? ' ToolIconHover' : ''}">
                <use xlink:href={option.icon} />
              </svg>

              <div
                class="OptionHighlight {[
                  'OptionHighlightNone',
                  'OptionHighlightAll',
                  'OptionHighlightSome',
                ][option.activeState()]}"
              />
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>

  <svg class={isOpen ? "ToolPopupArrow ToolPopupArrowOpen" : "ToolPopupArrow"}>
    <use xlink:href="/images/symbol-defs.svg#icon-popup-arrow" />
  </svg>

  {#if data?.showLegend}
    <div class="OptionStatuses">
      <div
        class={["OptionStatusOff", "OptionStatus", "OptionStatusHalf"][
          activeStates[0]
        ]}
      />
      <div
        class={["OptionStatusOff", "OptionStatus", "OptionStatusHalf"][
          activeStates[1]
        ]}
      />
      {#if data?.options?.length > 2}
        <div
          class={["OptionStatusOff", "OptionStatus", "OptionStatusHalf"][
            activeStates[2]
          ]}
        />
      {/if}
    </div>
  {/if}

  {data?.extraIcon || ""}

  <svg class="ToolIcon{hover || isOpen ? ' ToolIconFlyActive' : ''}">
    <use xlink:href={data?.icon} />
  </svg>
</div>
