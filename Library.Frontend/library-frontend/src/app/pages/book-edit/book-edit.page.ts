import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  BooksService,
  Book,
  UpdateBookPayload
} from '../../services/books.service';
import {
  AuthorsService,
  Author
} from '../../services/authors.service';

@Component({
  selector: 'app-book-edit',
  standalone: true,
  templateUrl: './book-edit.page.html',
  styleUrls: ['./book-edit.page.scss'],
  imports: [
    IonicModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterLink
  ],
})
export class BookEditPage implements OnInit {

  bookId!: number;

  authors: Author[] = [];
  loading = false;
  saving = false;
  error: string | null = null;

  form: UpdateBookPayload = {
    title: '',
    genre: '',
    authorId: 0,
    availableCopies: 0
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly booksService: BooksService,
    private readonly authorsService: AuthorsService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : 0;

    if (!id) {
      this.error = 'Invalid book id';
      return;
    }

    this.bookId = id;
    this.loadAuthors();
    this.loadBook();
  }

  loadAuthors(): void {
    this.authorsService.getAuthors().subscribe({
      next: (authors: Author[]) => {
        this.authors = authors;
      },
      error: () => {
        this.error = 'Failed to load authors';
      },
    });
  }

  loadBook(): void {
    this.loading = true;

    this.booksService.getBook(this.bookId).subscribe({
      next: (book: Book) => {
        this.loading = false;
        this.form = {
          title: book.title,
          genre: book.genre,
          authorId: book.authorId,
          availableCopies: book.availableCopies
        };
      },
      error: () => {
        this.error = 'Failed to load book';
        this.loading = false;
      },
    });
  }

  save(): void {
    if (!this.form.title.trim() || !this.form.genre.trim()) {
      this.error = 'Title and Genre are required';
      return;
    }

    if (!this.form.authorId || this.form.authorId <= 0) {
      this.error = 'Please select an author';
      return;
    }

    if (this.form.availableCopies < 0) {
      this.error = 'Available copies must be 0 or more';
      return;
    }

    this.error = null;
    this.saving = true;

    this.booksService.updateBook(this.bookId, this.form).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigateByUrl(`/books/${this.bookId}`);
      },
      error: () => {
        this.error = 'Failed to update book';
        this.saving = false;
      },
    });
  }
}