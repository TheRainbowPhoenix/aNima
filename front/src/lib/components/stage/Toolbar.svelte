<script lang="ts">
  import { onMount } from "svelte";
  import ToolButton from "./toolbar/ToolButton.svelte";
  import ToolToggle from "./toolbar/ToolToggle.svelte";
  import ToolMultiButton from "./toolbar/ToolMultiButton.svelte";

  export let settingsOpen: boolean = false;

  export let weightsMode: boolean = true;
  export let weightVisibility: boolean = true;

  export let meshMode: boolean = false;
  export let meshVisibility: boolean = false;

  export let selectedTool: any = null;

  let toolbar: HTMLDivElement;

  let meshVisibilityRef: ToolToggle;

  function toggleMeshVisibility() {
    meshVisibility = !meshVisibility;
  }

  function toolSelected(toolType: any) {
    selectedTool = toolType;
  }

  function visibilityOptionsChanged(ev: CustomEvent) {
    console.log(ev); // "visibilityOptionsChanged"
  }

  let visibilityPopup = {
    icon: "/static/3049/images/symbol-defs.svg#icon-eye",
    showLegend: true,
    options: [
      {
        icon: "/static/3049/images/symbol-defs.svg#icon-picture",
        className: "ImageToggle",
        activeState: function () {
          return 1;
          // return c.disableDraw
          // ? 0
          // : c.mode == p.default.RenderModes.Regular
          // ? 1
          // : 2;
        },
        toggle: function () {
          // var e = c.disableDraw
          //     ? 0
          //     : c.mode == p.default.RenderModes.Regular
          //     ? 1
          //     : 2;
          // switch ((e = (e + 1) % 3)) {
          //     case 0:
          //     (c.disableDraw = true),
          //         (c.mode = p.default.RenderModes.Regular);
          //     break;
          //     case 1:
          //     (c.disableDraw = false),
          //         (c.mode = p.default.RenderModes.Regular);
          //     break;
          //     case 2:
          //     (c.disableDraw = false),
          //         (c.mode = p.default.RenderModes.Dim);
          // }
        },
        tip: { label: "Show Images" },
        isMouseOver: false,
      },
      {
        icon: "/static/3049/images/symbol-defs.svg#icon-bone",
        className: "BoneToggle",
        activeState: function () {
          return 1;
          // return n[0].disableDraw ? 0 : 1;
        },
        toggle: function () {
          // var e = !n[0].disableDraw,
          //     t = true,
          //     i = false,
          //     r = void 0;
          // try {
          //     for (
          //     var o, a = n[Symbol.iterator]();
          //     !(t = (o = a.next()).done);
          //     t = true
          //     ) {
          //     o.value.disableDraw = e;
          //     }
          // } catch (e) {
          //     (i = true), (r = e);
          // } finally {
          //     try {
          //     !t && a.return && a.return();
          //     } finally {
          //     if (i) throw r;
          //     }
          // }
        },
        tip: { label: "Show Bones" },
        isMouseOver: false,
      },
      {
        icon: "/static/3049/images/symbol-defs.svg#icon-collider",
        className: "BoneToggle",
        activeState: function () {
          // return d.disableDraw ? 0 : 1;
          return 1;
        },
        toggle: function () {
          // d.disableDraw = !d.disableDraw;
        },
        tip: { label: "Show Colliders" },
        isMouseOver: false,
      },
    ],
  };
</script>

<div
  id="Toolbar"
  bind:this={toolbar}
  style="right: {settingsOpen ? '200px' : '0px'}"
>
  {#if weightsMode}
    <div
      class="WeightsToolbar"
      style="opacity: {weightsMode ? '1' : '0'}; visibility: {weightVisibility
        ? 'visible'
        : 'hidden'}"
    >
      <div class="ToolGroup">
        <ToolButton
          type={"b.default"}
          cssID="PaintWeightTool"
          icon="/images/symbol-defs.svg#icon-brush"
          on:selected={() => toolSelected("TODO: b.default")}
          isSelected={selectedTool === "TODO: b.default"}
          tip={{ label: "Paint Weights", action: null }}
        />
        <ToolButton
          type={"w.default"}
          cssID="VertexWeightTool"
          icon="/images/symbol-defs.svg#icon-select-vertices"
          on:selected={() => toolSelected("w.default")}
          isSelected={selectedTool === "w.default"}
          tip={{ label: "Set Vertex Weight", action: null }}
        />
      </div>
      <div class="ToolGroup">
        <ToolToggle
          name="MeshVisibility"
          on:toggle={toggleMeshVisibility}
          bind:this={meshVisibilityRef}
        />
      </div>
      <!-- c.default => input -->
      <ToolMultiButton
        cssID="VisibilityOptions"
        data={visibilityPopup}
        on:change={visibilityOptionsChanged}
        tip={{ label: "Visibility Options" }}
      />
      <div class="ToolGroup">
        <!-- <ZoomInput
          value={zoom}
          valueChanged={zoomInputChanged}
          tip={{
            label: "Zoom",
            actions: [
              { label: "In", action: h.default.Actions.ZoomIn },
              { label: "Out", action: h.default.Actions.ZoomOut },
              { label: "Actual Size", action: h.default.Actions.Zoom100 },
              { label: "Fit", action: h.default.Actions.ZoomFit },
            ],
          }}
        /> -->
      </div>
    </div>
  {/if}
</div>
