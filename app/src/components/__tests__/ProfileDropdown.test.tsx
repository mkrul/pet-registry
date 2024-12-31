import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ProfileDropdown from "../main/ProfileDropdown";
import { authApiSlice } from "../../redux/features/auth/authApiSlice";
import authReducer from "../../redux/features/auth/authSlice";

// Mock the logout mutation
vi.mock("../../redux/features/auth/authApiSlice", () => ({
  authApiSlice: {
    reducerPath: "api",
    reducer: (state = {}) => state,
    middleware: () => (next: any) => (action: any) => next(action)
  },
  useLogoutMutation: () => [vi.fn()]
}));

const getStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      [authApiSlice.reducerPath]: authApiSlice.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(authApiSlice.middleware)
  });

// Add location display component
const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
};

const renderProfileDropdown = () => {
  return render(
    <Provider store={getStore()}>
      <MemoryRouter>
        <ProfileDropdown />
        <LocationDisplay />
      </MemoryRouter>
    </Provider>
  );
};

describe("ProfileDropdown", () => {
  it("renders avatar button", () => {
    renderProfileDropdown();
    expect(screen.getByRole("button", { name: /tailwind css navbar component/i })).toBeDefined();
    expect(screen.getByAltText("Tailwind CSS Navbar component")).toBeDefined();
  });

  it("toggles dropdown menu when clicking avatar", () => {
    renderProfileDropdown();
    const avatarButton = screen.getByRole("button", { name: /tailwind css navbar component/i });

    // Menu should be hidden initially
    expect(screen.getByRole("list")).toHaveClass("hidden");

    // Click to open
    fireEvent.click(avatarButton);
    expect(screen.getByRole("list")).toHaveClass("block");

    // Click to close
    fireEvent.click(avatarButton);
    expect(screen.getByRole("list")).toHaveClass("hidden");
  });

  it("renders all menu items", () => {
    renderProfileDropdown();
    const avatarButton = screen.getByRole("button", { name: /tailwind css navbar component/i });
    fireEvent.click(avatarButton);

    expect(screen.getByText("My Reports")).toBeDefined();
    expect(screen.getByText("My Pets")).toBeDefined();
    expect(screen.getByText("Profile")).toBeDefined();
    expect(screen.getByText("Settings")).toBeDefined();
    expect(screen.getByText("Logout")).toBeDefined();
  });

  it("applies hover styles to menu items", () => {
    renderProfileDropdown();
    const avatarButton = screen.getByRole("button", { name: /tailwind css navbar component/i });
    fireEvent.click(avatarButton);

    const menuItems = screen.getAllByRole("listitem");
    menuItems.forEach(item => {
      expect(item).toHaveClass("hover:bg-base-100", "rounded-lg", "transition-colors");
    });
  });

  it("navigates to login page on logout", async () => {
    renderProfileDropdown();
    const avatarButton = screen.getByRole("button", { name: /tailwind css navbar component/i });
    fireEvent.click(avatarButton);
    fireEvent.click(screen.getByText("Logout"));

    // Check navigation using LocationDisplay
    expect(screen.getByTestId("location-display")).toHaveTextContent("/login");
  });
});
