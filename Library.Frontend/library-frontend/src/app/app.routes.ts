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
    path: 'borrows',
    loadComponent: () =>
      import('./pages/user-borrows/user-borrows.page').then(
        (m) => m.UserBorrowsPage
      ),
  },

  {
    path: 'authors/new',
    loadComponent: () =>
      import('./pages/author-create/author-create.page').then(
        (m) => m.AuthorCreatePage
      ),
  },

  {
    path: 'books/:id/edit',
    loadComponent: () =>
      import('./pages/book-edit/book-edit.page').then(
        (m) => m.BookEditPage
      ),
  },


  {
    path: 'book-details',
    loadComponent: () => import('./pages/book-details/book-details.page').then( m => m.BookDetailsPage)
  },
  {
    path: 'user-borrows',
    loadComponent: () => import('./pages/user-borrows/user-borrows.page').then( m => m.UserBorrowsPage)
  },
  {
    path: 'author-create',
    loadComponent: () => import('./pages/author-create/author-create.page').then( m => m.AuthorCreatePage)
  },  {
    path: 'book-edit',
    loadComponent: () => import('./pages/book-edit/book-edit.page').then( m => m.BookEditPage)
  },




];
