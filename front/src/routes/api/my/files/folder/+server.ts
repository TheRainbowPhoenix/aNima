import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { folders } from "$lib/api/store";

export const POST: RequestHandler = async ({ request }) => {
  const { name, parent, order } = await request.json(); // {name: "New Folder", parent: 1, order: -1}

  folders.update((f) => {
    return [
      ...(Array.isArray(f) ? f : []),
      {
        name: name,
        parent: parent,
        order: order,
      },
    ];
  });

  return json({ success: true });
};
