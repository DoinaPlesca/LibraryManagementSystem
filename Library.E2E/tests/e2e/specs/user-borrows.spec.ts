import { test, expect } from '../../fixtures/api-fixtures';
import { Page } from '@playwright/test';
import { UserBorrowsPage } from '../pom/user-borrows.page';

test.describe('User Borrows page', () => {

  const userName = 'E2EBorrowUser';

  async function setupWithBorrow(page: Page, api: any) {
    const author = await api.createAuthor({
      name: 'E2E Borrow Author',
      nationality: 'Test'
    });

    const book = await api.createBook({
      title: 'E2E Borrow Book',
      genre: 'Fantasy',
      authorId: author.data.id,
      availableCopies: 2
    });

    const borrow = await api.borrowBook(userName, book.data.id);

    const borrowsPage = new UserBorrowsPage(page);
    await borrowsPage.goto();

    return {
      borrowsPage,
      bookId: book.data.id,
      borrowId: borrow.data.id
    };
  }

  async function setupEmpty(page: Page) {
    const borrowsPage = new UserBorrowsPage(page);
    await borrowsPage.goto();
    return { borrowsPage };
  }

  test('Loads and shows main UI elements', async ({ page }) => {
    // Arrange
    const { borrowsPage } = await setupEmpty(page);

    // Assert
    await expect(borrowsPage.userInput).toBeVisible();
    await expect(borrowsPage.loadButton).toBeVisible();
  });

  test('Shows validation error if username is empty', async ({ page }) => {
    // Arrange
    const { borrowsPage } = await setupEmpty(page);

    // Act
    await borrowsPage.setUser('');
    await borrowsPage.load();

    // Assert
    await expect(borrowsPage.errorText)
      .toContainText('Please enter a username');
  });

  test('Loads borrows for user and shows list', async ({ page, api }) => {
    // Arrange
    const { borrowsPage, bookId } = await setupWithBorrow(page, api);

    // Act
    await borrowsPage.setUser(userName);
    await borrowsPage.load();

    // Assert
    await expect(borrowsPage.borrowsList).toBeVisible();
    await expect(page.locator('#borrow-book-title-0'))
      .toHaveText('E2E Borrow Book');

    // Clean
    await api.deleteBook(bookId);
  });

  test('User can return a borrowed book', async ({ page, api }) => {
    // Arrange
    const { borrowsPage, bookId } = await setupWithBorrow(page, api);

    await borrowsPage.setUser(userName);
    await borrowsPage.load();

    // Act
    await borrowsPage.returnFirst();

    // Assert
    const returnedText = page.locator('#return-date-0');

    await expect(returnedText).toBeVisible();
    await expect(returnedText).toContainText('Returned on');

    // Clean
    await api.deleteBook(bookId);
  });

});