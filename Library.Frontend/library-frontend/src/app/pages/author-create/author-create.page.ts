import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  AuthorsService,
  CreateAuthorPayload
} from '../../services/authors.service';

@Component({
  selector: 'app-author-create',
  standalone: true,
  templateUrl: './author-create.page.html',
  styleUrls: ['./author-create.page.scss'],
  imports: [
    IonicModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterLink
  ],
})
export class AuthorCreatePage {

  newAuthor: CreateAuthorPayload = {
    name: '',
    nationality: ''
  };

  submitting = false;
  error: string | null = null;

  constructor(
    private readonly authorsService: AuthorsService,
    private readonly router: Router
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
        this.router.navigateByUrl('/books/new');
      },
      error: () => {
        this.error = 'Failed to create author';
        this.submitting = false;
      }
    });
  }
}
