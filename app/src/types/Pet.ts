import { ImageProps } from "./common/Image";
import { PaginationProps } from "./common/Pagination";
import { SelectChangeEvent } from "@mui/material";

export interface PetProps {
  id: number;
  name: string;
  species: string;
  breed1: string;
  breed2: string | null;
  color1: string;
  color2: string | null;
  color3: string | null;
  gender: string | null;
  isAltered: boolean | null;
  microchipId: string | null;
  reportId: number | null;
  status: 'home' | 'missing';
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  image: ImageProps;
}

export interface PetPropsState {
  data: PetProps[];
  query: string;
  perPage: number;
}

export interface GetPetsResponse {
  data: PetProps[];
  pagination: PaginationProps;
}

export interface PetPropsForm {
  name: string;
  species: string;
  breed1: string;
  breed2: string | null;
  color1: string;
  color2: string | null;
  color3: string | null;
  gender: string | null;
  isAltered: boolean | null;
  microchipId: string | null;
  image: ImageProps;
  createdAt?: string;
  updatedAt?: string;
}

export interface PetCardProps {
  pet: PetProps;
  currentPage: number;
  currentQuery: string;
}

export interface PetsGridProps {
  pets: PetProps[];
  currentPage: number;
  currentQuery: string;
  pagination?: {
    pages: number;
    count: number;
    page: number;
    items: number;
  };
  onPageChange?: (page: number) => void;
}

export interface EditPetFormProps {
  formData: PetPropsForm;
  handleInputChange: (e: FormInputEvent) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveChanges: (e: React.FormEvent) => void;
  handleCancelChanges: () => void;
  isSaving: boolean;
  imageSrc: string | null;
  handleImageLoad: () => void;
  handleImageError: () => void;
  speciesOptions: string[];
  breedOptions: string[];
  getFilteredBreedOptions: (excludeBreeds: string[]) => string[];
  colorOptions: string[];
  getFilteredColorOptions: (excludeColors: string[]) => string[];
  genderOptions: string[];
}

export interface ViewPetFormProps {
  pet: PetProps;
  onEditClick: () => void;
  onBackClick: () => void;
  imageSrc: string;
  handleImageLoad: () => void;
  handleImageError: () => void;
}

export interface ShowPetFormContainerProps {
  pet: PetProps;
  errors?: string[];
  notification?: any;
  onNotificationClose?: () => void;
}

export interface PetBasicInfoFieldsProps {
  formData: PetPropsForm;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => void;
  readOnly?: boolean;
  error?: string;
}

export interface PetColorFieldsProps {
  formData: PetPropsForm;
  isLoading: boolean;
  handleColor1Change: (color: string) => void;
  handleColor2Change: (color: string) => void;
  handleColor3Change: (color: string) => void;
  error?: string;
}

export type PetFormInputEvent =
  | SelectChangeEvent
  | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | { target: { name: string; value: string | boolean | null } };

export interface PetIdentificationFieldsProps {
  formData: PetPropsForm;
  onInputChange: (e: PetFormInputEvent) => void;
  isLoading: boolean;
  error: string;
  breedError: string;
  alteredError: string;
  microchipError?: string;
}

export interface PetImageUploadProps {
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  preview: string | null;
  disabled?: boolean;
  onImageLoad?: () => void;
  onImageError?: () => void;
  error?: string;
}

export interface PetResponse {
  pet: PetProps;
  message: string;
}

export interface UpdatePetResponse {
  message: string;
  pet: PetProps;
}
