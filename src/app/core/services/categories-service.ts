import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment';
import { ICategoryResult } from '../../shared/categories.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly _httpClient = inject(HttpClient);

  getCategories$() {
    const url = `${environment.apiUrl}/products/categories`;
    return this._httpClient.get<ICategoryResult[]>(url);
  }
}
