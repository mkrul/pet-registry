import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import ErrorBoundary from "./components/main/ErrorBoundary";
import App from "./App";

const root = document.getElementById("root");

const app = (
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>
);

ReactDOM.createRoot(root!).render(app);
