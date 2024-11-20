// src/components/GoogleLoginButton.js

import React from "react";
import { GoogleLogin } from "react-google-login";
import { useDispatch } from "react-redux";
import { googleLogin } from "../actions/authActions";

const GoogleLoginButton = () => {
  const dispatch = useDispatch();

  // FETCH CLIENT ID

  const handleSuccess = (response: any) => {
    const { tokenId } = response;
    dispatch(googleLogin(tokenId));
  };

  const handleFailure = (response: any) => {
    console.error("Google Login Failed:", response);
  };

  return (
    <GoogleLogin
      clientId="your_google_client_id"
      buttonText="Login with Google"
      onSuccess={handleSuccess}
      onFailure={handleFailure}
      cookiePolicy={"single_host_origin"}
    />
  );
};

export default GoogleLoginButton;
