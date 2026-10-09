import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
// Fuentes servidas desde el propio sitio (sin peticiones a Google Fonts).
import "@fontsource-variable/lora";
import "@fontsource-variable/source-sans-3";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
