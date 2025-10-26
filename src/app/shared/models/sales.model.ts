import { SortDirection } from './shared.model';

export type SalesQueryOptions = {
  pageNumber: number;
  pageSize: number;
  sort?: SalesSort;
};

export type SalesSort = {
  key: SalesSortKey;
  dir: SortDirection;
};

export type SalesSortKey = 'unitsSold' | 'totalSales';

export type SalesSummary = {
  productId: number;
  productName: string;
  productPictureUrl: string;
  unitsSold: number;
  totalSales: number;
};

export type Pagination<T> = {
  pageSize: number;
  pageNumber: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  results: T[];
};

export type SalesSortOption = {
  label: string;
  value: {
    key: SalesSortKey;
    dir: SortDirection;
  };
};
