import { test, expect } from '../../fixtures/api-fixtures';
import { Page } from '@playwright/test';
import { AuthorCreatePage } from '../pom/author-create.page';

test.describe('Author Create page', () => {

  async function setup(page: Page) {
    const create = new AuthorCreatePage(page);
    await create.goto();
    return { create };
  }

  test('Author Create page loads and shows main UI elements', async ({ page }) => {
    // Arrange
    const { create } = await setup(page);

    // Act (nothing)

    // Assert
    await expect(create.nameInput).toBeVisible();
    await expect(create.nationalityInput).toBeVisible();
    await expect(create.saveButton).toBeVisible();
    await expect(create.cancelButton).toBeVisible();
  });

  test('User can create a new author and is redirected to create book page', async ({ page, api }) => {
    // Arrange
    const authorName = 'E2E New Author';
    const nationality = 'Testland';

    const create = new AuthorCreatePage(page);
    await create.goto();

    // Act
    await create.setName(authorName);
    await create.setNationality(nationality);
    await create.save();

    // No author delete implemented yet
    // const [response] = await Promise.all([
    //   page.waitForResponse(res =>
    //     res.url().includes('/api/authors') &&
    //     res.request().method() === 'POST'
    //   ),
    //   create.save()
    // ]);

    // const json = await response.json();
    // const authorId = json.data.id;

    // Assert
    await expect(page).toHaveURL('/books/new');

    // Clean
    // await api.deleteAuthor(authorId);
  });

  test('Shows validation error if name is empty', async ({ page }) => {
    // Arrange
    const { create } = await setup(page);

    // Act
    await create.setName('');
    await create.setNationality('Test');
    await create.save();

    // Assert
    await expect(create.errorText)
      .toContainText('Name and nationality are required');
  });

  test('Shows validation error if nationality is empty', async ({ page }) => {
    // Arrange
    const { create } = await setup(page);

    // Act
    await create.setName('E2E Author');
    await create.setNationality('');
    await create.save();

    // Assert
    await expect(create.errorText)
      .toContainText('Name and nationality are required');
  });

  test('Cancel navigates back to home', async ({ page }) => {
    // Arrange
    const { create } = await setup(page);

    // Act
    await create.cancel();

    // Assert
    await expect(page).toHaveURL('/home');
  });

});