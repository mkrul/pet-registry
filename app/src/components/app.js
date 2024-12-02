import { jsx as _jsx } from "react/jsx-runtime";
import { createRoot } from "react-dom/client";
// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';
// Render your React component instead
const root = createRoot(document.getElementById("app"));
root.render(_jsx("h1", { children: "Hello, world" }));
