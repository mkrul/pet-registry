import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/features/auth/authApiSlice";
import { useAppDispatch } from "../../redux/hooks";
import { setUser } from "../../redux/features/auth/authSlice";
import { NotificationType, NotificationState } from "../../types/shared/Notification";
import Notification from "../../components/shared/Notification";
import { navigateToHome } from "../../utils/navigation";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 Login attempt started", { email });

    try {
      console.log("📡 Calling login mutation...");
      const response = await login({ user: { email, password } }).unwrap();
      console.log("✅ Login successful", response);

      console.log("📝 Dispatching user to Redux store");
      dispatch(setUser(response.user));

      console.log("🔔 Setting success notification");
      setNotification({
        type: NotificationType.SUCCESS,
        message: response.message
      });

      console.log("🏃‍♂️ Calling handleSuccessfulLogin");
      handleSuccessfulLogin();
    } catch (err: unknown) {
      console.error("❌ Login error:", err);
      const error = err as { data?: { message?: string } };
      setNotification({
        type: NotificationType.ERROR,
        message: error.data?.message
      });
    }
  };

  const handleSuccessfulLogin = () => {
    console.log("🎯 handleSuccessfulLogin called with navigate:", navigate);
    navigateToHome(navigate);
    console.log("🏁 Navigation completed");
  };

  console.log("🔄 Rendering LoginPage, notification state:", notification);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Welcome to the
          <br />
          Lost Pet Registry!
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
