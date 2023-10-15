import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import DummyRev from "$lib/revisions/rev_3_75_r_6_gotham";
import NewFile from "$lib/revisions/newFile";

const dummyRev = DummyRev;

// export async function load({ params, parent }) {
//   return {
//     post: dummyRev,
//   };
// }

export const GET: RequestHandler = ({ url, params }) => {
  if (params?.revision === "3-75-revis-6-gotham") {
    return json(dummyRev);
  } else {
    return json(NewFile);
  }

  throw error(404, "Not Found");
};
