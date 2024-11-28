// src/pages/auth/LoginPage.tsx

import React from "react";
import GoogleLoginButton from "../../components/auth/GoogleLoginButton";

const LoginPage: React.FC = () => {
  return (
    <div className="login-page">
      <h2>Login</h2>
      <GoogleLoginButton />
    </div>
  );
};

export default LoginPage;
