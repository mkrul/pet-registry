import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import AppRouter from "../AppRouter";
import authReducer from "../../../redux/features/auth/authSlice";
import { User } from "../../../types/auth/User";
import { RootState } from "../../../redux/store";
import { Report } from "../../../types/Report";

const mockReport: Report = {
  id: 123,
  title: "Test Report",
  description: "Test Description",
  status: "lost",
  species: "dog",
  breed1: "Labrador",
  color1: "black",
  gender: "male",
  size: "medium",
  age: "adult",
  location: "Test Location",
  latitude: 0,
  longitude: 0,
  date_lost: new Date().toISOString(),
  user_id: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Mock all components that use hooks
vi.mock("../../pages/reports/ReportsIndexPage", () => ({
  default: () => <div data-testid="reports-index">Reports Index</div>
}));

vi.mock("../../pages/reports/ReportNewPage", () => ({
  default: () => <div data-testid="report-new">New Report</div>
}));

vi.mock("../../pages/reports/ReportShowPage", () => ({
  default: () => <div data-testid="report-show">Show Report</div>
}));

vi.mock("../../pages/auth/LoginPage", () => ({
  default: () => <div data-testid="login-page">Login</div>
}));

vi.mock("../../pages/auth/SignUpPage", () => ({
  default: () => <div data-testid="signup-page">Sign Up</div>
}));

// Mock layout components
vi.mock("../common/Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>
}));

vi.mock("../common/Footer", () => ({
  default: () => <div data-testid="footer">Footer</div>
}));

vi.mock("../ScrollToTop", () => ({
  default: () => <div data-testid="scroll-to-top">ScrollToTop</div>
}));

// Mock hooks and API slices
vi.mock("../../../hooks/useReportsData", () => ({
  useReportsData: () => ({
    reports: [],
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 1
  })
}));

vi.mock("../../../redux/features/reports/reportsApi", () => {
  const mockHooks = {
    useGetReportsQuery: () => ({ data: [], isLoading: false, error: null }),
    useGetReportQuery: () => ({ data: mockReport, isLoading: false, error: null }),
    useGetNewReportQuery: () => ({ data: null, isLoading: false, error: null }),
    useCreateReportMutation: () => [vi.fn(), { isLoading: false }],
    useUpdateReportMutation: () => [vi.fn(), { isLoading: false }],
    useSubmitReportMutation: () => [vi.fn(), { isLoading: false }]
  };

  return {
    ...mockHooks,
    default: {
      reducerPath: "reportsApi",
      reducer: (state = {}) => state,
      middleware: () => (next: any) => (action: any) => next(action),
      endpoints: {
        getReports: { select: () => ({}) },
        getReport: { select: () => ({}) }
      }
    }
  };
});

vi.mock("../../../redux/features/auth/authApiSlice", () => ({
  useGetCurrentUserQuery: () => ({ data: null, isLoading: false, error: null }),
  useLoginMutation: () => [vi.fn(), { isLoading: false }],
  useLogoutMutation: () => [vi.fn(), { isLoading: false }],
  useSignUpMutation: () => [vi.fn(), { isLoading: false }],
  authApiSlice: {
    reducerPath: "authApi",
    reducer: (state = {}) => state,
    middleware: () => (next: any) => (action: any) => next(action)
  }
}));

const mockUser: User = { id: 1, email: "test@example.com" };

const renderWithRouter = (
  initialRoute: string,
  initialState: Partial<RootState> = { auth: { user: null } }
) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      authApi: (state = {}) => state,
      reportsApi: (state = {}) => state
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware(),
    preloadedState: initialState
  });

  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[initialRoute]}>
          <AppRouter />
        </MemoryRouter>
      </Provider>
    ),
    store
  };
};

describe("AppRouter", () => {
  describe("Layout", () => {
    it("renders common components", async () => {
      renderWithRouter("/");
      await waitFor(() => {
        expect(screen.getByTestId("navbar")).toBeDefined();
        expect(screen.getByTestId("footer")).toBeDefined();
        expect(screen.getByTestId("scroll-to-top")).toBeDefined();
      });
    });
  });

  describe("Public Routes", () => {
    it.each([
      ["/", "reports-index"],
      ["/reports/123", "report-show"],
      ["/login", "login-page"],
      ["/signup", "signup-page"],
      ["/invalid-route", "reports-index"]
    ])("renders correct component for %s", async (route, expectedTestId) => {
      renderWithRouter(route);
      await waitFor(
        () => {
          expect(screen.getByTestId(expectedTestId)).toBeDefined();
        },
        {
          timeout: 2000,
          interval: 100
        }
      );
    });
  });

  describe("Protected Routes", () => {
    it("redirects to login when accessing new report page while unauthenticated", async () => {
      renderWithRouter("/reports/new");
      await waitFor(() => {
        expect(screen.getByTestId("login-page")).toBeDefined();
      });
    });

    it("allows access to new report page when authenticated", async () => {
      renderWithRouter("/reports/new", { auth: { user: mockUser } });
      await waitFor(() => {
        expect(screen.getByTestId("report-new")).toBeDefined();
      });
    });
  });

  describe("Authentication Redirects", () => {
    const authenticatedState = { auth: { user: mockUser } };

    it.each([["/login"], ["/signup"]])(
      "redirects to home from %s when authenticated",
      async route => {
        renderWithRouter(route, authenticatedState);
        await waitFor(() => {
          expect(screen.getByTestId("reports-index")).toBeDefined();
        });
      }
    );
  });
});
