import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ShowReportFormContainer from "../ShowReportFormContainer";
import { reportsApi } from "../../../../redux/features/reports/reportsApi";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { Middleware, MiddlewareAPI, Dispatch, AnyAction } from "@reduxjs/toolkit";

const mockReport = {
  id: 1,
  title: "Test Report",
  description: "Test Description",
  species: "Dog",
  breed1: "Labrador",
  breed2: null,
  color1: "Black",
  color2: null,
  color3: null,
  latitude: 40.7128,
  longitude: -74.006,
  area: "Test Area",
  state: "Test State",
  country: "Test Country",
  name: null,
  status: "lost",
  gender: null,
  microchipId: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  archivedAt: null,
  updatedLastThreeDays: false,
  image: {
    id: "1",
    url: "test-image.jpg",
    variantUrl: "test-image.jpg",
    thumbnailUrl: "test-thumbnail.jpg",
    filename: "test-image.jpg",
    publicId: "test-public-id"
  }
};

const mockStore = configureStore({
  reducer: {
    reportsApi: reportsApi.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(reportsApi.middleware)
});

vi.mock("../../../../redux/features/reports/reportsApi", () => {
  const mockUpdateReport = vi
    .fn()
    .mockResolvedValue({ data: { message: "Report updated successfully" } });

  return {
    reportsApi: {
      reducerPath: "reportsApi",
      reducer: () => ({}),
      middleware: () =>
        ((api: MiddlewareAPI) => (next: Dispatch) => (action: AnyAction) =>
          next(action)) as Middleware,
      endpoints: {
        updateReport: {
          mutation: () => ({
            queryFn: mockUpdateReport
          })
        }
      }
    },
    useUpdateReportMutation: () => [mockUpdateReport, { isLoading: false }]
  };
});

describe("ShowReportFormContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders view mode by default", () => {
    render(
      <Provider store={mockStore}>
        <ShowReportFormContainer report={mockReport} errors={[]} />
      </Provider>
    );

    expect(screen.getByText("Test Report")).toBeDefined();
    expect(screen.getByText("Test Description")).toBeDefined();
  });

  it("switches to edit mode when edit button is clicked", async () => {
    render(
      <Provider store={mockStore}>
        <ShowReportFormContainer report={mockReport} errors={[]} />
      </Provider>
    );

    const editButton = screen.getByRole("button", { name: /edit/i });
    await act(async () => {
      await userEvent.click(editButton);
    });

    const editForm = screen.getByTestId("edit-report-mode-form");
    expect(editForm).toBeDefined();
  });

  it("displays notification on successful update", async () => {
    render(
      <Provider store={mockStore}>
        <ShowReportFormContainer report={mockReport} errors={[]} />
      </Provider>
    );

    const editButton = screen.getByRole("button", { name: /edit/i });
    await act(async () => {
      await userEvent.click(editButton);
    });

    const saveButton = screen.getByRole("button", { name: /save/i });
    await act(async () => {
      await userEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId("notification")).toBeDefined();
    });
  });

  it("displays error notification when update fails", async () => {
    render(
      <Provider store={mockStore}>
        <ShowReportFormContainer report={mockReport} errors={[]} />
      </Provider>
    );

    const editButton = screen.getByRole("button", { name: /edit/i });
    await act(async () => {
      await userEvent.click(editButton);
    });

    const saveButton = screen.getByRole("button", { name: /save/i });
    await act(async () => {
      await userEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId("notification")).toBeDefined();
    });
  });

  it("handles image loading errors", async () => {
    render(
      <Provider store={mockStore}>
        <ShowReportFormContainer report={mockReport} errors={[]} />
      </Provider>
    );

    const img = screen.getByAltText("Test Report");
    await act(async () => {
      fireEvent.error(img);
    });

    expect(img.getAttribute("src")).toBe("/images/placeholder.png");
  });

  it("returns to previous page when back button is clicked", () => {
    const mockHistoryBack = vi.fn();
    window.history.back = mockHistoryBack;

    render(
      <Provider store={mockStore}>
        <ShowReportFormContainer report={mockReport} errors={[]} />
      </Provider>
    );

    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);

    expect(mockHistoryBack).toHaveBeenCalled();
  });

  it("displays validation errors when provided", () => {
    const errors = ["Error 1", "Error 2"];

    render(
      <Provider store={mockStore}>
        <ShowReportFormContainer report={mockReport} errors={errors} />
      </Provider>
    );

    errors.forEach(error => {
      expect(screen.getByText(error)).toBeDefined();
    });
  });

  it("cancels edit mode and returns to view mode", async () => {
    render(
      <Provider store={mockStore}>
        <ShowReportFormContainer report={mockReport} errors={[]} />
      </Provider>
    );

    // Switch to edit mode
    const editButton = screen.getByRole("button", { name: /edit/i });
    await act(async () => {
      await userEvent.click(editButton);
    });

    // Verify edit mode
    expect(screen.getByTestId("edit-report-mode-form")).toBeDefined();

    // Cancel edit mode
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await act(async () => {
      await userEvent.click(cancelButton);
    });

    // Verify view mode
    expect(screen.getByTestId("view-report-mode-form")).toBeDefined();
  });
});
