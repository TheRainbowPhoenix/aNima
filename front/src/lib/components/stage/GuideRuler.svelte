<script lang="ts">
  import {
    createEventDispatcher,
    getContext,
    onDestroy,
    onMount,
  } from "svelte";
  import {
    getState,
    stageRect,
    type RenderableElement,
  } from "../editor/EditorUI";
  import type Nima from "$lib/nima/Nima";

  export let visible: boolean = true;
  export let vertical: boolean = false;

  let rootClassName = vertical ? "LeftGuideRuler" : "TopGuideRuler";

  let canvas: HTMLCanvasElement;

  let ctx: CanvasRenderingContext2D | null;

  interface HoverGuide {
    world: number;
    screenOffset: number;
    localOffset?: number;
  }

  interface BaseGuide {
    x: number;
    y: number;
    w: number;
    h: number;
    o: number;
  }

  let guides: BaseGuide[] = [];
  let permanentGuides: HoverGuide[] = [];

  let hoverGuide: HoverGuide = {
    world: 0,
    screenOffset: 0,
  };
  let hitGuide = null;
  let dragGuide = null;

  const context = getState();

  const unSub = stageRect.subscribe((s) => {
    drawTicks();
  });

  const dispatch = createEventDispatcher();

  onMount(() => {
    if (canvas) {
      ctx = canvas.getContext("2d");
      drawTicks();

      const renderable: RenderableElement = {
        draw: drawTicks,
      };

      dispatch("ready", renderable);
    }
  });

  onDestroy(() => {
    unSub();
  });

  function mouseMove(event: MouseEvent) {
    // Implementation for mouseMove function
  }

  function mouseLeave(event: MouseEvent) {
    // Implementation for mouseLeave function
  }

  function mouseDown(event: MouseEvent) {
    // Implementation for mouseDown function
  }

  function endDrag(event: DragEvent) {
    // Implementation for endDrag function
  }

  function drawTicks() {
    if (!canvas) return;

    const { nima } = context;
    const { screenScale, translation } = nima.stage;
    let { width, height, bottom, top, left } = nima.getStageRect();

    if (ctx && width > 0 && height > 0) {
      if (screenScale !== 1) {
        width *= screenScale;
        height *= screenScale;
        bottom *= screenScale;
        top *= screenScale;
        left *= screenScale;
      }

      const padding = 20 * screenScale;
      const tickSize = 30 * screenScale;
      const rulerWidth = vertical ? tickSize : width + 2 * padding - tickSize;
      const rulerHeight = vertical ? height + 2 * padding - tickSize : tickSize;
      const rulerLength = width + 2 * padding - tickSize;

      if (canvas.width != rulerWidth || canvas.height != rulerHeight) {
        canvas.width = rulerWidth;
        canvas.height = rulerHeight;
      }

      const rulerStartX = left - padding + tickSize;
      const rulerStartY = window.innerHeight * screenScale - bottom - padding;

      let tickSpacing = 16 * screenScale;
      let majorTickInterval = 64 * screenScale;
      let tickScale = tickSpacing * (nima.stage.scale || 1);

      while (tickScale < 16 * screenScale) {
        tickScale *= 2;
        tickSpacing *= 2;
        majorTickInterval *= 2;
        tickScale = tickSpacing * (nima.stage.scale || 1);
      }

      const tickCount =
        Math.ceil(vertical ? height / tickScale : width / tickScale) + 2;
      let tickPosition = 0;
      let rulerOffset = 0;

      if (vertical) {
        const rulerYOffset = (rulerStartY - translation[1]) / screenScale;
        rulerOffset = rulerYOffset - (rulerYOffset % tickSpacing);
        tickPosition =
          (-rulerYOffset % tickSpacing) * screenScale - tickSpacing;
        rulerOffset -= tickSpacing;
      } else {
        const rulerXOffset = (rulerStartX - translation[0]) / screenScale;
        rulerOffset = rulerXOffset - (rulerXOffset % tickSpacing);
        tickPosition =
          (-rulerXOffset % tickSpacing) * screenScale - tickSpacing;
        rulerOffset -= tickSpacing;
      }

      const textPadding = 10 * screenScale;

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.font = `${10 * screenScale}px Roboto`;

      if (vertical) {
        ctx.fillRect(0, 0, tickSize, 1);
        ctx.rotate(-Math.PI / 2);
        ctx.translate(-rulerHeight, 0);
      } else {
        ctx.fillRect(0, 0, 1, tickSize);
      }

      const tickPositions = [];

      console.log("tickPosition", tickPosition, "tickSpacing", tickSpacing);

      for (let i = 0; i < tickCount; i++) {
        tickPosition += tickSpacing;
        const roundedTickPosition = Math.round(rulerOffset);
        const flooredTickPosition = Math.floor(tickPosition);

        if (roundedTickPosition % majorTickInterval === 0) {
          ctx.fillRect(flooredTickPosition, 0, 1, tickSize);
          tickPositions.push(roundedTickPosition, flooredTickPosition);
        } else {
          ctx.fillRect(
            flooredTickPosition,
            tickSize - textPadding,
            1,
            textPadding
          );
        }

        rulerOffset += tickSpacing;
      }

      ctx.fillStyle = "rgba(255,255,255,0.6)";

      for (let i = 0; i < tickPositions.length; i += 2) {
        const tickValue = tickPositions[i];
        const tickPosition = tickPositions[i + 1];
        ctx.fillText(
          formatThousands(tickValue),
          Math.floor(tickPosition) + 5 * screenScale,
          13 * screenScale
        );
      }

      ctx.fillStyle = "rgba(87,165,224,1.0)";
      guides.length = 0;

      if (hoverGuide) {
        let guidePosition = 0;

        if (vertical) {
          const stageY =
            (window.innerHeight * screenScale -
              hoverGuide.screenOffset * screenScale -
              translation[1]) /
            nima.stage.scale;
          const stageOffset = -(
            stageY * nima.stage.scale +
            translation[1] -
            window.innerHeight * screenScale
          );
          const guideY = window.innerHeight * screenScale - stageOffset;

          hoverGuide.world = stageY;
          guidePosition = rulerHeight - (stageOffset - tickSize);
          guides.push({
            x: rulerStartX,
            y: guideY,
            w: rulerLength,
            h: 1,
            o: 0.5,
          });
        } else {
          const stageX =
            (hoverGuide.screenOffset * screenScale - translation[0]) /
            nima.stage.scale;
          const stageOffset =
            stageX * nima.stage.scale + translation[0] - rulerStartX;
          guidePosition = stageOffset;
          hoverGuide.world = stageX;
          guides.push({
            x: stageOffset + rulerStartX,
            y: 0,
            w: 1,
            h: window.innerHeight * screenScale - tickSize,
            o: 0.5,
          });
        }

        ctx.fillRect(guidePosition, 0, 1, tickSize);

        for (let i = 0; i < permanentGuides.length; i++) {
          const guide = permanentGuides[i];
          let guidePosition = 0;

          if (vertical) {
            let stageY = guide.world;

            if (stageY === undefined) {
              stageY =
                (window.innerHeight * screenScale -
                  guide.screenOffset * screenScale -
                  translation[1]) /
                nima.stage.scale;
              guide.world = stageY;
            }

            const stageOffset = -(
              stageY * nima.stage.scale +
              translation[1] -
              window.innerHeight * screenScale
            );
            const guideY = window.innerHeight * screenScale - stageOffset;

            guide.screenOffset = stageOffset;
            guidePosition = guide.localOffset =
              rulerHeight - (stageOffset - tickSize);

            guides.push({
              x: rulerStartX,
              y: guideY,
              w: rulerLength,
              h: 1,
              o: 1,
            });
          } else {
            let stageX = guide.world;

            if (stageX === undefined) {
              stageX =
                (guide.screenOffset * screenScale - translation[0]) /
                nima.stage.scale;
              guide.world = stageX;
            }

            const stageOffset =
              stageX * nima.stage.scale + translation[0] - rulerStartX;
            guidePosition = stageOffset;
            guide.screenOffset = stageOffset;
            guide.localOffset = guidePosition;

            guides.push({
              x: stageOffset + rulerStartX,
              y: 0,
              w: 1,
              h: window.innerHeight * screenScale - tickSize,
              o: 1,
            });
          }

          ctx.fillRect(guidePosition, 0, 1, tickSize);
        }
      }

      // Implementation for drawTicks function
    }
  }

  const formatThousands = (n: number, fixed: number = 0) => {
    const formattedValue = n.toFixed(fixed);
    const integerPart = n | 0;
    const negative = n < 0 ? 1 : 0;
    const decimalPart = ("" + Math.abs(n - integerPart).toFixed(fixed)).substr(
      2,
      fixed
    );
    let integerString = "" + integerPart;
    let integerLength = integerString.length;
    let result = "";

    while ((integerLength -= 3) > negative) {
      result = "," + integerString.substr(integerLength, 3) + result;
    }

    return (
      integerString.substr(0, integerLength + 3) +
      result +
      (decimalPart ? "." + decimalPart : "")
    );
  };

  const noop = () => {};
</script>

<div style="display: {visible ? 'block' : 'none'}" class={rootClassName}>
  <div class={rootClassName + "Ticks"}>
    <canvas
      bind:this={canvas}
      on:mousedown={mouseDown}
      on:mousemove={mouseMove}
      on:mouseleave={mouseLeave}
      class="GuideRulerTicks"
    />
  </div>
</div>
