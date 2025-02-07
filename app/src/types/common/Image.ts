export interface ImageProps {
  id?: string;
  url?: string;
  thumbnailUrl?: string;
  variantUrl?: string;
  filename?: string;
  publicId?: string;
  thumbnail_url?: string;
}

export interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  preview: string;
  disabled?: boolean;
  onImageLoad?: () => void;
  onImageError?: () => void;
  error?: string;
}
