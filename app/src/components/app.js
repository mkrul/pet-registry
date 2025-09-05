import { jsx as _jsx } from "react/jsx-runtime";
import { createRoot } from "react-dom/client";

document.body.innerHTML = '<div id="app"></div>';

const root = createRoot(document.getElementById("app"));
root.render(_jsx("h1", { children: "Hello, world" }));
