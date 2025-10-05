import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment';
import {
  AssignToRoleRequestData,
  User,
  UsersQueryOptions,
  UsersResponse,
} from '../../shared/models/users-model';
import { SaveResult } from '../../shared/models/shared.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _httpClient = inject(HttpClient);

  getUsers$(options: UsersQueryOptions) {
    const url = `${environment.apiUrl}/users`;

    let params = new HttpParams()
      .append('pageNumber', options.pageNumber.toString())
      .append('pageSize', options.pageSize.toString());

    if (options.search) {
      params = params.append('search', options.search);
      console.log(options.search);
    }
    if (options.roleId) {
      params = params.append('roleId', options.roleId);
    }

    return this._httpClient.get<UsersResponse>(url, { params });
  }

  assignRolesToUser$(data: AssignToRoleRequestData) {
    const url = `${environment.apiUrl}/users/assign-roles`;
    return this._httpClient.put<SaveResult>(url, data);
  }

  getUser$(id: string) {
    const url = `${environment.apiUrl}/users/${id}`;
    return this._httpClient.get<User>(url);
  }
}
