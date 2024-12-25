import { render, screen, fireEvent } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import LoginPage from "../../../pages/auth/LoginPage";
import { authApiSlice as authApi } from "../../../redux/features/auth/authApiSlice";

// Mock the navigation function
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate
}));

// Mock the login mutation
const mockLogin = jest.fn();
jest.mock("../../../redux/features/auth/authApiSlice", () => ({
  ...jest.requireActual("../../../redux/features/auth/authApiSlice"),
  useLoginMutation: () => [mockLogin, { isLoading: false }]
}));

describe("LoginPage", () => {
  const renderLoginPage = () => {
    const store = configureStore({
      reducer: {
        [authApi.reducerPath]: authApi.reducer
      },
      middleware: getDefaultMiddleware => getDefaultMiddleware().concat(authApi.middleware)
    });

    return render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders login form with all elements", () => {
    renderLoginPage();

    expect(screen.getByText(/Welcome to the/i)).toBeInTheDocument();
    expect(screen.getByText(/Lost Pet Registry!/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it("handles form input changes", () => {
    renderLoginPage();

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("handles successful login", async () => {
    mockLogin.mockResolvedValueOnce({
      user: { id: 1, email: "test@example.com" },
      message: "Login successful"
    });

    renderLoginPage();

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        user: { email: "test@example.com", password: "password123" }
      });
    });

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
      },
      { timeout: 2000 }
    );
  });

  it("handles login failure", async () => {
    const errorMessage = "Invalid credentials";
    mockLogin.mockRejectedValueOnce({
      data: { message: errorMessage }
    });

    renderLoginPage();

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "wrong@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("requires email and password fields", () => {
    renderLoginPage();

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });
});
