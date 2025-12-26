import { APIRequestContext } from "@playwright/test";

export class ApiHelper {
  constructor(private request: APIRequestContext) { }

  // AUTHORS
  async createAuthor(data: { name: string; nationality: string }) {
    const res = await this.request.post("/api/authors", { data });
    return res.json();
  }

  async getAuthors() {
    const res = await this.request.get("/api/authors");
    return res.json();
  }

  async deleteAuthor(id: number) {
    const res = await this.request.delete(`/api/authors/${id}`);
    return res.json();
  }

  // BOOKS
  async createBook(data: {
    title: string;
    genre: string;
    authorId: number;
    availableCopies: number;
  }) {
    const res = await this.request.post("/api/books", { data });
    return res.json();
  }

  async getBooks() {
    const res = await this.request.get("/api/books");
    return res.json();
  }

  async updateBook(
    id: number,
    data: {
      title: string;
      genre: string;
      authorId: number;
      availableCopies: number;
    }
  ) {
    const res = await this.request.put(`/api/books/${id}`, { data });
    return res.json();
  }

  async deleteBook(id: number) {
    const res = await this.request.delete(`/api/books/${id}`);
    return res.json();
  }

  // BORROWING
  async borrowBook(userName: string, bookId: number) {
    const res = await this.request.post(`/api/borrow/borrow`, {
      data: { userName, bookId }
    });
    return res.json();
  }

  async returnBook(borrowId: number) {
    const res = await this.request.post(`/api/borrow/return/${borrowId}`);
    return res.json();
  }

  async getUserBorrows(userName: string) {
    const res = await this.request.get(`/api/borrow/user/${userName}`);
    return res.json();
  }
}
