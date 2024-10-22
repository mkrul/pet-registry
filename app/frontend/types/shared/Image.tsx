export interface IImage {
  id?: number; // Optional because new images won't have an ID yet
  url: string;
  thumbnailUrl: string;
  publicId: string;
}
