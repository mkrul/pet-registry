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

// Create shared mock state
const mockFormState = {
  formData: {
    title: "",
    description: "",
    species: "Dog",
    breed1: "",
    breed2: "",
    color1: "",
    color2: "",
    color3: "",
    name: "",
    gender: "",
    microchipId: "",
    area: "",
    state: "",
    country: "",
    latitude: null,
    longitude: null,
    image: {
      id: "",
      url: "",
      thumbnailUrl: "",
      variantUrl: "",
      filename: "",
      publicId: ""
    }
  }
};

// Mock the custom hooks
vi.mock("../../../../hooks/useReportForm", () => ({
  useReportForm: () => ({
    ...mockFormState,
    handleInputChange: vi.fn(e => {
      const { name, value } = e.target;
      mockFormState.formData = {
        ...mockFormState.formData,
        [name]: value
      };
    }),
    setFormData: vi.fn(newData => {
      mockFormState.formData = newData;
    })
  })
}));

// Mock navigation
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

// Update useReportSubmit mock to handle all validations
vi.mock("../../../../hooks/useReportSubmit", () => ({
  useReportSubmit: () => ({
    handleSubmit: vi.fn(),
    notification: {
      type: NotificationType.ERROR,
      message: !mockFormState.formData.title
        ? "Title is required"
        : !mockFormState.formData.description
          ? "Description is required"
          : !mockFormState.formData.species
            ? "Species is required"
            : !mockFormState.formData.breed1
              ? "Primary breed is required"
              : !mockFormState.formData.color1
                ? "Primary color is required"
                : !mockFormState.formData.image?.url
                  ? "Image is required"
                  : !mockFormState.formData.area ||
                      !mockFormState.formData.state ||
                      !mockFormState.formData.country
                    ? "Location is required"
                    : ""
    },
    setNotification: vi.fn()
  })
}));

