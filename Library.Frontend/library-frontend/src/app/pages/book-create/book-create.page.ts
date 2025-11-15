import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  BooksService,
  CreateBookPayload,
} from '../../services/books.service';
import { AuthorsService, Author } from '../../services/authors.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-create',
  standalone: true,
  templateUrl: './book-create.page.html',
  styleUrls: ['./book-create.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
})
export class BookCreatePage implements OnInit {
  authors: Author[] = [];
  loadingAuthors = false;
  submitting = false;
  error: string | null = null;

  // form model – matches CreateBookDto / CreateBookPayload
  newBook: CreateBookPayload = {
    title: '',
    genre: '',
    authorId: 0,
    availableCopies: 1,
  };

  constructor(
    private booksService: BooksService,
    private authorsService: AuthorsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAuthors();
  }

  loadAuthors(): void {
    this.loadingAuthors = true;
    this.authorsService.getAuthors().subscribe({
      next: (authors) => {
        this.authors = authors;
        this.loadingAuthors = false;
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'Failed to load authors';
        this.loadingAuthors = false;
      },
    });
  }

  saveBook(): void {
    if (!this.newBook.title.trim() || !this.newBook.genre.trim()) {
      this.error = 'Title and Genre are required';
      return;
    }

    if (!this.newBook.authorId || this.newBook.authorId <= 0) {
      this.error = 'Please select an author';
      return;
    }

    if (this.newBook.availableCopies < 0) {
      this.error = 'Available copies must be 0 or more';
      return;
    }

    this.error = null;
    this.submitting = true;

    this.booksService.createBook(this.newBook).subscribe({
      next: () => {
        this.submitting = false;
        // Go back to books list
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to create book';
        this.submitting = false;
      },
    });
  }
}
