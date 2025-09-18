import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment';
import { BrandResult, BrandTranslation } from '../../shared/brands-model';

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
}
