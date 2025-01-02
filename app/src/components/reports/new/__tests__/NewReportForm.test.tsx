import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import NewReportForm from "../NewReportForm";
import reportsReducer from "../../../../redux/features/reports/reportsSlice";
import { Reducer } from "@reduxjs/toolkit";

// Mock declarations must be at the top
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

vi.mock("../../../../redux/features/reports/reportsApi", () => {
  const mockApi = {
    reducerPath: "reportsApi",
    reducer: (state: any = {}, action: any) => state,
    middleware: () => (next: any) => (action: any) => next(action),
    endpoints: {
      getNewReport: { select: () => ({}) }
    }
  };

  return {
    default: mockApi,
    useGetNewReportQuery: () => ({
      data: {},
      isLoading: false,
      error: null
    }),
    useSubmitReportMutation: () => [
      () => Promise.resolve({ report: { id: 1 } }),
      { isLoading: false }
    ]
  };
});

const mockNavigate = vi.fn();
const mockSubmitReport = vi.fn().mockResolvedValue({ report: { id: 1 } });

const createTestStore = () => {
  const mockApi = {
    reducerPath: "reportsApi" as const,
    reducer: (state: any = {}, action: any) => state,
    middleware: () => (next: any) => (action: any) => next(action)
  };

  return configureStore({
    reducer: {
      reports: reportsReducer,
      [mockApi.reducerPath]: mockApi.reducer as Reducer<any>
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(mockApi.middleware)
  });
};

const renderNewReportForm = () => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <NewReportForm />
      </BrowserRouter>
    </Provider>
  );
};

describe("NewReportForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form correctly", () => {
    const { container } = renderNewReportForm();
    expect(container).toMatchSnapshot();
  });

  it("displays basic form fields", async () => {
    renderNewReportForm();

    await waitFor(() => {
      expect(screen.getByTestId("report-form")).toBeDefined();
    });

    expect(screen.getByLabelText(/title/i)).toBeDefined();
    expect(screen.getByLabelText(/description/i)).toBeDefined();
    expect(screen.getByLabelText(/name/i)).toBeDefined();
    expect(screen.getByLabelText(/species/i)).toBeDefined();
  });

  it("handles form submission with valid data", async () => {
    const user = userEvent.setup();
    mockSubmitReport.mockResolvedValueOnce({ report: { id: 1 } });

    renderNewReportForm();

    await waitFor(() => {
      expect(screen.getByTestId("report-form")).toBeDefined();
    });

    // Fill in required fields
    await user.type(screen.getByLabelText(/title/i), "Test Title");
    await user.type(screen.getByLabelText(/description/i), "Test Description");
    await user.type(screen.getByLabelText(/name/i), "Test Name");
    await user.selectOptions(screen.getByLabelText(/species/i), "Dog");
    await user.selectOptions(screen.getByLabelText(/gender/i), "Male");
    await user.selectOptions(screen.getByLabelText(/color/i), "Black");

    // Create and upload test file
    const file = new File(["test"], "test.png", { type: "image/png" });
    const fileInput = screen.getByTestId("image-upload");
    await user.upload(fileInput, file);

    // Submit form
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSubmitReport).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/reports/1");
    });
  });

  it("displays validation error for missing required fields", async () => {
    const user = userEvent.setup();
    renderNewReportForm();

    await waitFor(() => {
      expect(screen.getByTestId("report-form")).toBeDefined();
    });

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/required fields/i)).toBeDefined();
    });
  });

  it("handles image upload correctly", async () => {
    const user = userEvent.setup();
    renderNewReportForm();

    await waitFor(() => {
      expect(screen.getByTestId("report-form")).toBeDefined();
    });

    const file = new File(["test"], "test.png", { type: "image/png" });
    const fileInput = screen.getByLabelText(/choose file/i);
    await user.upload(fileInput, file);

    // Wait for preview to appear after file upload
    await waitFor(() => {
      expect(screen.getByTestId("image-preview")).toBeDefined();
    });
  });

  it("handles API errors gracefully", async () => {
    const user = userEvent.setup();
    mockSubmitReport.mockRejectedValueOnce({
      data: { message: "API Error" }
    });

    renderNewReportForm();

    await waitFor(() => {
      expect(screen.getByTestId("report-form")).toBeDefined();
    });

    // Fill required fields
    await user.type(screen.getByLabelText(/title/i), "Test Title");
    await user.type(screen.getByLabelText(/description/i), "Test Description");

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to create report/i)).toBeDefined();
    });
  });

  it("clears notification when closed", async () => {
    const user = userEvent.setup();
    renderNewReportForm();

    await waitFor(() => {
      expect(screen.getByTestId("report-form")).toBeDefined();
    });

    // Use role with name to find the submit button
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    // Wait for notification to appear
    const notification = await waitFor(() => screen.getByRole("alert"));
    expect(notification).toBeDefined();

    const closeButton = await waitFor(() => screen.getByTestId("notification-close"));
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole("alert")).toBeNull();
    });
  });

  describe("Additional fields behavior", () => {
    it("toggles breed fields correctly", async () => {
      const user = userEvent.setup();
      renderNewReportForm();

      // Increase timeout for this specific test
      await waitFor(
        () => {
          expect(screen.getByTestId("report-form")).toBeDefined();
        },
        { timeout: 10000 }
      );

      const addBreedButton = screen.getByTestId("add-breed-button");
      await user.click(addBreedButton);

      expect(screen.getByTestId("breed2-field")).toBeDefined();

      const removeBreedButtons = screen.getAllByTestId("remove-breed-button");
      await user.click(removeBreedButtons[0]);

      await waitFor(() => {
        expect(screen.queryByTestId("breed2-field")).toBeNull();
      });
    });

    it("toggles color fields correctly", async () => {
      const user = userEvent.setup();
      renderNewReportForm();

      await waitFor(() => {
        expect(screen.getByTestId("report-form")).toBeDefined();
      });

      const addColorButton = screen.getByTestId("add-color-button");
      await user.click(addColorButton);

      expect(screen.getByTestId("color2-field")).toBeDefined();

      await user.click(addColorButton);
      expect(screen.getByTestId("color3-field")).toBeDefined();
    });
  });
});
