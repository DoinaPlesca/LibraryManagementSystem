import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'books/new',
    loadComponent: () =>
      import('./pages/book-create/book-create.page').then(
        (m) => m.BookCreatePage
      ),
  },

  {
    path: 'books/:id',
    loadComponent: () =>
      import('./pages/book-details/book-details.page').then(
        (m) => m.BookDetailsPage
      ),
  },

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'book-details',
    loadComponent: () => import('./pages/book-details/book-details.page').then( m => m.BookDetailsPage)
  },

];
