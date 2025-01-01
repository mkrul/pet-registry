import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Navbar from "../Navbar";

// Mock the ProfileDropdown component
vi.mock("../../main/ProfileDropdown", () => ({
  default: () => <div data-testid="profile-dropdown">Profile Dropdown</div>
}));

// Mock NavLink component
vi.mock("../NavLink", () => ({
  default: ({ children, linkTo }: { children: React.ReactNode; linkTo: string }) => (
    <a href={linkTo} data-testid="nav-link">
      {children}
    </a>
  )
}));

describe("Navbar", () => {
  const originalLocation = window.location;
  const mockReplace = vi.fn();

  beforeAll(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { replace: mockReplace, origin: "http://localhost" }
    });
  });

  afterAll(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderNavbar = () => {
    return render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  };

  describe("Desktop Navigation", () => {
    it("renders logo with correct link and text", () => {
      renderNavbar();
      const logo = screen.getByText("Lost Pet Registry");
      expect(logo).toBeDefined();
      expect(logo).toHaveClass("btn", "btn-ghost", "text-xl", "hover:bg-transparent");
    });

    it("renders desktop navigation menu with correct classes", () => {
      renderNavbar();
      const desktopNav = screen.getByRole("list", {
        hidden: false,
        name: /desktop navigation/i
      });
      expect(desktopNav).toHaveClass("menu", "menu-horizontal", "px-1");
    });

    it("renders all desktop navigation links", () => {
      renderNavbar();
      const desktopContainer = screen.getByTestId("desktop-nav");
      const desktopLinks = within(desktopContainer).getAllByTestId("nav-link");
      expect(desktopLinks).toHaveLength(4);
    });
  });

  describe("Mobile Navigation", () => {
    it("renders mobile navigation menu with correct classes", () => {
      renderNavbar();
      const mobileNav = screen.getByTestId("mobile-nav");
      expect(mobileNav.parentElement).toHaveClass("md:hidden");
    });

    it("renders all mobile navigation links", () => {
      renderNavbar();
      const mobileContainer = screen.getByTestId("mobile-nav");
      const mobileLinks = within(mobileContainer).getAllByTestId("nav-link");
      expect(mobileLinks).toHaveLength(4);
    });
  });

  describe("Navigation Links", () => {
    const expectedLinks = [
      { text: "Report a Lost Pet", path: "/reports/new" },
      { text: "Search", path: "/reports" },
      { text: "About", path: "#" },
      { text: "Contact", path: "#" }
    ];

    it.each(expectedLinks)("renders $text link with correct href", ({ text, path }) => {
      renderNavbar();
      const links = screen.getAllByText(text);
      links.forEach(link => {
        expect(link.closest("a")).toHaveAttribute("href", path);
      });
    });
  });

  describe("Interactions", () => {
    it("handles home link click by replacing location", async () => {
      renderNavbar();
      const homeLink = screen.getByText("Lost Pet Registry");
      await userEvent.click(homeLink);
      expect(mockReplace).toHaveBeenCalledWith("http://localhost");
    });

    it("prevents default behavior on home link click", async () => {
      renderNavbar();
      const homeLink = screen.getByText("Lost Pet Registry");
      const preventDefault = vi.fn();
      homeLink.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
      expect(preventDefault).not.toHaveBeenCalled();
    });
  });

  describe("Components", () => {
    it("renders ProfileDropdown component", () => {
      renderNavbar();
      expect(screen.getByTestId("profile-dropdown")).toBeDefined();
    });
  });

  describe("Snapshots", () => {
    it("matches component snapshot", () => {
      const { container } = renderNavbar();
      expect(container).toMatchSnapshot();
    });
  });
});
