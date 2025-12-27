import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import {
  BorrowService,
  BorrowRecord
} from '../../services/borrow.service';

@Component({
  selector: 'app-user-borrows',
  standalone: true,
  templateUrl: './user-borrows.page.html',
  styleUrls: ['./user-borrows.page.scss'],
  imports: [
    IonicModule,
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
})
export class UserBorrowsPage {

  userName = '';
  borrows: BorrowRecord[] = [];
  loading = false;
  error: string | null = null;
  returningId: number | null = null;

  constructor(
    private readonly borrowService: BorrowService
  ) {}

  loadBorrows(): void {
    const name = this.userName.trim();
    if (!name) {
      this.error = 'Please enter a username';
      return;
    }

    this.loading = true;
    this.error = null;

    this.borrowService.getBorrowsByUser(name).subscribe({
      next: (records: BorrowRecord[]) => {
        this.borrows = records;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load borrows';
        this.loading = false;
      },
    });
  }

  returnBorrow(record: BorrowRecord): void {
    if (!record || record.returnDate) {
      return;
    }

    this.returningId = record.id;
    this.error = null;

    this.borrowService.returnBook(record.id).subscribe({
      next: () => {
        this.returningId = null;
        this.loadBorrows();
      },
      error: () => {
        this.error = 'Failed to return book';
        this.returningId = null;
      },
    });
  }
}