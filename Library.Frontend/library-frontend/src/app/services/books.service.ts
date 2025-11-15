import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
}

export interface Book {
  id: number;
  title: string;
  genre: string;
  availableCopies: number;
  authorName: string;
}

// Matches CreateBookDto in C#:
// Title, Genre, AuthorId, AvailableCopies
export interface CreateBookPayload {
  title: string;
  genre: string;
  authorId: number;
  availableCopies: number;
}

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http
      .get<ApiResponse<Book[]>>(`${this.baseUrl}/api/books`)
      .pipe(map((res) => res.data));
  }

  createBook(payload: CreateBookPayload): Observable<Book> {
    return this.http
      .post<ApiResponse<Book>>(`${this.baseUrl}/api/books`, payload)
      .pipe(map((res) => res.data));
  }
}
