import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "../../frontend/AppRouter";
import { Provider } from "react-redux";
import { store } from "../../frontend/redux/store";
import { GoogleOAuthProvider } from "@react-oauth/google";

const App = () => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <GoogleOAuthProvider clientId="your_google_client_id">
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </GoogleOAuthProvider>
      </Provider>
    </React.StrictMode>
  );
};

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}

export default App;
