import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import SignUpPage from "../SignUpPage";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../../redux/features/auth/authSlice";
import { authApiSlice as authApi } from "../../../redux/features/auth/authApiSlice";

// Mock navigate function
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockNavigate
}));

// Setup store for testing
const setupStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [authApi.reducerPath]: authApi.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(authApi.middleware)
  });
};

// Mock signup mutation
const mockSignUpMutation = vi.fn();
vi.mock("../../../redux/features/auth/authApiSlice", async () => {
  const actual = await vi.importActual("../../../redux/features/auth/authApiSlice");
  return {
    ...(actual as any),
    useSignUpMutation: () => [mockSignUpMutation]
  };
});

describe("SignUpPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders signup form correctly", () => {
    render(
      <Provider store={setupStore()}>
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByPlaceholderText("Email")).toBeDefined();
    expect(screen.getByPlaceholderText("Password")).toBeDefined();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeDefined();
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeDefined();
  });

  it("handles input changes", () => {
    render(
      <Provider store={setupStore()}>
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText("Email") as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText("Password") as HTMLInputElement;
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm Password"
    ) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
    expect(confirmPasswordInput.value).toBe("password123");
  });

  it("displays error when passwords don't match", async () => {
    render(
      <Provider store={setupStore()}>
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
    const submitButton = screen.getByRole("button", { name: "Sign Up" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password456" } });

    fireEvent.submit(submitButton);

    const notification = await screen.findByRole("alert");
    expect(notification.textContent).toContain("Passwords do not match");
  });

  it("navigates to home page after successful signup", async () => {
    const mockResponse = {
      user: { id: 1, email: "test@example.com" },
      message: "Signed up successfully"
    };

    mockSignUpMutation.mockImplementation(() => ({
      unwrap: () => Promise.resolve(mockResponse)
    }));

    render(
      <Provider store={setupStore()}>
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
    const submitButton = screen.getByRole("button", { name: "Sign Up" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });

    await act(async () => {
      fireEvent.submit(submitButton);
      await Promise.resolve();
    });

    expect(mockSignUpMutation).toHaveBeenCalledWith({
      user: {
        email: "test@example.com",
        password: "password123",
        password_confirmation: "password123"
      }
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("displays error notification on signup failure", async () => {
    const mockError = { data: { message: "Email has already been taken" } };
    mockSignUpMutation.mockImplementation(() => ({
      unwrap: () => Promise.reject(mockError)
    }));

    render(
      <Provider store={setupStore()}>
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
    const submitButton = screen.getByRole("button", { name: "Sign Up" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });

    await act(async () => {
      fireEvent.submit(submitButton);
      await Promise.resolve();
    });

    const notification = await screen.findByRole("alert");
    expect(notification.textContent).toContain("Email has already been taken");
  });

  it("requires all fields", () => {
    render(
      <Provider store={setupStore()}>
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText("Email") as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText("Password") as HTMLInputElement;
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm Password"
    ) as HTMLInputElement;

    expect(emailInput.required).toBe(true);
    expect(passwordInput.required).toBe(true);
    expect(confirmPasswordInput.required).toBe(true);
  });

  it("has correct link to login page", () => {
    render(
      <Provider store={setupStore()}>
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      </Provider>
    );

    const loginLink = screen.getByRole("link", { name: /log in/i }) as HTMLAnchorElement;
    expect(loginLink.href).toContain("/login");
  });
});
