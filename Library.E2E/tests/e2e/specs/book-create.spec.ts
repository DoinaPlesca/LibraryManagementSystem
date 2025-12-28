import { test, expect } from '../../fixtures/api-fixtures';
import { Page } from '@playwright/test';
import { BookCreatePage } from '../pom/book-create.page';

test.describe('Create Book page', () => {

  async function setup(page: Page) {
    const createPage = new BookCreatePage(page);
    await createPage.goto();
    return { createPage };
  }

  test('Create Book page loads and shows main UI elements', async ({ page }) => {
    // Arrange
    const { createPage } = await setup(page);

    // Assert
    await expect(createPage.titleInput).toBeVisible();
    await expect(createPage.genreInput).toBeVisible();
    await expect(createPage.copiesInput).toBeVisible();
    await expect(createPage.authorSelect).toBeVisible();
    await expect(createPage.saveButton).toBeVisible();
    await expect(createPage.addAuthorButton).toBeVisible();
  });

  test('User can create a new book from UI', async ({ page, api }) => {
    // Arrange
    const author = await api.createAuthor({
      name: 'E2E Create Author',
      nationality: 'Test'
    });

    const bookTitle = 'E2E Created Book';
    const createPage = new BookCreatePage(page);
    await createPage.goto();

    // Act
    await createPage.setTitle(bookTitle);
    await createPage.setGenre('Adventure');
    await createPage.setCopies(4);
    await createPage.selectAuthorByName(author.data.name);

    const [response] = await Promise.all([
      page.waitForResponse(res =>
        res.url().includes('/api/books') &&
        res.request().method() === 'POST'
      ),
      createPage.save()
    ]);

    const json = await response.json();
    const bookId = json.data.id;

    // Assert
    await expect(page).toHaveURL('/home');
    await expect(page.getByText(bookTitle).first()).toBeVisible();

    // Clean
    await api.deleteBook(bookId);
  });

  test('Clicking Add new author navigates to author creation page', async ({ page }) => {
    // Arrange
    const { createPage } = await setup(page);

    // Act
    await createPage.clickAddNewAuthor();

    // Assert
    await expect(page).toHaveURL('/authors/new');
  });

});