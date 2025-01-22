import { Species } from "../lib/reports/breedList";
import { ImageProps } from "./common/Image";
import { PaginationProps } from "./common/Pagination";
import { FiltersProps } from "./common/Search";
import { SelectChangeEvent } from "@mui/material";
import { MapLocation } from "../types/common/Map";
import { NotificationState } from "./common/Notification";

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
  recentlyUpdated: boolean;
  recentlyCreated: boolean;
  area: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  intersection: string | null;
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
  intersection: string | null;
  createdAt?: string;
  updatedAt?: string;
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
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
      | { target: { name: string; value: string | null } }
  ) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveChanges: (e: React.FormEvent) => void;
  handleCancelChanges: () => void;
  isSaving: boolean;
  imageSrc: string | null;
  handleImageLoad: () => void;
  handleImageError: () => void;
  showBreed2: boolean;
  showColor2: boolean;
  showColor3: boolean;
  addBreed: () => void;
  removeBreed: () => void;
  addColor: () => void;
  removeColor: (index: number) => void;
  handleLocationSelect: (location: MapLocation) => void;
  speciesOptions: string[];
  breedOptions: string[];
  getFilteredBreedOptions: (excludeBreeds: string[]) => string[];
  colorOptions: string[];
  getFilteredColorOptions: (excludeColors: string[]) => string[];
  genderOptions: string[];
  VIEW_ZOOM_LEVEL: number;
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
  notification?: NotificationState | null;
  onNotificationClose?: () => void;
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
  onInputChange: (
    e: SelectChangeEvent | { target: { name: string; value: string | null } }
  ) => void;
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
  onLocationSelect: (location: MapLocation) => void;
  initialLocation?: {
    latitude: number | null;
    longitude: number | null;
    area?: string;
    state?: string;
    country?: string;
    intersection?: string | null;
  };
}

export interface Report {
  title: string;
  description: string;
  name: string;
  species: string;
  breed1: string;
  breed2: string;
  gender: string;
  microchipId: string;
  color1: string;
  color2: string;
  color3: string;
  area: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  intersection: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportResponse {
  report: ReportProps;
  message: string;
}
