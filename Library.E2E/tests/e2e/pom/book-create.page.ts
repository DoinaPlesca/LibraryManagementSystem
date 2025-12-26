import { Page, Locator } from '@playwright/test';

export class BookCreatePage {
    private page: Page;

    titleInput: Locator;
    genreInput: Locator;
    copiesInput: Locator;
    authorSelect: Locator;
    saveButton: Locator;
    addAuthorButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.titleInput = this.page.locator('ion-input[name="title"] input');
        this.genreInput = this.page.locator('ion-input[name="genre"] input');
        this.copiesInput = this.page.locator('ion-input[name="availableCopies"] input');
        this.authorSelect = this.page.locator('ion-select[name="authorId"]');

        this.saveButton = this.page.locator('ion-button', { hasText: 'Save Book' });
        this.addAuthorButton = this.page.locator('ion-button', { hasText: 'Add new author' });
    }

    async goto() {
        await this.page.goto('/books/new');
    }

    async fillTitle(title: string) {
        await this.titleInput.fill(title);
    }

    async fillGenre(genre: string) {
        await this.genreInput.fill(genre);
    }

    async fillCopies(copies: number) {
        await this.copiesInput.fill(String(copies));
    }

    async selectAuthorByName(name: string) {
        await this.authorSelect.click();

        const radio = this.page
            .locator('ion-radio')
            .filter({ hasText: name })
            .first();

        await radio.waitFor({ state: 'visible' });
        await radio.click();
    }

    async save() {
        await this.saveButton.click();
    }

    async clickAddNewAuthor() {
        await this.addAuthorButton.click();
    }
}
