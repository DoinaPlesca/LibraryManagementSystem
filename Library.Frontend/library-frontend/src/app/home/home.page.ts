import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BooksService, Book } from '../services/books.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, CommonModule, HttpClientModule],
})
export class HomePage implements OnInit {
  books: Book[] = [];
  loading = false;
  error: string | null = null;

  constructor(private booksService: BooksService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.error = null;

    this.booksService.getBooks().subscribe({
      next: (data: Book[]) => {
        this.books = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'Failed to load books';
        this.loading = false;
      },
    });
  }
}
