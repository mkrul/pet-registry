// src/components/Auth/GoogleLoginButton.tsx

import React from "react";
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from "react-google-login";
import { useGoogleLoginMutation } from "../../redux/features/auth/authApiSlice";
import { useAppDispatch } from "../../redux/hooks";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [googleLogin, { isLoading, error }] = useGoogleLoginMutation();

  const handleSuccess = async (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if ("tokenId" in response) {
      try {
        const result = await googleLogin({ tokenId: response.tokenId }).unwrap();
        dispatch(setCredentials({ user: result.user, token: result.token }));
        // Redirect to the dashboard or intended page
        navigate("/dashboard");
      } catch (err: any) {
        console.error("Login failed:", err);
      }
    } else {
      console.error("Received an offline response from Google");
    }
  };

  const handleFailure = (response: any) => {
    console.error("Google login failed:", response);
  };

  // src/components/Auth/GoogleLoginButton.tsx

  // ... existing imports and code ...

  return (
    <div>
      <GoogleLogin
        clientId="your_google_client_id" // Replace with your actual Client ID
        buttonText="Login with Google"
        onSuccess={handleSuccess}
        onFailure={handleFailure}
        cookiePolicy={"single_host_origin"}
      />
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Login failed. Please try again.</p>}
    </div>
  );
};

export default GoogleLoginButton;
