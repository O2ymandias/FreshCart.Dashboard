import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment';
import { BrandResult, BrandTranslation } from '../../shared/brands-model';
import { SaveResult } from '../../shared/shared.model';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  private readonly _httpClient = inject(HttpClient);

  getBrands$() {
    const url = `${environment.apiUrl}/products/brands`;
    return this._httpClient.get<BrandResult[]>(url);
  }

  getBrandTranslations$(brandId: number) {
    const url = `${environment.apiUrl}/translations/brands/${brandId}`;
    return this._httpClient.get<BrandTranslation[]>(url);
  }

  updateBrand(formData: FormData) {
    const url = `${environment.apiUrl}/products/brands`;
    return this._httpClient.put<SaveResult>(url, formData);
  }

  createBrand(formData: FormData) {
    const url = `${environment.apiUrl}/products/brands`;
    return this._httpClient.post<SaveResult>(url, formData);
  }
}