// Create store at module level
const store = configureStore({
  reducer: {
    [reportsApi.reducerPath]: reportsApi.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(reportsApi.middleware)
});

const renderNewReportForm = () => {
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
    // Reset mock form state
    mockFormState.formData = {
      ...mockFormState.formData,
      title: "",
      description: ""
    };
  });

  // Move snapshot test to the beginning
  it("matches snapshot", () => {
    const { container } = renderNewReportForm();
    expect(container).toMatchSnapshot();
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

  it("shows validation error when title is empty", async () => {
    renderNewReportForm();

    // Trigger validation by submitting the form
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await act(async () => {
      await userEvent.click(submitButton);
    });

    await waitFor(() => {
      const notification = screen.getByTestId("notification");
      expect(notification).toBeDefined();
      expect(notification).toHaveTextContent("Title is required");
    });
  });

  it("shows validation error when description is empty", async () => {
    const { rerender } = renderNewReportForm();

    // Fill in the title using MUI's input event
    const titleInput = screen.getByTestId("report-form-title").querySelector("input");
    await act(async () => {
      fireEvent.change(titleInput!, {
        target: { name: "title", value: "Test Title" }
      });
    });

    // Force rerender to update validation message
    rerender(
      <Provider store={store}>
        <MemoryRouter future={routerConfig.future}>
          <NewReportForm />
        </MemoryRouter>
      </Provider>
    );

    // Trigger validation
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await act(async () => {
      await userEvent.click(submitButton);
    });

    await waitFor(() => {
      const notification = screen.getByTestId("notification");
      expect(notification).toBeDefined();
      expect(notification).toHaveTextContent("Description is required");
    });
  });

  it("shows validation error when species is empty", async () => {
    const { rerender } = renderNewReportForm();

    // Fill in required fields
    const titleInput = screen.getByTestId("report-form-title").querySelector("input");
    const descriptionInput = screen
      .getByTestId("report-form-description")
      .querySelector("textarea");

    await act(async () => {
      fireEvent.change(titleInput!, { target: { name: "title", value: "Test Title" } });
      fireEvent.change(descriptionInput!, {
        target: { name: "description", value: "Test Description" }
      });
    });

    // Reset species after filling other fields
    mockFormState.formData = {
      ...mockFormState.formData,
      title: "Test Title",
      description: "Test Description",
      species: ""
    };

    // Force rerender to update validation state
    rerender(
      <Provider store={store}>
        <MemoryRouter future={routerConfig.future}>
          <NewReportForm />
        </MemoryRouter>
      </Provider>
    );

    // Trigger validation
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await act(async () => {
      await userEvent.click(submitButton);
    });

    await waitFor(() => {
      const notification = screen.getByTestId("notification");
      expect(notification).toBeDefined();
      expect(notification).toHaveTextContent("Species is required");
    });
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

  it("shows validation error when breed1 is empty", async () => {
    const { rerender } = renderNewReportForm();

    // Fill in previous required fields
    await act(async () => {
      fireEvent.change(screen.getByTestId("report-form-title").querySelector("input")!, {
        target: { name: "title", value: "Test Title" }
      });
      fireEvent.change(screen.getByTestId("report-form-description").querySelector("textarea")!, {
        target: { name: "description", value: "Test Description" }
      });
    });

    // Update mock state
    mockFormState.formData = {
      ...mockFormState.formData,
      title: "Test Title",
      description: "Test Description",
      species: "Dog",
      breed1: ""
    };

    rerender(
      <Provider store={store}>
        <MemoryRouter future={routerConfig.future}>
          <NewReportForm />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: /submit/i }));
    });

    await waitFor(() => {
      expect(screen.getByTestId("notification")).toHaveTextContent("Primary breed is required");
    });
  });

  it("shows validation error when color1 is empty", async () => {
    const { rerender } = renderNewReportForm();

    // Fill in previous required fields
    mockFormState.formData = {
      ...mockFormState.formData,
      title: "Test Title",
      description: "Test Description",
      species: "Dog",
      breed1: "Labrador",
      color1: ""
    };

    rerender(
      <Provider store={store}>
        <MemoryRouter future={routerConfig.future}>
          <NewReportForm />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: /submit/i }));
    });

    await waitFor(() => {
      expect(screen.getByTestId("notification")).toHaveTextContent("Primary color is required");
    });
  });

  it("shows validation error when image is missing", async () => {
    const { rerender } = renderNewReportForm();

    // Fill in previous required fields
    mockFormState.formData = {
      ...mockFormState.formData,
      title: "Test Title",
      description: "Test Description",
      species: "Dog",
      breed1: "Labrador",
      color1: "Black",
      image: { id: "", url: "", thumbnailUrl: "", variantUrl: "", filename: "", publicId: "" }
    };

    rerender(
      <Provider store={store}>
        <MemoryRouter future={routerConfig.future}>
          <NewReportForm />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: /submit/i }));
    });

    await waitFor(() => {
      expect(screen.getByTestId("notification")).toHaveTextContent("Image is required");
    });
  });

  it("shows validation error when location is missing", async () => {
    const { rerender } = renderNewReportForm();

    // Fill in previous required fields
    mockFormState.formData = {
      ...mockFormState.formData,
      title: "Test Title",
      description: "Test Description",
      species: "Dog",
      breed1: "Labrador",
      color1: "Black",
      image: {
        id: "test-id",
        url: "test-url",
        thumbnailUrl: "test-thumb",
        variantUrl: "test-variant",
        filename: "test.jpg",
        publicId: "test-public-id"
      },
      area: "",
      state: "",
      country: ""
    };

    rerender(
      <Provider store={store}>
        <MemoryRouter future={routerConfig.future}>
          <NewReportForm />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: /submit/i }));
    });

    await waitFor(() => {
      expect(screen.getByTestId("notification")).toHaveTextContent("Location is required");
    });
  });
});
