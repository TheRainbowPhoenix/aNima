import { Application, Router, Status } from "https://deno.land/x/oak/mod.ts";

const port = 9000;

const app = new Application();
const router = new Router();

// error handler
app.use(async (ctx, next) => {
  ctx.response.headers.set("Content-Security-Policy", "worker-src 'self'");

  try {
    await next();
  } catch (err) {
    console.log(err);
  }
});

// the routes defined here
router.get("/", (context) => {
  context.response.body = "Hello world!";
});
// the routes defined here
router.get("/api/me", (context) => {
  context.response.body = {
    todo: "here",
    username: "username",
    name: "name",
    signedIn: true,
    isPaid: true,
    planType: "YEARLY",
    planStatus: "TODO",
    isAdmin: true,
    planExpires: 19999999999999999,
  };
});

router.get("/api/billing/plans", (context) => {
  context.response.body = {
    yearly: {
      price: 1200,
      id: "yearly_plan_id",
      billNow: true,
      nextBill: "2024-03-01",
    },
    monthly: {
      price: 1500,
      id: "monthly_plan_id",
      billNow: false,
      nextBill: "2024-04-01",
    },
  };
});

router.post("/api/files/:folder/:subfolder/rights", async (ctx) => {
  const { folder, subfolder } = ctx.params;
  context.response.body = { message: "OK" };
});

router.get("/error", (context) => {
  throw new Error("an error has been thrown");
});

router.get("/api/revisions/:filename", async (ctx) => {
  const { filename } = ctx.params;

  try {
    const filePath = `./data/revisions/${filename}.json`;

    // Read the JSON file
    const data = await Deno.readTextFile(filePath);

    // Parse JSON data
    const jsonData = JSON.parse(data);

    // Send JSON response
    ctx.response.body = jsonData;
  } catch (error) {
    ctx.response.status = 404;
    ctx.response.body = { error: "File not found" };
  }
});

router.get("/api/files/:folder/:subfolder/asset/:filename", async (ctx) => {
  const { folder, subfolder, filename } = ctx.params;
  const { cache } = ctx.request.url.searchParams;

  try {
    // Determine the file path based on the folder, subfolder, and filename
    let filePath = `./data/${folder}/${subfolder}/asset/${filename}.png`;

    // Check if the file is a PNG and adjust the path accordingly if cache=true
    if (cache === "true") {
      // const ext = filename.split(".").pop();
      // if (ext === "png") {
      //   filePath = `./data/${folder}/${subfolder}/asset/${filename.replace(
      //     ".png",
      //     ""
      //   )}`;
      // }
    }

    // Open the file and create a file stream
    const fileStream = await Deno.open(filePath);

    // Set response headers
    ctx.response.headers.set(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );

    // Send the file stream as the response
    ctx.response.body = fileStream;
  } catch (error) {
    ctx.response.status = 404;
    ctx.response.body = { error: "File not found" };
  }
});

router.get("/adobecloud-api/rendition", async ({ request, response }) => {
  const filePath = "data/testImg.png"; // Specify the path to your PDF file
  const file = await Deno.readFile(filePath);

  response.headers.set("Content-Type", "image/png");
  response.headers.set(
    "Content-Disposition",
    "attachment; filename=testImg.png"
  );

  // Send the PDF file as a blob
  response.body = file;
});

app.use(router.routes());
app.use(router.allowedMethods());

// static content
app.use(async (context, next) => {
  const root = `${Deno.cwd()}/public`;
  try {
    await context.send({ root });
  } catch {
    next();
  }
});

// page not found
app.use(async (context) => {
  context.response.status = Status.NotFound;
  context.response.body = `"${context.request.url}" not found`;
});

app.addEventListener("listen", ({ port }) =>
  console.log(`listening on port: ${port}`)
);

await app.listen({ port });
