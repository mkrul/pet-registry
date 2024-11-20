import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "../../frontend/AppRouter";
import { Provider, useDispatch } from "react-redux";
import { store } from "../../frontend/redux/store";
import { setCredentials, clearCredentials } from "../../frontend/redux/features/auth/authSlice";
import { authApiSlice } from "../../frontend/redux/features/auth/authApiSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        // Optionally, fetch user details from the backend
        // For example:
        try {
          const userResponse = await fetch(`http://${window.location.hostname}:3000/api/user`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (userResponse.ok) {
            const userData = await userResponse.json();
            dispatch(setCredentials({ user: userData, token }));
          } else {
            // Handle token expiration or invalidation
            dispatch(clearCredentials());
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
          dispatch(clearCredentials());
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  return (
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
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
