import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment';
import {
  ProductGalleryResult,
  ProductTranslationResult,
} from '../../shared/models/product-details.model';
import {
  Product,
  ProductsQueryOptions,
  ProductsResponse,
  UpdateProductTranslationRequest,
} from '../../shared/models/products.model';
import { SaveResult } from '../../shared/models/shared.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly _httpClient = inject(HttpClient);
  readonly DEFAULT_PAGE_NUMBER = 1;
  readonly DEFAULT_PAGE_SIZE = 10;

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

    const url = `${environment.apiUrl}/products`;
    return this._httpClient.get<ProductsResponse>(url, { params });
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
}
