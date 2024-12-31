import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { store } from "../../redux/store";
import { useGetCurrentUserQuery } from "../../redux/features/auth/authApiSlice";
import App from "../../App";
import { NotificationType } from "../../types/common/Notification";
import { setUser, clearUser } from "../../redux/features/auth/authSlice";
import { act } from "react-dom/test-utils";
import { AnyAction, Middleware } from "redux";

// Mock the auth API slice
vi.mock("../../redux/features/auth/authApiSlice", () => ({
  authApiSlice: {
    reducerPath: "api",
    reducer: (state = {}) => state,
    middleware: () => next => action => next(action),
    useGetCurrentUserQuery: vi.fn()
  },
  useGetCurrentUserQuery: vi.fn()
}));

// Mock reports API
vi.mock("../../redux/features/reports/reportsApi", () => ({
  default: {
    reducerPath: "reportsApi",
    reducer: (state = {}) => state,
    middleware: () => next => action => next(action)
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
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock AppRouter component
vi.mock("../../components/common/AppRouter", () => ({
  default: () => <div data-testid="app-router">App Router</div>
}));

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mocked action creators
    vi.mocked(setUser).mockImplementation(user => ({ type: "auth/setUser", payload: user }));
    vi.mocked(clearUser).mockImplementation(() => ({ type: "auth/clearUser" }));
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
