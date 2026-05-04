export interface ImageData {
  url: string;
  width: number;
  height: number;
  size: number;
  original: string;

  thumbnails: {
    thumb: string;
    small: string;
    medium: string;
    large: string;
  };
}
