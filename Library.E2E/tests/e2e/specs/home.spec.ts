import { test, expect } from '../../fixtures/api-fixtures';
import { Page } from '@playwright/test';
import { HomePage } from '../pom/home.page';

test.describe('Home page — Books list', () => {

    async function setup(page: Page) {
        const home = new HomePage(page);
        await home.goto();
        await home.waitForLoaded();
        return { home };
    }

    test('Home page loads and shows main UI elements', async ({ page }) => {
        // Arrange
        const { home } = await setup(page);

        // Act (no need to do anything here, we're just loading in)

        // Assert
        await expect(home.header).toBeVisible();
        await expect(home.title).toBeVisible();
        await expect(home.addNewBookButton).toBeVisible();
        await expect(home.reloadButton).toBeVisible();
        await expect(home.viewBorrowsButton).toBeVisible();
    });

    test('Books from backend are displayed on home page', async ({ page, api }) => {
        // Arrange
        const author = await api.createAuthor({
            name: 'E2E Home Author',
            nationality: 'Test'
        });

        const book1 = await api.createBook({
            title: 'E2E Book One',
            genre: 'Fantasy',
            authorId: author.data.id,
            availableCopies: 3
        });

        const book2 = await api.createBook({
            title: 'E2E Book Two',
            genre: 'Sci-Fi',
            authorId: author.data.id,
            availableCopies: 5
        });

        const home = new HomePage(page);

        // Act
        await home.goto();
        await home.waitForLoaded();

        // Assert
        await expect(page.getByText('E2E Book One')).toBeVisible();
        await expect(page.getByText('E2E Book Two')).toBeVisible();

        // Clean
        await api.deleteBook(book1.data.id);
        await api.deleteBook(book2.data.id);
        // delete is not implemented on the backend but this code will clean it if it works with the ID
        // for now we'll skip this step
        // await api.deleteAuthor(author.data.id);
    });

    test('Reload from API updates the page contents.', async ({ page, api }) => {
        const home = new HomePage(page);
        await home.goto();
        await home.waitForLoaded();

        // Arrange
        const author = await api.createAuthor({
            name: 'E2E Home Author',
            nationality: 'Test'
        });

        const book1 = await api.createBook({
            title: 'E2E Reload Book',
            genre: 'Fantasy',
            authorId: author.data.id,
            availableCopies: 3
        });

        // Act
        await home.clickReload();

        // Assert
        await expect(page.getByText('E2E Reload Book')).toBeVisible();

        // Clean
        await api.deleteBook(book1.data.id);
        // await api.deleteAuthor(author.data.id); // not supported by backend
    });

    test('Clicking Add New Book navigates to create page', async ({ page }) => {
        // Arrange
        const { home } = await setup(page);

        // Act
        await home.clickAddNewBook();

        // Assert
        await expect(page).toHaveURL('books/new');
    });

    test('Clicking View My Borrows navigates to borrows page', async ({ page }) => {
        // Arrange
        const { home } = await setup(page);

        // Act
        await home.clickViewBorrows();

        // Assert
        await expect(page).toHaveURL('borrows');
    });

    test('Clicking a book navigates to its details page', async ({ page }) => {
        // Arrange
        const home = new HomePage(page);
        await home.goto();
        await home.waitForLoaded();

        const title = "Harry Potter";

        // Act
        await home.openBookByTitle(title);

        // Assert
        await expect(page).toHaveURL(/\/books\/\d+$/); // this is books/id
    });

});
