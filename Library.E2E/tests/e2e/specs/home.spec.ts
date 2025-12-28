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
        const { home } = await setup(page);

        await expect(home.title).toBeVisible();
        await expect(home.addNewBookButton).toBeVisible();
        await expect(home.reloadButton).toBeVisible();
        await expect(home.viewBorrowsButton).toBeVisible();
    });

    test('Books from backend are displayed on home page', async ({ page, api }) => {
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
        await home.goto();
        await home.waitForLoaded();

        await expect(home.bookByTitle('E2E Book One')).toBeVisible();
        await expect(home.bookByTitle('E2E Book Two')).toBeVisible();

        await api.deleteBook(book1.data.id);
        await api.deleteBook(book2.data.id);
    });

    test('Reload from API updates the page contents', async ({ page, api }) => {
        const home = new HomePage(page);
        await home.goto();
        await home.waitForLoaded();

        const author = await api.createAuthor({
            name: 'E2E Reload Author',
            nationality: 'Test'
        });

        const book = await api.createBook({
            title: 'E2E Reload Book',
            genre: 'Fantasy',
            authorId: author.data.id,
            availableCopies: 3
        });

        await home.clickReload();

        await expect(home.bookByTitle('E2E Reload Book')).toBeVisible();

        await api.deleteBook(book.data.id);
    });

    test('Clicking Add New Book navigates to create page', async ({ page }) => {
        const { home } = await setup(page);

        await home.clickAddNewBook();

        await expect(page).toHaveURL('/books/new');
    });

    test('Clicking View My Borrows navigates to borrows page', async ({ page }) => {
        const { home } = await setup(page);

        await home.clickViewBorrows();

        await expect(page).toHaveURL('/borrows');
    });

    test('Clicking a book navigates to its details page', async ({ page }) => {
        const home = new HomePage(page);
        await home.goto();
        await home.waitForLoaded();

        const title = 'E2E Book One';
        await home.openBookByTitle(title);

        await expect(page).toHaveURL(/\/books\/\d+$/);
    });

});