import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment';
import {
  IProductDetails,
  IProductGallery,
  IProductTranslation,
} from '../../shared/product-details.model';
import {
  IProductsQueryOptions,
  IProductsResponse,
  IUpdateProductResult,
  UpdateProductTranslationRequest,
} from '../../shared/products.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly _httpClient = inject(HttpClient);

  getProducts$(options: IProductsQueryOptions) {
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
    return this._httpClient.get<IProductsResponse>(url, { params });
  }

  getProduct$(id: number) {
    const url = `${environment.apiUrl}/products/${id}`;
    return this._httpClient.get<IProductDetails>(url);
  }

  getProductGallery$(id: number) {
    const url = `${environment.apiUrl}/products/gallery/${id}`;
    return this._httpClient.get<IProductGallery[]>(url);
  }

  getProductAverageRating$(productId: number) {
    const url = `${environment.apiUrl}/ratings/average/${productId}`;
    return this._httpClient.get<number>(url);
  }

  getProductTranslations$(productId: number) {
    const url = `${environment.apiUrl}/translations/products/${productId}`;
    return this._httpClient.get<IProductTranslation[]>(url);
  }

  updateProduct$(formData: FormData) {
    const url = `${environment.apiUrl}/products/update`;
    return this._httpClient.put<IUpdateProductResult>(url, formData);
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
    return this._httpClient.post<IUpdateProductResult>(url, formData);
  }

  updateProductTranslation$(requestData: UpdateProductTranslationRequest) {
    const url = `${environment.apiUrl}/translations/products`;
    return this._httpClient.post<IUpdateProductResult>(url, requestData);
  }
}
