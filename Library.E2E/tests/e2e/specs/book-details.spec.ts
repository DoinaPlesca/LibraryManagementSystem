import { test, expect } from '../../fixtures/api-fixtures';
import { Page } from '@playwright/test';
import { BookDetailsPage } from '../pom/book-details.page';

test.describe('Book Details page', () => {

  async function setup(page: Page, api: any) {
    const author = await api.createAuthor({
      name: 'E2E Details Author',
      nationality: 'Test'
    });

    const book = await api.createBook({
      title: 'E2E Details Book',
      genre: 'Fantasy',
      authorId: author.data.id,
      availableCopies: 2
    });

    const details = new BookDetailsPage(page);
    await details.goto(book.data.id);

    return {
      details,
      bookId: book.data.id
    };
  }

  test('Loads and shows book information', async ({ page, api }) => {
    // Arrange
    const { details, bookId } = await setup(page, api);

    // Assert
    await expect(details.title).toHaveText('E2E Details Book');
    await expect(details.author).toHaveText('E2E Details Author');
    await expect(details.genre).toContainText('Fantasy');
    await expect(details.copies).toContainText('2');

    // Clean
    await api.deleteBook(bookId);
  });

  test('User can borrow a book and copies decrease', async ({ page, api }) => {
    // Arrange
    const { details, bookId } = await setup(page, api);

    // Act
    await details.borrowAs('E2EUser');

    // Assert
    await expect(details.copies).toContainText('1');

    // Clean
    await api.deleteBook(bookId);
  });

  test('User can return a book and copies increase', async ({ page, api }) => {
    // Arrange
    const { details, bookId } = await setup(page, api);

    await details.borrowAs('E2EUser');

    // Act
    await details.returnBook();

    // Assert
    await expect(details.copies).toContainText('2');

    // Clean
    await api.deleteBook(bookId);
  });

  test('User can delete a book and is redirected to home', async ({ page, api }) => {
    // Arrange
    const { details } = await setup(page, api);

    // Act
    await details.deleteBook();

    // Assert
    await expect(page).toHaveURL('/home');
  });

  test('Edit button navigates to edit page', async ({ page, api }) => {
    // Arrange
    const { details, bookId } = await setup(page, api);

    // Act
    await details.goToEdit();

    // Assert
    await expect(page).toHaveURL(`/books/${bookId}/edit`);

    // Clean
    await api.deleteBook(bookId);
  });

  test('Back to list navigates to home', async ({ page, api }) => {
    // Arrange
    const { details, bookId } = await setup(page, api);

    // Act
    await details.goBack();

    // Assert
    await expect(page).toHaveURL('/home');

    // Clean
    await api.deleteBook(bookId);
  });

});