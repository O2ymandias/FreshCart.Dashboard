import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment';
import {
  UsersQueryOptions,
  UsersResponse,
} from '../../shared/models/users-model';

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
}
