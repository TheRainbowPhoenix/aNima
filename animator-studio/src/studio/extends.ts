import studio, { IExtension } from "@theatre/studio";
import DebugPane from "./DebugPane.svelte";

export const extensionConfig: IExtension = {
  id: "debug-spine-extension",
  toolbars: {
    global(set, studio) {
      set([
        {
          type: "Icon",
          title: "Toogle debug",
          svgSource: "👁",
          onClick: () => {
            studio.createPane("debug-spine");
          },
        },
      ]);
    },
  },
  panes: [
    {
      class: "debug-spine",
      mount({ paneId, node }) {
        const debugPane = new DebugPane({
          target: node,
          props: {
            test: "Test from " + paneId,
            studio,
          },
        });
        return () => console.log("pane closed");
      },
    },
  ],
};
