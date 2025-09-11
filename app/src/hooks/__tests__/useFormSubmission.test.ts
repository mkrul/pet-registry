import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useFormSubmission } from "../useFormSubmission";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate
}));

describe("useFormSubmission", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("navigates to report page on successful submission", async () => {
    const mockHandleSubmit = vi.fn().mockResolvedValue({ id: 123 });

    const { result } = renderHook(() => useFormSubmission(mockHandleSubmit));

    const mockEvent = {} as any;
    const formData = {} as any;
    const selectedImage = null;

    await result.current.onSubmit(mockEvent, formData, selectedImage);

    expect(mockHandleSubmit).toHaveBeenCalledWith(formData, selectedImage);
    expect(mockNavigate).toHaveBeenCalledWith("/reports/123");
  });

  it("handles validation errors without navigation", async () => {
    const validationError = {
      validationErrors: ["cannot be blank"],
      message: "Validation failed"
    };

    const mockHandleSubmit = vi.fn().mockRejectedValue(validationError);
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const { result } = renderHook(() => useFormSubmission(mockHandleSubmit));

    const mockEvent = {} as any;
    const formData = {} as any;
    const selectedImage = null;

    await result.current.onSubmit(mockEvent, formData, selectedImage);

    expect(mockHandleSubmit).toHaveBeenCalledWith(formData, selectedImage);
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith("Validation errors:", ["cannot be blank"]);

    consoleSpy.mockRestore();
  });

  it("handles other errors without navigation", async () => {
    const otherError = new Error("Network error");

    const mockHandleSubmit = vi.fn().mockRejectedValue(otherError);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => useFormSubmission(mockHandleSubmit));

    const mockEvent = {} as any;
    const formData = {} as any;
    const selectedImage = null;

    await result.current.onSubmit(mockEvent, formData, selectedImage);

    expect(mockHandleSubmit).toHaveBeenCalledWith(formData, selectedImage);
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith("Form submission error:", otherError);

    consoleSpy.mockRestore();
  });
});
