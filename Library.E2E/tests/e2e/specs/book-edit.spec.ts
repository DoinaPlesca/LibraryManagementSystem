import { test, expect } from '../../fixtures/api-fixtures';
import { Page } from '@playwright/test';
import { BookEditPage } from '../pom/book-edit.page';

test.describe('Book Edit page', () => {

  async function setup(page: Page, api: any) {
    const author1 = await api.createAuthor({
      name: 'E2E Edit Author One',
      nationality: 'Test'
    });

    const author2 = await api.createAuthor({
      name: 'E2E Edit Author Two',
      nationality: 'Test'
    });

    const book = await api.createBook({
      title: 'E2E Edit Book',
      genre: 'Fantasy',
      authorId: author1.data.id,
      availableCopies: 2
    });

    const edit = new BookEditPage(page);
    await edit.goto(book.data.id);

    return {
      edit,
      bookId: book.data.id,
      author2
    };
  }

  test('Loads and shows current book info', async ({ page, api }) => {
    // Arrange
    const { edit, bookId } = await setup(page, api);

    // Assert
    await expect(edit.titleInput).toHaveValue('E2E Edit Book');
    await expect(edit.genreInput).toHaveValue('Fantasy');
    await expect(edit.copiesInput).toHaveValue('2');

    // Clean
    await api.deleteBook(bookId);
  });

  test('User can edit book and is redirected to details page', async ({ page, api }) => {
    // Arrange
    const { edit, bookId, author2 } = await setup(page, api);

    // Act
    await edit.setTitle('E2E Updated Book');
    await edit.setGenre('Sci-Fi');
    await edit.setCopies(5);
    await edit.selectAuthor(author2.data.name);
    await edit.save();

    // Assert
    await expect(page).toHaveURL(`/books/${bookId}`);

    // Clean
    await api.deleteBook(bookId);
  });

  test('Cancel navigates back to book details', async ({ page, api }) => {
    // Arrange
    const { edit, bookId } = await setup(page, api);

    // Act
    await edit.cancel();

    // Assert
    await expect(page).toHaveURL(`/books/${bookId}`);

    // Clean
    await api.deleteBook(bookId);
  });

  test('Shows validation error if title is empty', async ({ page, api }) => {
    // Arrange
    const { edit, bookId, author2 } = await setup(page, api);

    // Act
    await edit.setTitle('');
    await edit.setGenre('Sci-Fi');
    await edit.setCopies(5);
    await edit.selectAuthor(author2.data.name);
    await edit.save();

    // Assert
    await expect(edit.errorText)
      .toContainText('Title and Genre are required');

    // Clean
    await api.deleteBook(bookId);
  });

  test('Shows validation error if copies is negative', async ({ page, api }) => {
    // Arrange
    const { edit, bookId, author2 } = await setup(page, api);

    // Act
    await edit.setTitle('E2E Updated Book');
    await edit.setGenre('Sci-Fi');
    await edit.setCopies(-1);
    await edit.selectAuthor(author2.data.name);
    await edit.save();

    // Assert
    await expect(edit.errorText)
      .toContainText('Available copies must be 0 or more');

    // Clean
    await api.deleteBook(bookId);
  });

});