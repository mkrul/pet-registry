import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import PrivateRoute from "../common/PrivateRoute";
import { authApiSlice, useGetCurrentUserQuery } from "../../redux/features/auth/authApiSlice";
import authReducer from "../../redux/features/auth/authSlice";
import { QueryStatus } from "@reduxjs/toolkit/query";

const ProtectedComponent = () => <div data-testid="protected">Protected Content</div>;
const LoginPage = () => <div data-testid="login">Login Page</div>;
const Spinner = () => <div data-testid="spinner">Loading...</div>;

vi.mock("../shared/Spinner", () => ({
  default: () => <div data-testid="spinner">Loading...</div>
}));

vi.mock("../../redux/features/auth/authApiSlice", () => {
  const useGetCurrentUserQuery = vi.fn();
  return {
    authApiSlice: {
      reducerPath: "api",
      reducer: (state = {}) => state,
      middleware: () => (next: any) => (action: any) => next(action)
    },
    useGetCurrentUserQuery
  };
});

const getStore = (initialState = { auth: { user: null } }) =>
  configureStore({
    reducer: {
      auth: authReducer,
      [authApiSlice.reducerPath]: authApiSlice.reducer
    },
    preloadedState: initialState,
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(authApiSlice.middleware)
  });

// Create a component to capture location
const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{JSON.stringify(location)}</div>;
};

const renderWithRouter = (store = getStore()) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/login"
            element={
              <>
                <LoginPage />
                <LocationDisplay />
              </>
            }
          />
          <Route element={<PrivateRoute />}>
            <Route path="/protected" element={<ProtectedComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe("PrivateRoute", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("shows loading spinner when checking authentication", () => {
    vi.mocked(useGetCurrentUserQuery).mockReturnValue({
      isLoading: true,
      data: null,
      error: null
    } as any);

    renderWithRouter();
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("redirects to login when user is not authenticated", async () => {
    vi.mocked(useGetCurrentUserQuery).mockReturnValue({
      isLoading: false,
      data: null,
      error: null
    } as any);

    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByTestId("login")).toBeInTheDocument();
    });
  });

  it("renders protected content when user is authenticated", async () => {
    const store = getStore({
      auth: { user: { id: 1, email: "test@example.com" } }
    });

    vi.mocked(useGetCurrentUserQuery).mockReturnValue({
      isLoading: false,
      data: { id: 1, email: "test@example.com" },
      error: null
    } as any);

    renderWithRouter(store);
    await waitFor(() => {
      expect(screen.getByTestId("protected")).toBeInTheDocument();
    });
  });

  it("preserves the redirect location when redirecting to login", async () => {
    vi.mocked(useGetCurrentUserQuery).mockReturnValue({
      isLoading: false,
      data: null,
      error: null
    } as any);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByTestId("login")).toBeInTheDocument();
      const locationJson = JSON.parse(screen.getByTestId("location-display").textContent || "{}");
      expect(locationJson.pathname).toBe("/login");
      expect(locationJson.state?.from?.pathname).toBe("/protected");
    });
  });
});
