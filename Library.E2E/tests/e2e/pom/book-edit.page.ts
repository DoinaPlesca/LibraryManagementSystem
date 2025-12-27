import { Page, Locator } from '@playwright/test';

export class BookEditPage {
    private page: Page;

    titleInput: Locator;
    genreInput: Locator;
    authorSelect: Locator;
    copiesInput: Locator;

    saveButton: Locator;
    cancelButton: Locator;

    errorText: Locator;

    constructor(page: Page) {
        this.page = page;

        this.titleInput = page.locator('ion-input[name="title"] input');
        this.genreInput = page.locator('ion-input[name="genre"] input');
        this.copiesInput = page.locator('ion-input[name="availableCopies"] input');

        this.authorSelect = page.locator('ion-select[name="authorId"]');

        this.saveButton = page.locator('ion-button', { hasText: 'Save Changes' });
        this.cancelButton = page.locator('ion-button', { hasText: 'Cancel' });

        this.errorText = page.locator('ion-text[color="danger"]');
        // missing id here as well, this is the only way I can refer to it
    }

    async goto(id: number) {
        await this.page.goto(`/books/${id}/edit`);
    }

    async setTitle(title: string) {
        await this.titleInput.fill(title);
    }

    async setGenre(genre: string) {
        await this.genreInput.fill(genre);
    }

    async setCopies(copies: number) {
        await this.copiesInput.fill(String(copies));
    }

    async selectAuthor(name: string) {
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

    async cancel() {
        await this.cancelButton.click();
    }
}