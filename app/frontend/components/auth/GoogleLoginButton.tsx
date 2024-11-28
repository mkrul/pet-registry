// src/components/auth/GoogleLoginButton.tsx

import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLoginMutation } from "../../redux/features/auth/authApiSlice";
import { useAppDispatch } from "../../redux/hooks";
import { setUser } from "../../redux/features/auth/authSlice";

const GoogleLoginButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const [googleLogin] = useGoogleLoginMutation();

  const handleSuccess = async (credentialResponse: any) => {
    try {
      const { credential } = credentialResponse;
      const result = await googleLogin({ token: credential }).unwrap();
      dispatch(setUser(result.user));
      window.location.href = "/";
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleError = () => {
    console.error("Google Login Failed");
  };

  return <GoogleLogin onSuccess={handleSuccess} onError={handleError} useOneTap />;
};

export default GoogleLoginButton;
