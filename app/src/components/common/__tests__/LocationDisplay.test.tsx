import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import LocationDisplay from "../LocationDisplay";

describe("LocationDisplay", () => {
  const testCases = [
    {
      name: "renders full location with all props",
      props: { area: "Brooklyn", state: "New York", country: "USA" },
      expected: "Brooklyn, New York, USA"
    },
    {
      name: "renders location with area and country only",
      props: { area: "Paris", country: "France" },
      expected: "Paris, France"
    },
    {
      name: "renders location with state and country only",
      props: { state: "Victoria", country: "Australia" },
      expected: "Victoria, Australia"
    },
    {
      name: "renders single location part",
      props: { country: "Japan" },
      expected: "Japan"
    }
  ];

  testCases.forEach(({ name, props, expected }) => {
    it(name, () => {
      render(<LocationDisplay {...props} />);
      const location = screen.getByText(expected);
      expect(location).toBeDefined();
      expect(location).toHaveClass("text-gray-500", "mt-2");
    });
  });

  it("returns null when no location props are provided", () => {
    const { container } = render(<LocationDisplay />);
    expect(container.firstChild).toBeNull();
  });

  it("handles empty string props by filtering them out", () => {
    render(<LocationDisplay area="" state="California" country="" />);
    expect(screen.getByText("California")).toBeDefined();
  });

  it("matches snapshot with full location", () => {
    const { container } = render(
      <LocationDisplay area="Manhattan" state="New York" country="USA" />
    );
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot with partial location", () => {
    const { container } = render(<LocationDisplay state="Ontario" country="Canada" />);
    expect(container).toMatchSnapshot();
  });
});