import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environment';
import {
  ProductGalleryResult,
  ProductTranslationResult,
} from '../../shared/models/product-details.model';
import {
  Product,
  ProductSortOption,
  ProductsQueryOptions,
  UpdateProductTranslationRequest,
} from '../../shared/models/products.model';
import { PaginationResult, SaveResult } from '../../shared/models/shared.model';
import { tap } from 'rxjs';
import { BrandOption } from '../../shared/models/brands-model';
import { CategoryOption } from '../../shared/models/categories.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly _httpClient = inject(HttpClient);
  readonly DEFAULT_PAGE_NUMBER = 1;
  readonly DEFAULT_PAGE_SIZE = 10;

  products = signal<Product[]>([]);

  // Pagination
  pageSize = signal(this.DEFAULT_PAGE_SIZE);
  pageNumber = signal(this.DEFAULT_PAGE_NUMBER);
  totalRecords = signal(0);

  // search
  searchQuery = signal('');

  // sort
  selectedSortOption = signal<ProductSortOption | undefined>(undefined);

  // filtration
  selectedBrandOption = signal<BrandOption | undefined>(undefined);
  selectedCategoryOption = signal<CategoryOption | undefined>(undefined);
  minPrice = signal<number | undefined>(undefined);
  maxPrice = signal<number | undefined>(undefined);

  getProducts$(options: ProductsQueryOptions) {
    const { pageNumber, pageSize } = options;

    let params = new HttpParams()
      .append('pageNumber', pageNumber)
      .append('pageSize', pageSize);

    if (options.search) {
      params = params.append('search', options.search);
    }

    if (options.sort) {
      params = params.append('sort.key', options.sort.key);
      params = params.append('sort.dir', options.sort.dir);
    }

    if (options.brandId) {
      params = params.append('brandId', options.brandId.toString());
    }

    if (options.categoryId) {
      params = params.append('categoryId', options.categoryId.toString());
    }

    if (options.minPrice) {
      params = params.append('minPrice', options.minPrice.toString());
    }

    if (options.maxPrice) {
      params = params.append('maxPrice', options.maxPrice.toString());
    }

    const url = `${environment.apiUrl}/products`;

    return this._httpClient
      .get<PaginationResult<Product>>(url, { params })
      .pipe(
        tap((res) => {
          this.products.set(res.results);
          this.pageNumber.set(res.pageNumber);
          this.pageSize.set(res.pageSize);
          this.totalRecords.set(res.total);
        }),
      );
  }

  getProduct$(id: number) {
    const url = `${environment.apiUrl}/products/${id}`;
    return this._httpClient.get<Product>(url);
  }

  getProductGallery$(id: number) {
    const url = `${environment.apiUrl}/products/gallery/${id}`;
    return this._httpClient.get<ProductGalleryResult[]>(url);
  }

  getProductAverageRating$(productId: number) {
    const url = `${environment.apiUrl}/ratings/average/${productId}`;
    return this._httpClient.get<number>(url);
  }

  getProductTranslations$(productId: number) {
    const url = `${environment.apiUrl}/translations/products/${productId}`;
    return this._httpClient.get<ProductTranslationResult[]>(url);
  }

  createProduct$(formData: FormData) {
    const url = `${environment.apiUrl}/products`;
    return this._httpClient.post<SaveResult>(url, formData);
  }

  updateProduct$(formData: FormData) {
    const url = `${environment.apiUrl}/products`;
    return this._httpClient.put<SaveResult>(url, formData);
  }

  deleteFromProductGallery$(productId: number, imagePath: string) {
    const url = `${environment.apiUrl}/products/gallery`;
    let params = new HttpParams()
      .append('productId', productId)
      .append('imagePath', imagePath);
    return this._httpClient.delete<boolean>(url, { params });
  }

  addToProductGallery$(formData: FormData) {
    const url = `${environment.apiUrl}/products/gallery`;
    return this._httpClient.post<SaveResult>(url, formData);
  }

  updateProductTranslation$(requestData: UpdateProductTranslationRequest) {
    const url = `${environment.apiUrl}/translations/products`;
    return this._httpClient.post<SaveResult>(url, requestData);
  }

  deleteProduct(productId: number) {
    const url = `${environment.apiUrl}/products/${productId}`;
    return this._httpClient.delete<SaveResult>(url);
  }

  reset() {
    this.pageNumber.set(this.DEFAULT_PAGE_NUMBER);
    this.pageSize.set(this.DEFAULT_PAGE_SIZE);
    this.totalRecords.set(0);
    this.searchQuery.set('');
    this.selectedSortOption.set(undefined);
    this.selectedBrandOption.set(undefined);
    this.selectedCategoryOption.set(undefined);
    this.minPrice.set(undefined);
    this.maxPrice.set(undefined);
  }
}
