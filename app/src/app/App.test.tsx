import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import App from "./App";
import authReducer from "../store/features/auth/authSlice";
const mockUseGetCurrentUserQuery = vi.fn();

vi.mock(".../store/features/auth/authApiSlice", () => ({
  authApi: {
    reducerPath: "api",
    reducer: ((state = {}) => state),
    middleware: () => (next) => (action) => next(action),
    endpoints: {
      getCurrentUser: {
        select: vi.fn()
      }
    }
  },
  useGetCurrentUserQuery: () => mockUseGetCurrentUserQuery()
}));

vi.mock(".../shared/components/common/Spinner", () => ({
  default: () => <div data-testid="spinner">Loading...</div>
}));

vi.mock("../AppRouter", () => ({
  default: () => <div data-testid="app-router">App Router</div>
}));

vi.mock(".../shared/components/common/Notification", () => ({
  default: ({ type, message, onClose }) => (
    <div data-testid="notification" onClick={onClose}>
      {type}: {message}
    </div>
  )
}));

describe("App Component", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
        api: ((state = {}) => state)
      },
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(() => (next) => (action) => next(action))
    });
    vi.clearAllMocks();
  });

  it("shows loading spinner while fetching user data", () => {
    mockUseGetCurrentUserQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByTestId("spinner")).toBeDefined();
  });

  it("renders AppRouter when user data is loaded successfully", async () => {
    const mockUser = { id: 1, email: "test@example.com" };
    mockUseGetCurrentUserQuery.mockReturnValue({
      data: { user: mockUser },
      isLoading: false,
      isError: false,
      error: null
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("app-router")).toBeDefined();
    });
  });

  it("shows error notification on authentication error", async () => {
    mockUseGetCurrentUserQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: { data: { message: "Authentication failed" } }
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    await waitFor(() => {
      const notification = screen.getByTestId("notification");
      expect(notification).toBeDefined();
      expect(notification.textContent).toContain("Authentication failed");
    });
  });

  it("clears user data on authentication error", async () => {
    mockUseGetCurrentUserQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: { data: { message: "Authentication failed" } }
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    await waitFor(() => {
      const state = store.getState();
      expect(state.auth.user).toBeNull();
    });
  });

  it("sets user data when authentication is successful", async () => {
    const mockUser = { id: 1, email: "test@example.com" };
    mockUseGetCurrentUserQuery.mockReturnValue({
      data: { user: mockUser },
      isLoading: false,
      isError: false,
      error: null
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    await waitFor(() => {
      const state = store.getState();
      expect(state.auth.user).toEqual(mockUser);
    });
  });
});
