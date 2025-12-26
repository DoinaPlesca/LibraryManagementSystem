import { Page, Locator } from '@playwright/test';

export class HomePage {
    readonly page: Page;

    readonly header: Locator;
    readonly title: Locator;

    readonly addNewBookButton: Locator;
    readonly reloadButton: Locator;
    readonly viewBorrowsButton: Locator;

    readonly loadingSpinner: Locator;
    readonly errorText: Locator;
    readonly noBooksText: Locator;

    readonly bookItems: Locator;

    constructor(page: Page) {
        this.page = page;

        this.header = page.locator('ion-header');
        this.title = page.getByText('Library – Books');

        this.addNewBookButton = page.locator('ion-button:has-text("Add New Book")');
        this.reloadButton = page.locator('ion-button:has-text("Reload from API")');
        this.viewBorrowsButton = page.locator('ion-button:has-text("View My Borrows")');

        this.loadingSpinner = page.locator('ion-spinner');
        this.errorText = page.locator('ion-text[color="danger"]');
        this.noBooksText = page.getByText('No books found.');

        this.bookItems = page.locator('ion-item');
    }

    async goto() {
        await this.page.goto('/');
    }

    async waitForLoaded() {
        await this.title.waitFor({ state: 'visible' });
        await this.loadingSpinner.waitFor({ state: 'hidden' }).catch(() => { });
    }

    async clickAddNewBook() {
        await this.addNewBookButton.click();
    }

    async clickReload() {
        await this.reloadButton.click();
    }

    async clickViewBorrows() {
        await this.viewBorrowsButton.click();
    }

    async openBookByTitle(title: string) {
        await this.page.getByRole('heading', { name: title }).first().click();
    }
}