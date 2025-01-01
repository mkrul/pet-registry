import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { useGetCurrentUserQuery } from "../redux/features/auth/authApiSlice";
import App from "../App";
import { setUser, clearUser } from "../redux/features/auth/authSlice";
import { act } from "react-dom/test-utils";
import { Dispatch } from "redux";
import { UnknownAction } from "@reduxjs/toolkit";

// Add window.scrollTo mock at the top of the file
window.scrollTo = vi.fn();

// Mock the auth API slice
vi.mock("../../redux/features/auth/authApiSlice", () => ({
  authApiSlice: {
    reducerPath: "api",
    reducer: (state = {}) => state,
    middleware: () => (next: Dispatch) => (action: UnknownAction) => next(action),
    useGetCurrentUserQuery: vi.fn()
  },
  useGetCurrentUserQuery: vi.fn(),
  useLogoutMutation: () => [
    vi.fn().mockResolvedValue({ data: { message: "Logged out successfully" } }),
    { isLoading: false }
  ]
}));

// Mock reports API
vi.mock("../../redux/features/reports/reportsApi", () => ({
  default: {
    reducerPath: "reportsApi",
    reducer: (state = {}) => state,
    middleware: () => (next: Dispatch) => (action: UnknownAction) => next(action)
  }
}));

// Mock reports reducer
vi.mock("../../redux/features/reports/reportsSlice", () => ({
  default: (state = {}) => state
}));

// Mock auth reducer and actions
vi.mock("../../redux/features/auth/authSlice", () => ({
  default: (state = {}) => state,
  setUser: vi.fn(),
  clearUser: vi.fn()
}));

// Mock router components
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Navigate: ({ to }: { to: string }) => (
    <div data-testid="navigate" data-to={to}>
      Navigate to {to}
    </div>
  ),
  Link: ({ to, children, ...props }: { to: string; children: React.ReactNode }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useLocation: () => ({
    pathname: "/",
    search: "",
    hash: "",
    state: null
  }),
  useNavigate: () => vi.fn()
}));

// Update the AppRouter mock path
vi.mock("../../components/main/AppRouter", () => ({
  default: () => <div data-testid="app-router">App Router</div>
}));

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(setUser).mockImplementation(user => ({ type: "auth/setUser", payload: user }));
    vi.mocked(clearUser).mockImplementation(() => ({
      type: "auth/clearUser",
      payload: undefined
    }));
  });

  const renderApp = () => {
    return render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  };

  it("shows loading spinner when fetching user data", () => {
    vi.mocked(useGetCurrentUserQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null
    } as any);

    renderApp();
    expect(screen.getByTestId("spinner")).toBeDefined();
  });

  it("renders app router when user data is loaded", () => {
    vi.mocked(useGetCurrentUserQuery).mockReturnValue({
      data: { user: { id: 1, email: "test@example.com" } },
      isLoading: false,
      isError: false,
      error: null
    } as any);

    renderApp();
    expect(screen.getByTestId("app-router")).toBeDefined();
  });

  it("shows error notification when authentication fails", async () => {
    const errorMessage = "Authentication failed";
    vi.mocked(useGetCurrentUserQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { data: { message: errorMessage } }
    } as any);

    renderApp();

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeDefined();
    });
  });

  it("clears notification when close button is clicked", async () => {
    const user = userEvent.setup();
    const errorMessage = "Authentication failed";

    vi.mocked(useGetCurrentUserQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { data: { message: errorMessage } }
    } as any);

    renderApp();

    const closeButton = await screen.findByRole("button", { name: /close/i });

    await act(async () => {
      await user.click(closeButton);
    });

    await waitFor(() => {
      expect(screen.queryByText(errorMessage)).toBeNull();
    });
  });
});
