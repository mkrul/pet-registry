// src/components/auth/OAuthHandler.tsx

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../redux/features/auth/authSlice";

const OAuthHandler: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/auth/fetch_current_user", {
          credentials: "include"
        });
        const data = await response.json();
        dispatch(setUser(data.user));
        navigate("/");
      } catch (err) {
        console.error("Error fetching current user:", err);
        dispatch(setUser(null));
        navigate("/login");
      }
    };

    fetchCurrentUser();
  }, [dispatch, navigate]);

  return <div>Loading...</div>;
};

export default OAuthHandler;
