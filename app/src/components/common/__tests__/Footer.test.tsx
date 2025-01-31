import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import Footer from "../Footer";

vi.mock("../NavLink", () => ({
  default: ({ children, linkTo }: { children: React.ReactNode; linkTo: string }) => (
    <a href={linkTo} data-testid="nav-link">
      {children}
    </a>
  )
}));

describe("Footer", () => {
  const currentYear = new Date().getFullYear();

  beforeAll(() => {
    vi.setSystemTime(new Date(currentYear, 0, 1));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders footer with current year", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const copyrightText = screen.getByText(/Lost Pet Registry/);
    expect(copyrightText).toBeDefined();
    expect(copyrightText.textContent).toContain(currentYear.toString());
    expect(copyrightText.textContent).toContain("All rights reserved");
  });

  it("renders all navigation links", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const navLinks = screen.getAllByTestId("nav-link");
    const expectedLinks = [
      { text: "Reports", path: "/reports" },
      { text: "About", path: "#" },
      { text: "Contact", path: "#" },
      { text: "Search", path: "/reports" }
    ];

    expect(navLinks).toHaveLength(expectedLinks.length);

    navLinks.forEach((link, index) => {
      expect(link).toHaveAttribute("href", expectedLinks[index].path);
      expect(link).toHaveTextContent(expectedLinks[index].text);
    });
  });

  it("applies correct styling classes", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass("bg-base-200", "py-6");

    const container = footer.firstChild;
    expect(container).toHaveClass("container", "mx-auto", "px-4", "text-center");

    const copyrightDiv = screen.getByText(/Lost Pet Registry/).parentElement;
    expect(copyrightDiv).toHaveClass("mt-4", "text-sm", "text-gray-500");
  });

  it("matches snapshot", () => {
    const { container } = render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const yearElement = container.querySelector("p");
    if (yearElement) {
      yearElement.textContent =
        yearElement.textContent?.replace(currentYear.toString(), "YEAR") ?? null;
    }

    expect(container).toMatchSnapshot();
  });
});
