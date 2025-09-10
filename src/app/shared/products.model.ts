import { SortDirection, LanguageCode } from './shared.model';

export interface IProductsQueryOptions {
  pageNumber: number;
  pageSize: number;
  search?: string;
  sort?: {
    key: ProductSortKey;
    dir: SortDirection;
  };
}

export interface IProductsResponse {
  pageSize: number;
  pageNumber: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  results: IProduct[];
}

export interface IProduct {
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

export type ProductSortKey = 'name' | 'price' | 'unitsInStock';

export type ProductSortOption = {
  label: string;
  value: {
    key: ProductSortKey;
    dir: SortDirection;
  };
};

export interface IProductSaveResult {
  success: boolean;
  message: string;
}

export type UpdateProductTranslationRequest = {
  productId: number;
  languageCode: LanguageCode;
  name: string;
  description: string;
};
