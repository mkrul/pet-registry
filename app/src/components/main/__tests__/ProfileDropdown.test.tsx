import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ProfileDropdown from "../ProfileDropdown";
import { authApiSlice } from "../../../redux/features/auth/authApiSlice";

const mockNavigate = vi.fn();

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Mock the LogoutButton component
vi.mock("../../auth/LogoutButton", () => ({
  default: ({ onCompleted }: { onCompleted: () => void }) => (
    <button data-testid="logout-button" onClick={onCompleted}>
      Logout
    </button>
  )
}));

// Mock NavLink component
vi.mock("../../common/NavLink", () => ({
  default: ({
    children,
    "data-testid": dataTestId,
    linkTo
  }: {
    children: React.ReactNode;
    "data-testid"?: string;
    linkTo?: string;
  }) => (
    <a data-testid={dataTestId || "nav-link"} onClick={() => linkTo && mockNavigate(linkTo)}>
      {children}
    </a>
  )
}));

const mockUser = {
  email: "test@example.com",
  id: 1
};

const createMockStore = (isAuthenticated: boolean) => {
  return configureStore({
    reducer: {
      auth: () => ({
        user: isAuthenticated ? mockUser : null
      }),
      [authApiSlice.reducerPath]: authApiSlice.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(authApiSlice.middleware)
  });
};

const renderProfileDropdown = (isAuthenticated: boolean = true) => {
  const store = createMockStore(isAuthenticated);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <ProfileDropdown />
      </BrowserRouter>
    </Provider>
  );
};

describe("ProfileDropdown", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe("Authenticated State", () => {
    it("renders the profile avatar button when authenticated", () => {
      renderProfileDropdown(true);
      const avatarButton = screen.getByTestId("profile-button");
      expect(avatarButton).toBeInTheDocument();
    });

    it("toggles dropdown visibility when clicked", async () => {
      renderProfileDropdown(true);
      const avatarButton = screen.getByTestId("profile-button");
      const dropdown = screen.getByRole("list");
      expect(dropdown).toHaveClass("hidden");

      fireEvent.click(avatarButton);
      expect(dropdown).toHaveClass("block");

      fireEvent.click(avatarButton);
      expect(dropdown).toHaveClass("hidden");
    });

    it.each([["My Reports"], ["My Pets"], ["Profile"], ["Settings"]])(
      "displays %s link in dropdown when authenticated",
      async linkText => {
        renderProfileDropdown(true);
        const avatarButton = screen.getByTestId("profile-button");
        fireEvent.click(avatarButton);

        await waitFor(() => {
          const links = screen.getAllByTestId("nav-link");
          expect(links.some(link => link.textContent === linkText)).toBe(true);
        });
      }
    );
  });

  describe("Unauthenticated State", () => {
    it("renders login button when not authenticated", () => {
      renderProfileDropdown(false);
      const loginButton = screen.getByTestId("nav-link-login");
      expect(loginButton).toBeInTheDocument();
      expect(loginButton).toHaveTextContent("Log In");
    });

    it("navigates to login page when login button is clicked", () => {
      renderProfileDropdown(false);
      const loginButton = screen.getByTestId("nav-link-login");
      fireEvent.click(loginButton);
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  describe("Logout Functionality", () => {
    it("navigates to login page after logout", async () => {
      renderProfileDropdown(true);
      const avatarButton = screen.getByTestId("profile-button");
      fireEvent.click(avatarButton);
      fireEvent.click(screen.getByTestId("logout-button"));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/login");
      });
    });
  });
});
