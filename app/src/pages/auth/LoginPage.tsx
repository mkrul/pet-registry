import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/features/auth/authApiSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setUser } from "../../redux/features/auth/authSlice";
import { navigateToHome } from "../../utils/navigation";
import Notification from "../../components/common/Notification";
import { setNotification } from "../../redux/features/notifications/notificationsSlice";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ user: { email, password } }).unwrap();
      dispatch(setUser(response.user));
      handleSuccessfulLogin();
    } catch (err) {
      // Error is already handled by the authApiSlice
    }
  };

  const handleSuccessfulLogin = () => {
    navigateToHome(navigate);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100"
      data-testid="login-page"
    >
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Welcome to the
          <br />
          Lost Pets Registry!
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Log in to report an animal as lost or found and help reunite pets with their owners.
        </p>

        <form onSubmit={handleLogin} className="mt-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </a>
          </p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            By using our site, you agree to our{" "}
            <a href="/terms" className="text-blue-500 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-blue-500 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
