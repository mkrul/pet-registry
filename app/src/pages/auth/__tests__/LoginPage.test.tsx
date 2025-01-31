import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "../LoginPage";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../../redux/features/auth/authSlice";
import { authApiSlice as authApi } from "../../../redux/features/auth/authApiSlice";
import * as navigationUtils from "../../../utils/navigation";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockNavigate
}));

const setupStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [authApi.reducerPath]: authApi.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(authApi.middleware)
  });
};

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

    const submitButton = screen.getByRole("button", { name: "Logging in..." });
    expect(submitButton.textContent).toBe("Logging in...");
  });

  it("displays error notification on login failure", async () => {
    const mockError = { data: { message: "Invalid credentials" } };
    mockLoginMutation.mockImplementationOnce(() => Promise.reject(mockError));

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

    fireEvent.change(emailInput, { target: { value: "invalid@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.submit(submitButton);

    await Promise.resolve();

    expect(screen.getByRole("alert")).toBeDefined();
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

  it("navigates to home page after successful login", async () => {
    const mockResponse = {
      user: { id: 1, email: "test@example.com" },
      message: "Login successful"
    };

    mockLoginMutation.mockImplementation(() => ({
      unwrap: () => Promise.resolve(mockResponse)
    }));

    const navigateToHomeSpy = vi.spyOn(navigationUtils, "navigateToHome");
    const store = setupStore();

    render(
      <Provider store={store}>
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

    await act(async () => {
      fireEvent.submit(submitButton);
      await Promise.resolve();
    });

    await waitFor(
      () => {
        const notification = screen.getByRole("alert");
        expect(notification).toBeDefined();
        expect(notification.textContent).toContain(mockResponse.message);
      },
      { timeout: 3000 }
    );

    expect(navigateToHomeSpy).toHaveBeenCalledWith(mockNavigate);
  });
});
