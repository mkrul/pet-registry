console.log("🔥 Application.jsx: File is being executed!");

import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "../../src/store/store";
import ErrorBoundary from "../../src/app/ErrorBoundary";
import App from "./Main";

console.log("🚀 Application.jsx: Starting to load React app");

const rootElement = document.getElementById("root");
console.log("🔍 Application.jsx: Root element found:", rootElement);

if (!rootElement) {
  console.error("❌ Application.jsx: Root element not found!");
  throw new Error("Root element not found");
}

console.log("📦 Application.jsx: Creating React root");
const root = createRoot(rootElement);
console.log("📦 Application.jsx: React root created:", root);
console.log("📦 Application.jsx: Root element after createRoot:", rootElement);

console.log("🎨 Application.jsx: Rendering React app");
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>
);

console.log("✅ Application.jsx: React app rendered successfully");
