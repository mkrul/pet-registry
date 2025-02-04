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
  preview: string | null;
  disabled?: boolean;
  onImageLoad?: () => void;
  onImageError?: () => void;
}
