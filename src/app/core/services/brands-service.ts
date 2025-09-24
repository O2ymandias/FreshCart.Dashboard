import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment';
import { BrandResult } from '../../shared/models/brands-model';
import {
  BrandOrCategoryTranslation,
  SaveResult,
} from '../../shared/models/shared.model';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  private readonly _httpClient = inject(HttpClient);

  getBrands$() {
    const url = `${environment.apiUrl}/products/brands`;
    return this._httpClient.get<BrandResult[]>(url);
  }

  getBrand$(brandId: number) {
    const url = `${environment.apiUrl}/products/brands/${brandId}`;
    return this._httpClient.get<BrandResult>(url);
  }

  getBrandTranslations$(brandId: number) {
    const url = `${environment.apiUrl}/translations/brands/${brandId}`;
    return this._httpClient.get<BrandOrCategoryTranslation[]>(url);
  }

  updateBrand(formData: FormData) {
    const url = `${environment.apiUrl}/products/brands`;
    return this._httpClient.put<SaveResult>(url, formData);
  }

  createBrand(formData: FormData) {
    const url = `${environment.apiUrl}/products/brands`;
    return this._httpClient.post<SaveResult>(url, formData);
  }

  deleteBrand(brandId: number) {
    const url = `${environment.apiUrl}/products/brands/${brandId}`;
    return this._httpClient.delete<SaveResult>(url);
  }
}
