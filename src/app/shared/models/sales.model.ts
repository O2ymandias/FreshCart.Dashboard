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

export type SalesSortOption = {
  label: string;
  value: {
    key: SalesSortKey;
    dir: SortDirection;
  };
};
