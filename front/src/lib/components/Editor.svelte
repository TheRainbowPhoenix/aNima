<svelte:options accessors />

<script lang="ts">
  import { onMount, onDestroy, setContext } from "svelte";
  import StageCanvas from "$lib/fragments/StageCanvas.svelte";
  import FilesModal from "./modals/FilesModal.svelte";
  import PropertiesModal from "./modals/PropertiesModal.svelte";
  import CrashError from "./alerts/CrashError.svelte";
  import BrowserWarning from "./alerts/BrowserWarning.svelte";
  import HierarchyPanel from "./panels/HierarchyPanel.svelte";
  import SiteMenu from "./shared/SiteMenu.svelte";
  import GuideRuler from "./stage/GuideRuler.svelte";
  import AlertContainer from "./alerts/AlertContainer.svelte";
  import SelectionPanel from "./panels/SelectionPanel.svelte";
  import AnimationPanel from "./panels/AnimationPanel.svelte";
  import Toolbar from "./stage/Toolbar.svelte";
  import SettingsPanel from "./panels/SettingsPanel.svelte";
  import Tooltip from "./alerts/Tooltip.svelte";
  import ResizeGrabber from "./stage/ResizeGrabber.svelte";
  import {
    EditorUI,
    appKey,
    type EditorUIProps,
    editorNodeKey,
    stageRect,
    type RenderableElement,
  } from "./editor/EditorUI";

  export let props: EditorUIProps;

  let editorUI: EditorUI = new EditorUI();

  let dropDownPopupsDiv: HTMLDivElement;

  let isBrowserUnsupported = false; // !(browserIs.chrome || browserIs.firefox || browserIs.safari || browserIs.opera)

  let animationIsResizing = false;
  let contextMenus = [];
  let error = null;
  let exportOpen = false;
  let meshMode = false;
  let settingsOpen = false;
  let showBrowserWarning = isBrowserUnsupported;
  let showCrashError = false;
  let showExportToEngine = false;
  let showGuides = false;
  let siteMenuOpen = false;
  let isFilesModalOpen = false;
  let isFilesModalClosing = false;
  let isPropertiesModalOpen = false;
  let isPropertiesModalClosing = false;

  let renderedContextMenus: any[] = [];
  let exportScreen: any;

  let toolbar: Toolbar;

  let stagePanel: HTMLElement;

  let verticalRuler: HTMLElement;
  let horizontalRuler: HTMLElement;

  setContext(appKey, editorUI);

  const handleCanvasReady = (e: CustomEvent<{ canvas: HTMLCanvasElement }>) => {
    const canvas = e.detail.canvas;

    editorUI.onMount(canvas, props);
    console.log("editorUI ", editorUI);
  };

  const horizontalRulerReady = (e: CustomEvent<RenderableElement>) => {
    editorUI.horizontalRuler.set(e.detail);
  };
  const verticalRulerReady = (e: CustomEvent<RenderableElement>) => {
    editorUI.verticalRuler.set(e.detail);
  };

  const updateStageRect = () => {
    const { x, y, width, height } = stagePanel.getBoundingClientRect();

    stageRect.set({
      top: y,
      bottom: y + height,
      width: width /* + isMeshMode ? filePanelWidth : 0 */,
      height: height,
      left: x,
    });
  };

  onMount(async () => {
    // @ts-ignore
    // window.editor = {};
    console.log(props);

    if (editorUI) {
      editorUI.setStagePanel(stagePanel);

      updateStageRect();

      editorUI.visibleStageResize();
      // this.filePanel.setAnimationMode(
      //     this.isAnimationOpen ? this.state.animation : null
      //   ),
      //   this.resizePanels();
      // var e = this.props,
      //   t = e.file;
      // e.user.isPaid || t.isPublic
      //   ? t.showProperties && this.showPropertiesModal()
      //   : this.showPropertiesModal();

      // TODO: load file and stuff first
      editorUI.nima?.advance();
    }

    // todo generate renderedContextMenus
    // todo generate exportScreen
  });
</script>

<svelte:window
  on:resize={() => {
    updateStageRect();
  }}
/>

<StageCanvas on:ready={handleCanvasReady} />

<div class="UIPanels">
  {#if isFilesModalOpen || isFilesModalClosing}
    <FilesModal />
  {/if}

  {#if isPropertiesModalOpen || isPropertiesModalClosing}
    <PropertiesModal />
  {/if}

  {#if showCrashError}
    <CrashError />
  {/if}

  {#if showBrowserWarning}
    <BrowserWarning />
  {/if}

  <SiteMenu />

  <!-- id="HierarchyPanel" -->
  <HierarchyPanel />
  <ResizeGrabber />
  <!-- class="HierarchyResizer" -->
  <ResizeGrabber />
  <!-- class="SelectionResizer" -->
  <SelectionPanel />
  <!-- id="SelectionPanel"-->

  <div class="StagePanel" bind:this={stagePanel}>
    <AlertContainer />
    <GuideRuler on:ready={horizontalRulerReady} />
    <!-- class="TopGuideRuler" -->
    <GuideRuler vertical={true} on:ready={verticalRulerReady} />
    <!-- class="TopGuideRulerTicks" -->
  </div>

  <AnimationPanel />
  <!-- class="AnimationPanel" -->
  <Toolbar />
  <!--  id="Toolbar" -->
  <SettingsPanel />
  <!-- id="SettingsPanel" -->

  {#if exportScreen}
    <svelte:component this={exportScreen} />
  {/if}
  <!-- <div class="ModalWrapper ExportModal">...</div> -->

  <Tooltip bind:this={toolbar} />
  <!-- class="Tooltip" -->

  {#each renderedContextMenus as rcx}
    <!-- <div class="RightClickMenu" style="left: 441px; top: 881px;"> ... </div> -->
    <svelte:component this={rcx} />
  {/each}

  <div bind:this={dropDownPopupsDiv} />
</div>
