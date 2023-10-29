import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const prerender = true;
export const ssr = true;
export const csr = true;

let dummyFile = {
  environment: "gotham",
  buildNumber: "3049",
  user: { signedIn: true, id: 5, username: "username" },
  stripe: "pk_live_Ll558WThbg2hS1vpf3D7O6m9",
  fb: "173377143125979",
  staticPath: "/static/3049",
  file: {
    id: 75,
    name: "Archer",
    revision: "3-75-revis-6-gotham",
    updated: 1655330548,
    access: "write",
    isPublic: true,
    showProperties: false,
    canFork: false,
    isForked: false,
    license: null,
    preferences: {
      editor: {
        workspace: "AnimateButton",
        filePanelWidth: 494,
        grabberY: 282,
      },
    },
    product: "nima",
    favicon: "nima",
    previewPage: "/a/castor/files/nima/archer/preview",
    owner: {
      id: 3,
      name: "Luigi Rosso",
      username: "castor",
      avatar: "/cdn/avatars/3-1-1539908803-local",
    },
  },
  preferences: {},
  workers: {
    "AtlasWorker.js": "/lib/AtlasWorker.8850a38412c48ff43c08.js",
    "AutoMeshWorker.js": "/lib/AutoMeshWorker.f39b2aba7179fef1b8d0.js",
    "AutoWeightWorker.js": "/lib/AutoWeightWorker.526472280e8a93772d2d.js",
    "BitmapWorker.js": "/lib/BitmapWorker.dd50e5d072371145e00a.js",
    "BodyMovinImporter.js": "/lib/BodyMovinImporter.0ca3225cc6186571f5d0.js",
    "FlareZipImporter.js": "/lib/FlareZipImporter.0792c8bc551e8eab077a.js",
    "ImageSequenceWorker.js":
      "/lib/ImageSequenceWorker.aafc6b696412528abb9d.js",
    "PsdImporter.js": "/lib/PsdImporter.a05472d3e966fa2ab242.js",
    "SkinWorker.js": "/lib/SkinWorker.0d32fe06953971885126.js",
    "SvgImporter.js": "/lib/SvgImporter.0af4b2818b75987607fd.js",
    "ZipImporter.js": "/lib/ZipImporter.b5f633b1629d1e0dde33.js",
  },
};

const emptyFile = {
  environment: "gotham",
  buildNumber: "3049",
  user: { signedIn: true, id: 5, username: "username" },
  stripe: "pk_live_Ll558WThbg2hS1vpf3D7O6m9",
  fb: "173377143125979",
  staticPath: "/static/3049",
  file: {
    id: 42,
    name: "New File",
    revision: "3-42-revis-1-gotham",
    updated: 1655330548,
    access: "write",
    isPublic: true,
    showProperties: false,
    canFork: true,
    isForked: false,
    license: null,
    preferences: {},
    product: "nima",
    favicon: "nima",
    previewPage: "/a/username/files/nima/newfile/preview",
    owner: {
      id: 3,
      name: "Username",
      username: "username",
      avatar: "/cdn/avatars/3-1-1539908803-local",
    },
  },
  preferences: {},
  workers: {
    "AtlasWorker.js": "/lib/AtlasWorker.8850a38412c48ff43c08.js",
    "AutoMeshWorker.js": "/lib/AutoMeshWorker.f39b2aba7179fef1b8d0.js",
    "AutoWeightWorker.js": "/lib/AutoWeightWorker.526472280e8a93772d2d.js",
    "BitmapWorker.js": "/lib/BitmapWorker.dd50e5d072371145e00a.js",
    "BodyMovinImporter.js": "/lib/BodyMovinImporter.0ca3225cc6186571f5d0.js",
    "FlareZipImporter.js": "/lib/FlareZipImporter.0792c8bc551e8eab077a.js",
    "ImageSequenceWorker.js":
      "/lib/ImageSequenceWorker.aafc6b696412528abb9d.js",
    "PsdImporter.js": "/lib/PsdImporter.a05472d3e966fa2ab242.js",
    "SkinWorker.js": "/lib/SkinWorker.0d32fe06953971885126.js",
    "SvgImporter.js": "/lib/SvgImporter.0af4b2818b75987607fd.js",
    "ZipImporter.js": "/lib/ZipImporter.b5f633b1629d1e0dde33.js",
  },
};

export const load: PageLoad = ({ params }) => {
  return dummyFile;

  // if (params.username === "castor" && params.filename === "archer") {
  //   return dummyFile;
  // } else {
  //   return emptyFile;
  // }

  throw error(404, "Not found");
};
