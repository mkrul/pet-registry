import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react";
import userEvent from "@testing-library/user-event";
import NewReportForm from "../NewReportForm";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { reportsApi } from "../../../../redux/features/reports/reportsApi";
import { MemoryRouter } from "react-router-dom";
import { routerConfig } from "../../../../config/router";
import { NotificationType } from "../../../../types/common/Notification";

// Mock the API and its middleware
vi.mock("../../../../redux/features/reports/reportsApi", () => {
  const useGetNewReportQuery = vi.fn(() => ({ isLoading: false }));
  const useSubmitReportMutation = vi.fn(() => [
    vi.fn().mockResolvedValue({ report: { id: 1 } }),
    { isLoading: false, reset: () => {}, originalArgs: undefined }
  ]);

  return {
    reportsApi: {
      useGetNewReportQuery,
      useSubmitReportMutation,
      middleware: () => () => (next: (action: unknown) => unknown) => (action: unknown) =>
        next(action),
      reducer: () => ({}),
      reducerPath: "reportsApi"
    },
    useGetNewReportQuery,
    useSubmitReportMutation
  };
});

// Mock the custom hooks
vi.mock("../../../../hooks/useReportForm", () => {
  let showBreed2 = false;
  let showColor2 = false;
  let showColor3 = false;
  let selectedImage: File | null = null;
  let imagePreview = "data:image/png;base64,test";
  let formData = {
    title: "",
    description: "",
    species: "Dog",
    breed1: "Labrador",
    breed2: null,
    color1: "Black",
    color2: null,
    color3: null,
    name: "",
    gender: "",
    image: {
      id: "",
      url: "",
      thumbnailUrl: "",
      variantUrl: "",
      filename: "",
      publicId: ""
    },
    microchipId: "",
    area: null,
    state: null,
    country: null,
    latitude: null,
    longitude: null
  };

  return {
    useReportForm: () => ({
      formData,
      setFormData: (newData: typeof formData) => {
        formData = newData;
      },
      showBreed2,
      setShowBreed2: (value: boolean) => {
        showBreed2 = value;
      },
      showColor2,
      setShowColor2: (value: boolean) => {
        showColor2 = value;
      },
      showColor3,
      setShowColor3: (value: boolean) => {
        showColor3 = value;
      },
      selectedImage,
      setSelectedImage: vi.fn((file: File | null) => {
        selectedImage = file;
      }),
      imagePreview,
      setImagePreview: vi.fn((preview: string) => {
        imagePreview = preview;
      }),
      handleInputChange: vi.fn(e => {
        formData = {
          ...formData,
          [e.target.name]: e.target.value
        };
      }),
      handleSpeciesChange: vi.fn(),
      handleLocationSelect: vi.fn(),
      onShowBreed2Change: vi.fn((value: boolean) => {
        showBreed2 = value;
      })
    })
  };
});

// Mock navigation
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

// Add useReportSubmit mock
vi.mock("../../../../hooks/useReportSubmit", () => ({
  useReportSubmit: () => ({
    handleSubmit: vi.fn(),
    notification: {
      type: NotificationType.ERROR,
      message: "Title is required"
    },
    setNotification: vi.fn()
  })
}));

const renderNewReportForm = () => {
  const store = configureStore({
    reducer: {
      [reportsApi.reducerPath]: reportsApi.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(reportsApi.middleware)
  });

  return render(
    <Provider store={store}>
      <MemoryRouter future={routerConfig.future}>
        <NewReportForm />
      </MemoryRouter>
    </Provider>
  );
};

describe("NewReportForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Increase timeout for async tests
  vi.setConfig({ testTimeout: 10000 });

  it("renders the form", () => {
    renderNewReportForm();
    expect(screen.getByTestId("report-form")).toBeDefined();
  });

  it("displays form description", () => {
    renderNewReportForm();
    expect(screen.getByTestId("report-form-text")).toBeDefined();
  });

  it("renders all form sections", () => {
    renderNewReportForm();

    // Basic info fields
    expect(screen.getByTestId("report-form-title")).toBeDefined();
    expect(screen.getByTestId("report-form-description")).toBeDefined();
    expect(screen.getByTestId("report-form-name")).toBeDefined();

    // Identification fields
    expect(screen.getByTestId("microchip-id-input")).toBeDefined();
    expect(screen.getByTestId("gender-select")).toBeDefined();
    expect(screen.getByTestId("species-select")).toBeDefined();
    expect(screen.getAllByTestId("breed-search-form-control")[0]).toBeDefined();

    // Image upload
    expect(screen.getByTestId("image-upload-container")).toBeDefined();
    expect(screen.getByRole("button", { name: "Choose File" })).toBeDefined();

    // Location select
    expect(screen.getByTestId("report-location-select")).toBeDefined();

    // Submit button
    expect(screen.getByRole("button", { name: /submit/i })).toBeDefined();
  });

  it("shows validation error when submitting empty form", async () => {
    renderNewReportForm();

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await act(async () => {
      await userEvent.click(submitButton);
    });

    await waitFor(
      () => {
        const notification = screen.getByTestId("notification");
        expect(notification).toBeDefined();
        expect(notification).toHaveTextContent("Title is required");
      },
      { timeout: 3000 }
    );
  });

  it("handles image upload", async () => {
    const file = new File(["test"], "test.png", { type: "image/png" });
    const store = configureStore({
      reducer: {
        [reportsApi.reducerPath]: reportsApi.reducer
      },
      middleware: getDefaultMiddleware => getDefaultMiddleware().concat(reportsApi.middleware)
    });

    renderNewReportForm();

    const uploadButton = screen.getByTestId("image-upload-button");
    const input = uploadButton.querySelector('input[type="file"]') as HTMLInputElement;

    await act(async () => {
      await userEvent.upload(input, file);
    });

    // Wait for preview to appear
    await waitFor(() => {
      expect(screen.getByTestId("image-preview-image")).toBeDefined();
    });
  });

  it("shows breed2 field when add breed button is clicked", async () => {
    const store = configureStore({
      reducer: {
        [reportsApi.reducerPath]: reportsApi.reducer
      },
      middleware: getDefaultMiddleware => getDefaultMiddleware().concat(reportsApi.middleware)
    });

    const { rerender } = renderNewReportForm();

    const addBreedButton = screen.getByRole("button", { name: "+ ADD ANOTHER BREED" });
    await act(async () => {
      await userEvent.click(addBreedButton);
    });

    rerender(
      <Provider store={store}>
        <MemoryRouter future={routerConfig.future}>
          <NewReportForm />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(
      () => {
        expect(screen.getAllByTestId("breed-search-form-control").length).toBe(2);
      },
      { timeout: 3000 }
    );
  });

  it("displays loading spinner when form is submitting", async () => {
    vi.mocked(reportsApi.useSubmitReportMutation).mockImplementation(() => [
      vi.fn(),
      { isLoading: true, reset: () => {}, originalArgs: undefined }
    ]);

    renderNewReportForm();

    await waitFor(() => {
      const submitButton = screen.getByRole("button", { name: /submit/i });
      expect(submitButton).toBeDefined();
      expect(submitButton).toBeDisabled();
    });
  });

  it("matches snapshot", () => {
    const { container } = renderNewReportForm();
    expect(container).toMatchSnapshot();
  });
});
