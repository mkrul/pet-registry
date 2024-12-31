import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignUpMutation } from "../../redux/features/auth/authApiSlice";
import Notification from "../../components/common/Notification";
import { NotificationState, NotificationType } from "../../types/common/Notification";

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [signUp] = useSignUpMutation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirmation: ""
  });
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    if (formData.password !== formData.passwordConfirmation) {
      setNotification({
        type: NotificationType.ERROR,
        message: "Passwords do not match"
      });
      return;
    }

    try {
      await signUp({
        user: {
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.passwordConfirmation
        }
      }).unwrap();
      navigate("/");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setNotification({
        type: NotificationType.ERROR,
        message: error.data?.message
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Create an Account</h1>
        <p className="text-gray-600 text-center mb-8">
          After creating an account, please check your email for a confirmation link. This is
          required to activate your new account.
        </p>

        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}

        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="password"
            name="passwordConfirmation"
            placeholder="Confirm Password"
            value={formData.passwordConfirmation}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
