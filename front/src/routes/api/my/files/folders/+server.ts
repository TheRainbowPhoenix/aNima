import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { get } from "svelte/store";
import { folders } from "$lib/api/store";

export const GET: RequestHandler = ({ url, params }) => {
  return json({
    folders: get(folders),
    sortOptions: [
      { name: "Recent", route: "/api/my/files/recent/" },
      { name: "Oldest", route: "/api/my/files/oldest/" },
      { name: "A - Z", route: "/api/my/files/a-z/" },
      { name: "Z - A", route: "/api/my/files/z-a/" },
    ],
  });
};
