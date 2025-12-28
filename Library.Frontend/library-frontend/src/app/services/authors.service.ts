import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from './books.service';

export interface Author {
  id: number;
  name: string;
  nationality: string;
}

export interface CreateAuthorPayload {
  name: string;
  nationality: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthorsService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAuthors(): Observable<Author[]> {
    return this.http
      .get<ApiResponse<Author[]>>(`${this.baseUrl}/api/authors`)
      .pipe(map((res) => res.data));
  }

  createAuthor(payload: CreateAuthorPayload): Observable<Author> {
    return this.http
      .post<ApiResponse<Author>>(`${this.baseUrl}/api/authors`, payload)
      .pipe(map((res) => res.data));
  }
}
