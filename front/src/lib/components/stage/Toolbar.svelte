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

  <!--

  <div class="DefaultToolbar" style="transform: {state.meshMode || state.weightsMode ? 'translate3D(100%, 0, 0)' : null}">
    <div class="ToolGroup">
      <Tool
        type={S.default}
        cssID="TranslateTool"
        icon="/images/symbol-defs.svg#icon-move"
        onSelected={() => toolSelected(S.default)}
        isSelected={state.selectedTool === S.default}
        tip={{ label: "Translate", action: h.default.Actions.TranslateTool }}
      />
      <Tool
        type={P.default}
        cssID="RotateTool"
        icon="/images/symbol-defs.svg#icon-rotate"
        onSelected={() => toolSelected(P.default)}
        isSelected={state.selectedTool === P.default}
        tip={{ label: "Rotate", action: h.default.Actions.RotateTool }}
      />
      <Tool
        type={E.default}
        cssID="ScaleTool"
        icon="/images/symbol-defs.svg#icon-scale"
        onSelected={() => toolSelected(E.default)}
        isSelected={state.selectedTool === E.default}
        tip={{ label: "Scale", action: h.default.Actions.ScaleTool }}
      />
      <Tool
        type={O.default}
        cssID="IKTool"
        icon="/images/symbol-defs.svg#icon-arrow-divert"
        onSelected={() => toolSelected(O.default)}
        isSelected={state.selectedTool === O.default}
        tip={{ label: "IK Pose", action: h.default.Actions.IKTool }}
      />
    </div>
    <ToolGroup isStageTool={true} ref={setCreateGroup} addClass="CreateTools" iconHref="/images/symbol-defs.svg#icon-plus" selectedType={context.nima.stage.toolType} tip={{ label: "Create Tools" }}>
      <Tool
        type={T.default}
        cssID="CreateBoneTool"
        icon="/images/symbol-defs.svg#icon-bone-add"
        onSelected={() => toolSelected(T.default)}
        isSelected={state.selectedTool === T.default}
        tip={{ label: "Create Bone", action: h.default.Actions.BoneTool }}
      />
      <Tool
        type={x.default}
        cssID="CreateNodeTool"
        icon="/images/symbol-defs.svg#icon-node-add"
        onSelected={() => toolSelected(x.default)}
        isSelected={state.selectedTool === x.default}
        tip={{ label: "Create Node", action: h.default.Actions.NodeTool }}
      />
      <Tool
        type={I.default}
        cssID="CreateColliderTool"
        icon="/images/symbol-defs.svg#icon-collider-add"
        onSelected={() => toolSelected(I.default)}
        isSelected={state.selectedTool === I.default}
        tip={{ label: "Create Collider", action: h.default.Actions.ColliderTool }}
      />
      <Tool
        type={C.default}
        icon="/images/symbol-defs.svg#icon-solo-add"
        onSelected={() => toolSelected(C.default)}
        isSelected={state.selectedTool === C.default}
        tip={{ label: "Create Solo Node", action: h.default.Actions.SoloTool }}
      />
    </ToolGroup>
    <ToolGroup addClass="SelectionFilters" showActive={true} iconHref="/images/symbol-defs.svg#icon-select-all" selectedType={state.selectedFilter && state.selectedFilter.constructor} tip={{ label: "Selection Modes", actions: [
      { label: "Next", action: h.default.Actions.NextSelectionFilter },
      { label: "Prev", action: h.default.Actions.PreviousSelectionFilter },
    ] }}>
      <Tool
        type={D.default}
        cssID="SelectionFilter"
        icon="/images/symbol-defs.svg#icon-select-all"
        onSelected={() => filterSelected(D.default)}
        isSelected={state.selectedFilter && state.selectedFilter.constructor === D.default}
        tip={{ label: "Select Anything", action: h.default.Actions.AllSelectionFilter }}
      />
      <Tool
        type={M.default}
        cssID="BoneSelectionFilter"
        icon="/images/symbol-defs.svg#icon-select-bones"
        onSelected={() => filterSelected(M.default)}
        isSelected={state.selectedFilter && state.selectedFilter.constructor === M.default}
        tip={{ label: "Select Bones", action: h.default.Actions.BoneSelectionFilter }}
      />
      <Tool
        type={A.default}
        cssID="ImageSelectionFilter"
        icon="/images/symbol-defs.svg#icon-select-images"
        onSelected={() => filterSelected(A.default)}
        isSelected={state.selectedFilter && state.selectedFilter.constructor === A.default}
        tip={{ label: "Select Images", action: h.default.Actions.ImageSelectionFilter }}
      />
      <Tool
        type={j.default}
        cssID="VertexSelectionFilter"
        icon="/images/symbol-defs.svg#icon-select-vertices"
        onSelected={() => filterSelected(j.default)}
        isSelected={state.selectedFilter && state.selectedFilter.constructor === j.default}
        tip={{ label: "Select Vertices", action: h.default.Actions.VertexSelectionFilter }}
      />
    </ToolGroup>
    <ToolGroup cssID="VisibilityOptions" data={state.visibilityPopup} onChange={visibilityOptionsChanged} tip={{ label: "Visibility Options" }} />
    <ToolGroup cssID="AxisOptions" data={state.axisPopup} onChange={visibilityOptionsChanged} tip={{ label: "Axis Options" }} />
    <ToolGroup cssID="GridOptions" data={state.gridPopup} tip={{ label: "Grid Options" }} onChange={gridOptionsChanged} />
    <div class="ToolGroup">
      <ZoomInput value={state.zoom} valueChanged={zoomInputChanged} tip={{ label: "Zoom", actions: [
        { label: "In", action: h.default.Actions.ZoomIn },
        { label: "Out", action: h.default.Actions.ZoomOut },
        { label: "Actual Size", action: h.default.Actions.Zoom100 },
        { label: "Fit", action: h.default.Actions.ZoomFit },
      ] }} />
    </div>
    <div class="ToolGroup">
      {state.canCopy && (
        <Tool
          cssID="ExportButton"
          icon="/images/symbol-defs.svg#icon-export"
          onSelected={props.onGotoExport}
          tip={{ label: "Export" }}
        />
      )}
      <Tool
        cssID="SettingsButton"
        isActive={props.settingsOpen}
        onSelected={props.onSettingsToggled}
        icon={props.settingsOpen ? "/images/symbol-defs.svg#icon-cog-selected" : "/images/symbol-defs.svg#icon-cog"}
        tip={{ label: "Settings" }}
      />
    </div>
  </div>
   -->
</div>
