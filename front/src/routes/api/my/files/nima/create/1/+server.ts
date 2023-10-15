import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { get } from "svelte/store";
import { folders } from "$lib/api/store";

export const POST: RequestHandler = ({ url, params }) => {
  return json([]);
};
