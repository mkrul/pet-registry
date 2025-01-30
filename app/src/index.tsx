import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import App from "./App";

console.log("Initial Redux state:", store.getState());

const root = document.getElementById("root");
console.log("Root element found:", { root, hasRoot: !!root });

const app = (
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

console.log("Rendering app with Provider");

ReactDOM.createRoot(root!).render(app);

console.log("App rendered");
