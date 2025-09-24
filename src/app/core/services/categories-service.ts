import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment';
import { CategoryResult } from '../../shared/models/categories.model';
import {
  BrandOrCategoryTranslation,
  SaveResult,
} from '../../shared/models/shared.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly _httpClient = inject(HttpClient);

  getCategories$() {
    const url = `${environment.apiUrl}/categories`;
    return this._httpClient.get<CategoryResult[]>(url);
  }

  getCategory$(id: number) {
    const url = `${environment.apiUrl}/categories/${id}`;
    return this._httpClient.get<CategoryResult>(url);
  }

  getCategoryTranslations$(categoryId: number) {
    const url = `${environment.apiUrl}/translations/categories/${categoryId}`;
    return this._httpClient.get<BrandOrCategoryTranslation[]>(url);
  }

  createCategory$(formData: FormData) {
    const url = `${environment.apiUrl}/categories`;
    return this._httpClient.post<SaveResult>(url, formData);
  }

  updateCategory$(formData: FormData) {
    const url = `${environment.apiUrl}/categories`;
    return this._httpClient.put<SaveResult>(url, formData);
  }

  deleteCategory$(id: number) {
    const url = `${environment.apiUrl}/categories/${id}`;
    return this._httpClient.delete<SaveResult>(url);
  }
}
