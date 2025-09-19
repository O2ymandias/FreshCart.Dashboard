import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment';
import { LanguageCode } from '../../shared/shared.model';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private readonly _httpClient = inject(HttpClient);
  getTranslationsKeys$() {
    const url = `${environment.apiUrl}/translations/keys`;
    return this._httpClient.get<LanguageCode[]>(url);
  }
}
