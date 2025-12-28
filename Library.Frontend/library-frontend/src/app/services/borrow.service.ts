import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from './books.service';

// Backend DTO: BorrowRecordDto
export interface BorrowRecord {
  id: number;
  userName: string;
  bookId: number;
  bookTitle: string;
  borrowDate: string;        // DateTime as ISO string
  returnDate?: string | null;
}

// Backend DTO: CreateBorrowDto
export interface CreateBorrowPayload {
  userName: string;
  bookId: number;
}

@Injectable({
  providedIn: 'root',
})
export class BorrowService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Matches [HttpPost("borrow")] on [Route("api/[controller]")] => /api/borrow/borrow
  borrowBook(payload: CreateBorrowPayload): Observable<BorrowRecord> {
    return this.http
      .post<ApiResponse<BorrowRecord>>(
        `${this.baseUrl}/api/borrow/borrow`,
        payload
      )
      .pipe(map((res) => res.data));
  }

  // Matches [HttpPost("return/{borrowId}")] => /api/borrow/return/{borrowId}
  returnBook(borrowId: number): Observable<BorrowRecord> {
    return this.http
      .post<ApiResponse<BorrowRecord>>(
        `${this.baseUrl}/api/borrow/return/${borrowId}`,
        null
      )
      .pipe(map((res) => res.data));
  }

  getBorrowsByUser(userName: string): Observable<BorrowRecord[]> {
    return this.http
      .get<ApiResponse<BorrowRecord[]>>(
        `${this.baseUrl}/api/borrow/user/${encodeURIComponent(userName)}`
      )
      .pipe(map((res) => res.data));
  }

}
