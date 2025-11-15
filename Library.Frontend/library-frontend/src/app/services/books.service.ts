import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// This matches the C# ApiResponse<T> wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
}

// TODO: adjust these fields to match Library.Core.Dtos.Book.BookDto
export interface Book {
  id: number;
  title: string;
  genre: string;
  availableCopies: number;
  authorName: string;
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

  getBook(id: number): Observable<Book> {
    return this.http
      .get<ApiResponse<Book>>(`${this.baseUrl}/api/books/${id}`)
      .pipe(map((res) => res.data));
  }

  // later you can add create/update/delete using POST/PUT/DELETE
}
