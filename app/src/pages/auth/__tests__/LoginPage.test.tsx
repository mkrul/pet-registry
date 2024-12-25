import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "../LoginPage";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../../redux/features/auth/authSlice";
import { authApiSlice as authApi } from "../../../redux/features/auth/authApiSlice";

// Mock navigate function
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...(actual as any),
    useNavigate: () => mockNavigate
  };
});

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

// Test wrapper component
const renderWithProviders = (component: React.ReactElement) => {
  const store = setupStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form correctly", () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
  });

  it("handles input changes", () => {
    renderWithProviders(<LoginPage />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("displays loading state during form submission", async () => {
    renderWithProviders(<LoginPage />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent("Logging in...");
  });

  it("navigates to home page on successful login", async () => {
    renderWithProviders(<LoginPage />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.submit(submitButton);

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
      },
      { timeout: 2000 }
    );
  });

  it("displays error notification on login failure", async () => {
    renderWithProviders(<LoginPage />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "invalid@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.submit(submitButton);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("requires email and password fields", () => {
    renderWithProviders(<LoginPage />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  it("has correct link to signup page", () => {
    renderWithProviders(<LoginPage />);

    const signupLink = screen.getByRole("link", { name: /sign up/i });
    expect(signupLink).toHaveAttribute("href", "/signup");
  });

  it("has correct links to terms and privacy pages", () => {
    renderWithProviders(<LoginPage />);

    const termsLink = screen.getByRole("link", { name: /terms of service/i });
    const privacyLink = screen.getByRole("link", { name: /privacy policy/i });

    expect(termsLink).toHaveAttribute("href", "/terms");
    expect(privacyLink).toHaveAttribute("href", "/privacy");
  });
});
