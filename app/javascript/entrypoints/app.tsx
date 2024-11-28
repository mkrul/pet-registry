import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppRouter from "../../frontend/AppRouter";
import Spinner from "../../frontend/components/shared/Spinner";
import { setUser } from "../../frontend/redux/features/auth/authSlice";

const App = () => {
  const dispatch = useDispatch();
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/config/google_client_id", {
          credentials: "include"
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGoogleClientId(data.client_id);
      } catch (err) {
        setError("Failed to fetch Google Client ID.");
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/auth/fetch_current_user", {
          credentials: "include"
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        dispatch(setUser(data.user));
      } catch (err) {
        console.error("Error fetching current user:", err);
        setUser(null);
      }
    };

    Promise.all([fetchConfig(), fetchCurrentUser()]).finally(() => {
      console.log("Loading complete");
      setLoading(false);
    });
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId || ""}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;
