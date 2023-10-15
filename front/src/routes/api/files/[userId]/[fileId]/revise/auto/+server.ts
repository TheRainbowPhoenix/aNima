import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import DummyRev from "$lib/revisions/rev_3_75_r_6_gotham";

const dummyRev = DummyRev;

// export async function load({ params, parent }) {
//   return {
//     post: dummyRev,
//   };
// }

export const POST: RequestHandler = async ({ request }) => {
  const payload = await request.json();
  return json(payload);
};
