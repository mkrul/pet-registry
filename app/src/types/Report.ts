import { Species } from "../lib/reports/breedList";
import { ImageProps } from "./common/Image";
import { PaginationProps } from "./common/Pagination";
import { FiltersProps } from "./common/Search";
import { SelectChangeEvent } from "@mui/material";

export interface ReportProps {
  id: number;
  title: string;
  description: string;
  name: string | null;
  status: string;
  species: string;
  breed1: string;
  breed2: string | null;
  color1: string;
  color2: string | null;
  color3: string | null;
  gender: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  image: ImageProps;
  microchipId: string | null;
  updatedLastThreeDays: boolean;
  area: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface ReportPropsState {
  data: ReportProps[];
  query: string;
}
export interface GetReportsResponse {
  data: ReportProps[];
  pagination: PaginationProps;
}

export interface ReportPropsForm {
  title: string;
  description: string;
  name: string | null;
  species: string;
  breed1: string;
  breed2: string | null;
  color1: string;
  color2: string | null;
  color3: string | null;
  gender: string | null;
  microchipId: string | null;
  image: ImageProps;
  area: string | null;
  state: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface ReportsContainerProps {
  query: string;
  filters: FiltersProps;
  page: number;
  onPageChange: (page: number) => void;
}

export interface ReportCardProps {
  report: ReportProps;
  currentPage: number;
  currentQuery: string;
}

export interface ReportsGridProps {
  reports: ReportProps[];
  currentPage: number;
  currentQuery: string;
}

export interface EditReportFormProps {
  report: ReportProps;
  errors?: string[];
}

export interface UpdateReportResponse {
  message: string;
  report: ReportProps;
}

export interface ReportEditModeProps {
  formData: ReportPropsForm;
  onInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
      | { target: { name: string; value: boolean | null } }
  ) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveChanges: (e: React.FormEvent) => Promise<void>;
  handleCancelChanges: () => void;
  isSaving: boolean;
  imageSrc: string;
  onImageLoad: () => void;
  onImageError: () => void;
  showBreed2: boolean;
  showColor2: boolean;
  showColor3: boolean;
  onAddBreed: () => void;
  onRemoveBreed: () => void;
  onAddColor: () => void;
  onRemoveColor: (index: number) => void;
  onLocationSelect: (location: any) => void;
  speciesOptions: string[];
  breedOptions: string[];
  getFilteredBreedOptions: (selectedBreeds: (string | null)[]) => string[];
  colorOptions: string[];
  getFilteredColorOptions: (selectedColors: (string | null)[]) => string[];
  genderOptions: string[];
  EDIT_ZOOM_LEVEL: number;
}

export interface ReportViewModeProps {
  report: ReportProps;
  onEditClick: () => void;
  onBackClick: () => void;
  imageSrc: string;
  handleImageLoad: () => void;
  handleImageError: () => void;
}

export interface ShowReportFormContainerProps {
  report: ReportProps;
  errors?: string[];
}

export interface BasicInfoFieldsProps {
  formData: ReportPropsForm;
  onInputChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => void;
  readOnly?: boolean;
}

export interface ColorFieldsProps {
  formData: ReportPropsForm;
  showColor2: boolean;
  showColor3: boolean;
  onInputChange: (e: SelectChangeEvent) => void;
  onShowColor2Change: (show: boolean) => void;
  onShowColor3Change: (show: boolean) => void;
  isLoading?: boolean;
}

export interface IdentificationFieldsProps {
  formData: ReportPropsForm;
  showBreed2: boolean;
  onInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
      | { target: { name: string; value: boolean | null } }
  ) => void;
  onBreedChange: (breed: string) => void;
  onBreed2Change: (breed: string) => void;
  onSpeciesChange: (species: Species) => void;
  onShowBreed2Change: (show: boolean) => void;
  isLoading?: boolean;
}

export interface LocationDisplayProps {
  area: string;
  state: string;
  country: string;
}

export interface ReportLocationFilterProps {
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    area: string;
    state: string;
    country: string;
  }) => void;
}
