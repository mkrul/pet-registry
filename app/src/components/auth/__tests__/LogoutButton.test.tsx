import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import LogoutButton from "../LogoutButton";
import authReducer from "../../../redux/features/auth/authSlice";
import { Reducer } from "@reduxjs/toolkit";

const mockLogoutMutation = vi.fn();
const mockDispatch = vi.fn();

// Mock the authApiSlice module
vi.mock("../../../redux/features/auth/authApiSlice", () => ({
  useLogoutMutation: () => [mockLogoutMutation]
}));

// Mock redux hooks
vi.mock("../../../redux/hooks", () => ({
  useAppDispatch: () => mockDispatch
}));

describe("LogoutButton", () => {
  const mockOnCompleted = vi.fn();
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
        api: ((state = {}) => state) as Reducer<any>
      }
    });
    vi.clearAllMocks();
  });

  it("renders logout button correctly", () => {
    render(
      <Provider store={store}>
        <LogoutButton onCompleted={mockOnCompleted} />
      </Provider>
    );

    expect(screen.getByText("Logout")).toBeDefined();
  });

  it("handles successful logout", async () => {
    mockLogoutMutation.mockResolvedValue({ data: { message: "Logged out" } });

    render(
      <Provider store={store}>
        <LogoutButton onCompleted={mockOnCompleted} />
      </Provider>
    );

    const button = screen.getByText("Logout");
    await fireEvent.click(button);

    expect(mockLogoutMutation).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Object)); // clearUser action
    expect(mockOnCompleted).toHaveBeenCalled();
  });

  it("handles logout error gracefully", async () => {
    mockLogoutMutation.mockRejectedValue(new Error("Logout failed"));

    render(
      <Provider store={store}>
        <LogoutButton onCompleted={mockOnCompleted} />
      </Provider>
    );

    const button = screen.getByText("Logout");
    await fireEvent.click(button);

    expect(mockLogoutMutation).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Object)); // clearUser action
    expect(mockOnCompleted).toHaveBeenCalled();
  });

  it("applies custom className", () => {
    const customClass = "custom-class";
    render(
      <Provider store={store}>
        <LogoutButton onCompleted={mockOnCompleted} className={customClass} />
      </Provider>
    );

    const button = screen.getByText("Logout");
    expect(button.className).toContain(customClass);
  });
});
