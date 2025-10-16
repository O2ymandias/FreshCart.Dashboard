import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment';
import { Role } from '../../shared/models/roles.model';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private readonly _httpClient = inject(HttpClient);
  getRoles$() {
    const url = `${environment.apiUrl}/roles`;
    return this._httpClient.get<Role[]>(url);
  }
}
