import { Page, Locator } from '@playwright/test';

export class HomePage {
    readonly page: Page;

    readonly title: Locator;

    readonly addNewBookButton: Locator;
    readonly reloadButton: Locator;
    readonly viewBorrowsButton: Locator;

    readonly loadingSpinner: Locator;
    readonly errorText: Locator;
    readonly noBooksText: Locator;

    readonly booksList: Locator;

    constructor(page: Page) {
        this.page = page;

        this.title = page.locator('#home-title');

        this.addNewBookButton = page.locator('#home-add-book-btn');
        this.reloadButton = page.locator('#home-reload-btn');
        this.viewBorrowsButton = page.locator('#home-view-borrows-btn');

        this.loadingSpinner = page.locator('#home-loading');
        this.errorText = page.locator('#home-error');
        this.noBooksText = page.locator('#home-empty');

        this.booksList = page.locator('#home-books-list');
    }

    async goto(): Promise<void> {
        await this.page.goto('/');
    }

    async waitForLoaded(): Promise<void> {
        await this.title.waitFor({ state: 'visible' });
        await this.loadingSpinner.waitFor({ state: 'hidden' }).catch(() => { });
    }

    async clickAddNewBook(): Promise<void> {
        await this.addNewBookButton.click();
    }

    async clickReload(): Promise<void> {
        await this.reloadButton.click();
    }

    async clickViewBorrows(): Promise<void> {
        await this.viewBorrowsButton.click();
    }

    bookTitleAt(index: number): Locator {
        return this.page.locator(`#home-book-title-${index}`);
    }

    async openBookAt(index: number): Promise<void> {
        await this.page.locator(`#home-book-item-${index}`).click();
    }

    bookByTitle(title: string): Locator {
        return this.page.locator('#home-books-list h2', { hasText: title }).first();
    }

    async openBookByTitle(title: string): Promise<void> {
        await this.bookByTitle(title).first().click();
    }
}