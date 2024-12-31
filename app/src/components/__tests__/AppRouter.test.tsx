import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { authApiSlice } from "../../redux/features/auth/authApiSlice";
import authReducer from "../../redux/features/auth/authSlice";
import reportsApi from "../../redux/features/reports/reportsApi";
import reportsReducer from "../../redux/features/reports/reportsSlice";
import AppRouter from "../main/AppRouter";

// Mock window.scrollTo
window.scrollTo = vi.fn();

// Mock all the components that AppRouter renders
vi.mock("../common/Navbar", () => ({
  default: () => (
    <div data-testid="navbar" className="navbar bg-base-100">
      Navbar
    </div>
  )
}));

vi.mock("../common/Footer", () => ({
  default: () => (
    <div data-testid="footer" className="bg-base-200 py-6">
      Footer
    </div>
  )
}));

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

vi.mock("./ScrollToTop", () => ({
  default: () => null
}));

vi.mock("../../redux/features/auth/authApiSlice", () => ({
  authApiSlice: {
    reducerPath: "api",
    reducer: (state = { queries: {}, mutations: {} }) => state,
    middleware: () => next => action => next(action),
    endpoints: {
      getCurrentUser: {}
    }
  },
  useGetCurrentUserQuery: () => ({
    data: null,
    isLoading: false,
    isError: false
  }),
  useLogoutMutation: () => [() => Promise.resolve({ data: null }), { isLoading: false }]
}));

// Also mock the reports API and reducers since they're used in the store
vi.mock("../../redux/features/reports/reportsApi", () => ({
  default: {
    reducerPath: "reportsApi",
    reducer: (state = { queries: {}, mutations: {} }) => state,
    middleware: () => next => action => next(action)
  }
}));

vi.mock("../../redux/features/reports/reportsSlice", () => ({
  default: (state = { reports: [] }) => state
}));

vi.mock("../../redux/features/auth/authSlice", () => ({
  default: (state = { user: null }, action) => {
    switch (action.type) {
      case "auth/setUser":
        return { ...state, user: action.payload };
      case "auth/clearUser":
        return { ...state, user: null };
      default:
        return state;
    }
  },
  setUser: vi.fn(),
  clearUser: vi.fn()
}));

// Create a function to get a fresh store for each test
const getStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      [authApiSlice.reducerPath]: authApiSlice.reducer,
      [reportsApi.reducerPath]: reportsApi.reducer,
      reports: reportsReducer
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(authApiSlice.middleware, reportsApi.middleware)
  });

const renderWithRouter = (initialRoute: string, store = getStore()) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <AppRouter />
      </MemoryRouter>
    </Provider>
  );
};

describe("AppRouter", () => {
  let store: ReturnType<typeof getStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = getStore();
  });

  it("renders navbar and footer on all routes", () => {
    renderWithRouter("/");
    expect(screen.getByTestId("navbar")).toBeDefined();
    expect(screen.getByTestId("footer")).toBeDefined();
  });

  it("renders reports index page at root route", () => {
    renderWithRouter("/");
    expect(screen.getByTestId("reports-index")).toBeDefined();
  });

  it("renders login page for unauthenticated users", () => {
    renderWithRouter("/login");
    expect(screen.getByTestId("login-page")).toBeDefined();
  });

  it("renders signup page for unauthenticated users", () => {
    renderWithRouter("/signup");
    expect(screen.getByTestId("signup-page")).toBeDefined();
  });

  it("renders report show page with specific id", () => {
    renderWithRouter("/reports/123");
    expect(screen.getByTestId("report-show")).toBeDefined();
  });

  it("redirects to root for unknown routes", () => {
    renderWithRouter("/unknown-route");
    expect(screen.getByTestId("reports-index")).toBeDefined();
  });

  describe("protected routes", () => {
    it("renders new report page for authenticated users", async () => {
      store.dispatch({
        type: "auth/setUser",
        payload: { id: 1, email: "test@example.com" }
      });

      renderWithRouter("/reports/new", store);

      await waitFor(() => {
        expect(screen.getByTestId("report-new")).toBeDefined();
      });
    });

    it("redirects to login for unauthenticated users on protected routes", async () => {
      renderWithRouter("/reports/new");

      await waitFor(() => {
        expect(screen.getByTestId("login-page")).toBeDefined();
      });
    });
  });

  describe("authenticated user redirects", () => {
    beforeEach(() => {
      store = getStore();
      store.dispatch({
        type: "auth/setUser",
        payload: { id: 1, email: "test@example.com" }
      });
    });

    it("redirects from login to root when user is authenticated", async () => {
      renderWithRouter("/login", store);

      await waitFor(() => {
        expect(screen.getByTestId("reports-index")).toBeDefined();
      });
    });

    it("redirects from signup to root when user is authenticated", async () => {
      renderWithRouter("/signup", store);

      await waitFor(() => {
        expect(screen.getByTestId("reports-index")).toBeDefined();
      });
    });
  });
});
