import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {
  AuthorsService,
  CreateAuthorPayload,
} from '../../services/authors.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-author-create',
  standalone: true,
  templateUrl: './author-create.page.html',
  styleUrls: ['./author-create.page.scss'], // comment out if file missing
  imports: [IonicModule, CommonModule, HttpClientModule, FormsModule, RouterLink],
})
export class AuthorCreatePage {
  newAuthor: CreateAuthorPayload = {
    name: '',
    nationality: '',
  };

  submitting = false;
  error: string | null = null;

  constructor(
    private authorsService: AuthorsService,
    private router: Router
  ) {}

  saveAuthor(): void {
    const name = this.newAuthor.name.trim();
    const nationality = this.newAuthor.nationality.trim();

    if (!name || !nationality) {
      this.error = 'Name and nationality are required';
      return;
    }

    this.error = null;
    this.submitting = true;

    this.authorsService.createAuthor({ name, nationality }).subscribe({
      next: () => {
        this.submitting = false;
        // after creation go to create-book page (or home, your choice)
        this.router.navigateByUrl('/books/new');
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'Failed to create author';
        this.submitting = false;
      },
    });
  }
}
