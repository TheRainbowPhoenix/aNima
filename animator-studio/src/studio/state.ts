import { writable } from "svelte/store";

export const projectState = writable<object>({
  sheetsById: {
    "Sheet 1": {
      staticOverrides: {
        byObject: {
          "Heading 1": {
            opacity: 0.9936708860759493,
          },
        },
      },
      sequence: {
        subUnitsPerUnit: 30,
        length: 10,
        type: "PositionalSequence",
        tracksByObject: {
          "Heading 1": {
            trackData: {
              LrJ3eujCAE: {
                type: "BasicKeyframedTrack",
                keyframes: [
                  {
                    id: "i-s2GT5JFm",
                    position: 0,
                    connectedRight: true,
                    handles: [0.5, 1, 0.882, 0],
                    value: 0,
                  },
                  {
                    id: "I3Suv35jmV",
                    position: 3.433,
                    connectedRight: true,
                    handles: [0.055, 0.969, 0.82, -0.031],
                    value: 96,
                  },
                  {
                    id: "M_00uVAeuK",
                    position: 5.6,
                    connectedRight: true,
                    handles: [0.087, 1.01, 0.5, 0],
                    value: 0,
                  },
                ],
              },
              "9JzZUrUSb7": {
                type: "BasicKeyframedTrack",
                __debugName: 'Heading 1:["opacity"]',
                keyframes: [
                  {
                    id: "EfAPcjrYAy",
                    position: 0,
                    connectedRight: true,
                    handles: [0.5, 1, 0.5, 0],
                    value: 0.9936708860759493,
                  },
                  {
                    id: "hZ-tUkMP4C",
                    position: 2.367,
                    connectedRight: true,
                    handles: [0.5, 1, 0.5, 0],
                    value: 0,
                  },
                  {
                    id: "D5PA_XGfS6",
                    position: 5.6,
                    connectedRight: true,
                    handles: [0.5, 1, 0.5, 0],
                    value: 0.9936708860759493,
                  },
                ],
              },
            },
            trackIdByPropPath: {
              '["y"]': "LrJ3eujCAE",
              '["opacity"]': "9JzZUrUSb7",
            },
          },
        },
      },
    },
  },
  definitionVersion: "0.4.0",
  revisionHistory: ["vLg01lxRrpP8eGsS"],
});
