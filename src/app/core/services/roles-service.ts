import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment';
import { Role } from '../../shared/models/roles.model';
import { SaveResult } from '../../shared/models/shared.model';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private readonly _httpClient = inject(HttpClient);

  getRoles$() {
    const url = `${environment.apiUrl}/roles`;
    return this._httpClient.get<Role[]>(url);
  }

  createRole$(roleName: string) {
    const url = `${environment.apiUrl}/roles`;
    return this._httpClient.post<SaveResult>(url, { roleName });
  }

  updateRole$(newRoleName: string, roleId: number) {
    const url = `${environment.apiUrl}/roles/${roleId}`;
    return this._httpClient.put<SaveResult>(url, { newRoleName });
  }

  deleteRole$(roleId: number) {
    const url = `${environment.apiUrl}/roles/${roleId}`;
    return this._httpClient.delete<SaveResult>(url);
  }
}
