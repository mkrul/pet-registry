import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignupMutation } from "../../redux/features/auth/authApi";
import { useAppDispatch } from "../../redux/hooks";
import { setUser } from "../../redux/features/auth/authSlice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface ErrorResponse {
  data: {
    message: string;
    errors?: string[];
  };
}

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError & ErrorResponse => {
  return typeof error === "object" && error !== null && "data" in error;
};

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirmation: ""
  });
  const [signup, { isLoading, error }] = useSignupMutation();
  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting signup form:", formData);

    try {
      const response = await signup({
        user: {
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.passwordConfirmation
        }
      }).unwrap();

      console.log("Signup successful:", response);
      dispatch(setUser(response.data));
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Signup failed:", err);
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

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {isFetchBaseQueryError(error) &&
            (error.data?.errors?.length ? error.data.errors.join(", ") : error.data?.message)
              ? error.data?.errors?.join(", ") || error.data?.message
              : "Registration failed. Please try again."}
          </div>
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
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
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
