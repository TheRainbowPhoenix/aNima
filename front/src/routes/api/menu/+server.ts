import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";

export const GET: RequestHandler = ({ url, params }) => {
  return json([
    {
      items: [
        {
          type: "nimaFile",
          route: "/a/castor/files/nima/archer",
          label: "Archer.nma2d",
        },
        {
          type: "flareFile",
          route: "/a/castor/files/nima/archer",
          label: "Archer.flare2d",
        },
        {
          type: "newFile",
          product: "Nima",
        },
        {
          type: "newFile",
          product: "Flare",
        },
        {
          type: "newFile",
          product: "Spine",
        },
      ],
    },
  ]);
};
