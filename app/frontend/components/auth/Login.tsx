// src/components/Auth/Login.tsx

import React from "react";
import GoogleLoginButton from "./GoogleLoginButton";

const Login: React.FC = () => (
  <div className="login-page">
    <h2>Login</h2>
    <GoogleLoginButton />
    {/* Optionally, add traditional login form */}
  </div>
);

export default Login;
