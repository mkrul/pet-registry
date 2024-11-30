import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "../../frontend/redux/store";
import ErrorBoundary from "../../frontend/components/common/ErrorBoundary";
import App from "./App";

// Render the application to the DOM
const rootElement = document.getElementById("root") as HTMLElement;

if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </Provider>
    </React.StrictMode>
  );
}
