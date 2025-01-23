import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import PrivateRoute from "../PrivateRoute";
import authReducer from "../../../redux/features/auth/authSlice";
import { User } from "../../../types/auth/User";
import { useGetCurrentUserQuery } from "../../../redux/features/auth/authApiSlice";

vi.mock("../../../redux/features/auth/authApiSlice", () => ({
  useGetCurrentUserQuery: vi.fn()
}));

const ProtectedComponent = () => <div data-testid="protected">Protected Content</div>;
const LoginPage = () => {
  const location = useLocation();
  return (
    <div data-testid="login">
      Login Page
      <span data-testid="location-state">{JSON.stringify(location.state)}</span>
    </div>
  );
};

vi.mock("../../common/Spinner", () => ({
  default: () => <div data-testid="spinner">Loading...</div>
}));

const renderPrivateRoute = (
  initialState = { auth: { user: null as User | null } },
  initialRoute = "/protected"
) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: initialState
  });

  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[initialRoute]}>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path="/protected" element={<ProtectedComponent />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    ),
    store
  };
};

describe("PrivateRoute", () => {
  beforeEach(() => {
    vi.mocked(useGetCurrentUserQuery).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    } as any);
  });

  describe("Authentication States", () => {
    it("shows loading spinner while checking auth status", () => {
      vi.mocked(useGetCurrentUserQuery).mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
        refetch: vi.fn()
      } as any);

      const { container } = renderPrivateRoute();
      expect(screen.getByTestId("spinner")).toBeDefined();
      expect(container).toMatchSnapshot();
    });

    it("redirects to login when user is not authenticated", async () => {
      vi.mocked(useGetCurrentUserQuery).mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
        refetch: vi.fn()
      } as any);

      renderPrivateRoute();

      await waitFor(() => {
        expect(screen.getByTestId("login")).toBeDefined();
      });
      expect(screen.getByTestId("location-state")).toHaveTextContent("/protected");
    });

    it("allows access to protected route when user is authenticated", async () => {
      const mockUser: User = { id: 1, email: "test@example.com" };

      vi.mocked(useGetCurrentUserQuery).mockReturnValue({
        data: mockUser,
        isLoading: false,
        error: null,
        refetch: vi.fn()
      } as any);

      renderPrivateRoute({ auth: { user: mockUser } });

      await waitFor(() => {
        expect(screen.getByTestId("protected")).toBeDefined();
      });
    });
  });

  describe("Error Handling", () => {
    it("redirects to login on authentication error", async () => {
      vi.mocked(useGetCurrentUserQuery).mockReturnValue({
        data: null,
        isLoading: false,
        error: { status: 401, data: { message: "Unauthorized" } },
        refetch: vi.fn()
      } as any);

      renderPrivateRoute();

      await waitFor(() => {
        expect(screen.getByTestId("login")).toBeDefined();
        expect(screen.getByTestId("location-state")).toHaveTextContent("/protected");
      });
    });
  });

  describe("Route State Preservation", () => {
    it("preserves attempted route in location state when redirecting", async () => {
      const testRoute = "/protected?param=test";

      vi.mocked(useGetCurrentUserQuery).mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
        refetch: vi.fn()
      } as any);

      renderPrivateRoute(undefined, testRoute);

      await waitFor(() => {
        expect(screen.getByTestId("login")).toBeDefined();
        const locationState = JSON.parse(screen.getByTestId("location-state").textContent || "{}");
        expect(locationState.from.pathname).toBe("/protected");
        expect(locationState.from.search).toBe("?param=test");
      });
    });
  });
});
