<script lang="ts">
  import { onMount, onDestroy } from "svelte";
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

  export let props: any = {};

  let editorUI: any;

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

  onMount(async () => {
    // @ts-ignore
    window.editor = {};
    console.log(props);
    console.log(editorUI);

    // todo generate renderedContextMenus
    // todo generate exportScreen
  });
</script>

<StageCanvas {...props} bind:this={editorUI} />

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

  <div class="StagePanel">
    <AlertContainer />
    <GuideRuler />
    <!-- class="TopGuideRuler" -->
    <GuideRuler />
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
