export interface ImageProps {
  id: string;
  url: string;
  thumbnailUrl: string;
  variantUrl: string;
  filename: string;
  publicId: string;
}

export interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  preview?: string;
  disabled?: boolean;
}
