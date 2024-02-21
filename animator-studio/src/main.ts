import "./app.css";
import App from "./App.svelte";
import { game } from "./game/boot";

const app = new App({
  target: document.getElementById("app"),
  props: { game },
});

export default app;
