<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;

  let scriptData: any = data;
  scriptData["workers"] = {
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
  };

  let scriptContent = `var __props = ${JSON.stringify(scriptData)}`;

  let scriptsSrc = [
    "/lib/vendor.35e6000e3adc89a87857.js",
    "/lib/Components.3babdd1411e10d21748a.js",
    "/lib/NimaBase.64c5842622ab469779e1.js",
    "/lib/Nima.75f25c72b5b721e88cb1.js",
  ];
</script>

<svelte:head>
  <title>{data?.file?.name || "New File"}</title>
  <meta
    name="description"
    content="Bring your apps and games to life with real-time animation. Rive is a powerful design and animation tool, which allows designers and developers to easily add high-quality animation to Flutter, iOS, Android, Unity, OpenGL, C++, C#, OpenTK, HTML, JS, and other apps and games."
  />

  <meta name="viewport" content="width=device-width, user-scalable=no" />

  <link
    rel="stylesheet"
    type="text/css"
    href="/static/3049/styles/roboto.css"
  />

  <link
    rel="stylesheet"
    type="text/css"
    href="/static/3049/styles/normalize.css"
  />

  <link rel="stylesheet" type="text/css" href="/static/3049/styles/nima.css" />

  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#333333" />
  <meta name="msapplication-TileColor" content="#333333" />
  <meta name="theme-color" content="#ffffff" />
</svelte:head>

<div id="container" />
<div>
  {@html `<script>${scriptContent}</script>`}
  {#each scriptsSrc as scriptSrc}
    {@html `<script src="${scriptSrc}"></script>`}
  {/each}
</div>
