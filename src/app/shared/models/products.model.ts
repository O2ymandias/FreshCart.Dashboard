import { SortDirection, LanguageCode } from './shared.model';

export type ProductsQueryOptions = {
  pageNumber: number;
  pageSize: number;
  search?: string;
  sort?: {
    key: ProductSortKey;
    dir: SortDirection;
  };
  brandId?: number;
  categoryId?: number;
  maxPrice?: number;
  minPrice?: number;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  pictureUrl: string;
  price: number;
  brand: string;
  brandId: number;
  category: string;
  categoryId: number;
  unitsInStock: number;
  inStock: boolean;
};

export type ProductSortKey = 'name' | 'price' | 'unitsInStock';

export type ProductSortOption = {
  label: string;
  value: {
    key: ProductSortKey;
    dir: SortDirection;
  };
};

export type UpdateProductTranslationRequest = {
  productId: number;
  languageCode: LanguageCode;
  name: string;
  description: string;
};
