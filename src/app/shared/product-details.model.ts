import { LanguageCode } from './shared.model';

export interface IProductDetails {
  id: number;
  name: string;
  description: string;
  pictureUrl: string;
  price: number;
  brand: string;
  category: string;
  unitsInStock: number;
  inStock: boolean;
}

export interface IProductGallery {
  pictureUrl: string;
  altText: string;
}

export interface IProductTranslation {
  languageCode: LanguageCode;
  name: string;
  description: string;
}
