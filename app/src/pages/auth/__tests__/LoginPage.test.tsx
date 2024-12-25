import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "../LoginPage";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../../redux/features/auth/authSlice";
import { authApiSlice as authApi } from "../../../redux/features/auth/authApiSlice";
import { useLoginMutation } from "../../../redux/features/auth/authApiSlice";

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

// Mock login mutation
const mockLoginMutation = vi.fn();
let mockIsLoading = false;

vi.mock("../../../redux/features/auth/authApiSlice", async () => {
  const actual = await vi.importActual("../../../redux/features/auth/authApiSlice");
  return {
    ...(actual as any),
    useLoginMutation: () => [mockLoginMutation, { isLoading: mockIsLoading }]
  };
});

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsLoading = false;
  });

  it("renders login form correctly", () => {
    render(
      <Provider store={setupStore()}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByPlaceholderText("Email")).toBeDefined();
    expect(screen.getByPlaceholderText("Password")).toBeDefined();
    expect(screen.getByRole("button", { name: "Login" })).toBeDefined();
    expect(screen.getByText(/don't have an account\?/i)).toBeDefined();
  });

  it("handles input changes", () => {
    render(
      <Provider store={setupStore()}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText("Email") as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText("Password") as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  it("displays loading state during form submission", async () => {
    mockIsLoading = true;

    render(
      <Provider store={setupStore()}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );

    const submitButton = screen.getByRole("button", { name: "Login" });
    expect(submitButton.textContent).toBe("Logging in...");
  });

  it("navigates to home page on successful login", async () => {
    mockLoginMutation.mockResolvedValueOnce({
      data: {
        user: { id: 1, email: "test@example.com" },
        message: "Login successful"
      }
    });

    render(
      <Provider store={setupStore()}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: "Login" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.submit(submitButton);

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
      },
      { timeout: 3000 }
    );
  });

  it("displays error notification on login failure", async () => {
    mockLoginMutation.mockRejectedValueOnce({
      data: { message: "Invalid credentials" }
    });

    render(
      <Provider store={setupStore()}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: "Login" });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "invalid@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
      fireEvent.submit(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeDefined();
    });
  });

  it("requires email and password fields", () => {
    render(
      <Provider store={setupStore()}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText("Email") as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText("Password") as HTMLInputElement;

    expect(emailInput.required).toBe(true);
    expect(passwordInput.required).toBe(true);
  });

  it("has correct link to signup page", () => {
    render(
      <Provider store={setupStore()}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );

    const signupLink = screen.getByRole("link", { name: /sign up/i }) as HTMLAnchorElement;
    expect(signupLink.href).toContain("/signup");
  });

  it("has correct links to terms and privacy pages", () => {
    render(
      <Provider store={setupStore()}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );

    const termsLink = screen.getByRole("link", { name: /terms of service/i }) as HTMLAnchorElement;
    const privacyLink = screen.getByRole("link", { name: /privacy policy/i }) as HTMLAnchorElement;

    expect(termsLink.href).toContain("/terms");
    expect(privacyLink.href).toContain("/privacy");
  });
});
