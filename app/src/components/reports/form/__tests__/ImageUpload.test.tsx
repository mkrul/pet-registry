import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { ImageUpload } from "../ImageUpload";

describe("ImageUpload", () => {
  const mockOnImageSelect = vi.fn();
  const defaultProps = {
    onImageSelect: mockOnImageSelect,
    preview: undefined,
    disabled: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders correctly", () => {
    const { container } = render(<ImageUpload {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it("displays the choose file button", () => {
    render(<ImageUpload {...defaultProps} />);
    const button = screen.getByRole("button", { name: /choose file/i });
    expect(button).toBeDefined();
  });

  it("shows preview image when preview prop is provided", () => {
    const previewUrl = "test-image-url.jpg";
    render(<ImageUpload {...defaultProps} preview={previewUrl} />);
    const previewImage = screen.getByAltText("Selected");
    expect(previewImage).toBeDefined();
    expect(previewImage).toHaveAttribute("src", previewUrl);
  });

  it("handles file selection with valid image", () => {
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    render(<ImageUpload {...defaultProps} />);

    const input = screen.getByTestId("file-input") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    expect(mockOnImageSelect).toHaveBeenCalledWith(file);
  });

  it("rejects files larger than 5MB", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    // Create a mock file that's larger than 5MB
    const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], "large.jpg", {
      type: "image/jpeg"
    });

    render(<ImageUpload {...defaultProps} />);

    const input = screen.getByTestId("file-input") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [largeFile] } });

    expect(alertSpy).toHaveBeenCalledWith("File size exceeds 5MB.");
    expect(mockOnImageSelect).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it("rejects invalid file types", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const invalidFile = new File(["test"], "test.txt", { type: "text/plain" });

    render(<ImageUpload {...defaultProps} />);

    const input = screen.getByTestId("file-input") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [invalidFile] } });

    expect(alertSpy).toHaveBeenCalledWith(
      "Unsupported file type. Please upload a JPEG, PNG, or GIF image."
    );
    expect(mockOnImageSelect).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it("disables input when disabled prop is true", () => {
    render(<ImageUpload {...defaultProps} disabled={true} />);

    const button = screen.getByRole("button", { name: /choose file/i });
    const input = screen.getByTestId("file-input") as HTMLInputElement;

    expect(button).toHaveClass("Mui-disabled");
    expect(input).toBeDisabled();
  });

  it("accepts valid image types", async () => {
    const validTypes = ["image/jpeg", "image/png", "image/gif"];

    for (const type of validTypes) {
      cleanup();
      const file = new File(["test"], `test.${type.split("/")[1]}`, { type });
      render(<ImageUpload {...defaultProps} />);

      const input = screen.getByTestId("file-input") as HTMLInputElement;
      fireEvent.change(input, { target: { files: [file] } });

      expect(mockOnImageSelect).toHaveBeenCalledWith(file);
    }
  });
});
