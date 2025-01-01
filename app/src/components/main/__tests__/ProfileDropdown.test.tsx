import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { BrowserRouter } from "react-router-dom";
import ProfileDropdown from "../ProfileDropdown";

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
  default: ({ children }: { children: React.ReactNode }) => <a data-testid="nav-link">{children}</a>
}));

const renderProfileDropdown = () => {
  return render(
    <BrowserRouter>
      <ProfileDropdown />
    </BrowserRouter>
  );
};

describe("ProfileDropdown", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe("Rendering", () => {
    it("renders the profile avatar button", () => {
      const { container } = renderProfileDropdown();
      const avatarButton = screen.getByRole("button", { name: /tailwind css navbar component/i });
      expect(avatarButton).toBeDefined();
      expect(container).toMatchSnapshot();
    });

    it("renders the avatar image with correct attributes", () => {
      renderProfileDropdown();
      const avatarImg = screen.getByAltText("Tailwind CSS Navbar component");
      expect(avatarImg).toBeDefined();
      expect(avatarImg.getAttribute("src")).toBe(
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
      );
    });
  });

  describe("Dropdown Functionality", () => {
    it.each([["My Reports"], ["My Pets"], ["Profile"], ["Settings"]])(
      "displays %s link in dropdown",
      async linkText => {
        renderProfileDropdown();
        const avatarButton = screen.getByRole("button", { name: /tailwind css navbar component/i });
        fireEvent.click(avatarButton);

        await waitFor(() => {
          const links = screen.getAllByTestId("nav-link");
          expect(links.some(link => link.textContent === linkText)).toBe(true);
        });
      }
    );

    it("toggles dropdown visibility when clicked", async () => {
      renderProfileDropdown();
      const avatarButton = screen.getByRole("button", { name: /tailwind css navbar component/i });
      const dropdown = screen.getByRole("list");
      expect(dropdown).toHaveClass("hidden");

      fireEvent.click(avatarButton);
      expect(dropdown).toHaveClass("block");

      fireEvent.click(avatarButton);
      expect(dropdown).toHaveClass("hidden");
    });
  });

  describe("Logout Functionality", () => {
    it("navigates to login page after logout", async () => {
      renderProfileDropdown();
      const avatarButton = screen.getByRole("button", { name: /tailwind css navbar component/i });
      fireEvent.click(avatarButton);
      fireEvent.click(screen.getByTestId("logout-button"));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/login");
      });
    });
  });
});
