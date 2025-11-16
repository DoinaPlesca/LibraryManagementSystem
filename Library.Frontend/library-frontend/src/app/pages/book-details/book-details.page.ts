import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BooksService, Book } from '../../services/books.service';
import {
  BorrowService,
  BorrowRecord,
} from '../../services/borrow.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  templateUrl: './book-details.page.html',
  styleUrls: ['./book-details.page.scss'], // or comment out if file missing
  imports: [IonicModule, CommonModule, HttpClientModule, FormsModule, RouterLink],
})
export class BookDetailsPage implements OnInit {
  book: Book | null = null;
  loading = false;
  deleting = false;
  error: string | null = null;

  // Borrow UI state
  borrowUserName = '';
  borrowing = false;
  lastBorrow: BorrowRecord | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private booksService: BooksService,
    private borrowService: BorrowService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : 0;

    if (!id) {
      this.error = 'Invalid book id';
      return;
    }

    this.loadBook(id);
  }

  loadBook(id: number): void {
    this.loading = true;
    this.error = null;

    this.booksService.getBook(id).subscribe({
      next: (book: Book) => {
        this.book = book;
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'Failed to load book';
        this.loading = false;
      },
    });
  }

  deleteBook(): void {
    if (!this.book) {
      return;
    }

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this book?'
    );
    if (!confirmDelete) {
      return;
    }

    this.deleting = true;
    this.error = null;

    this.booksService.deleteBook(this.book.id).subscribe({
      next: (success: boolean) => {
        this.deleting = false;
        if (success) {
          this.router.navigateByUrl('/home');
        } else {
          this.error = 'Book could not be deleted (maybe active borrow?).';
        }
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'Failed to delete book';
        this.deleting = false;
      },
    });
  }

  borrowBook(): void {
    if (!this.book) {
      return;
    }

    const userName = this.borrowUserName.trim();
    if (!userName) {
      this.error = 'Please enter a username to borrow the book';
      return;
    }

    if (this.book.availableCopies <= 0) {
      this.error = 'No available copies to borrow';
      return;
    }

    this.error = null;
    this.borrowing = true;

    this.borrowService
      .borrowBook({ userName, bookId: this.book.id })
      .subscribe({
        next: (record: BorrowRecord) => {
          this.borrowing = false;
          this.lastBorrow = record;
          // Refresh book info – availableCopies should decrease
          this.loadBook(this.book!.id);
        },
        error: (err: any) => {
          console.error(err);
          this.error = 'Failed to borrow book';
          this.borrowing = false;
        },
      });
  }

  returnBook(): void {
    if (!this.lastBorrow) {
      this.error = 'No borrow record to return';
      return;
    }

    this.error = null;
    this.borrowing = true;

    this.borrowService.returnBook(this.lastBorrow.id).subscribe({
      next: (record: BorrowRecord) => {
        this.borrowing = false;
        this.lastBorrow = record;
        // Refresh book info – availableCopies should increase
        if (this.book) {
          this.loadBook(this.book.id);
        }
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'Failed to return book';
        this.borrowing = false;
      },
    });
  }
}
