import { Page, Locator } from '@playwright/test';

export class BookEditPage {
  private readonly page: Page;

  readonly titleInput: Locator;
  readonly genreInput: Locator;
  readonly copiesInput: Locator;
  readonly authorSelect: Locator;

  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  readonly errorText: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.page = page;

    this.titleInput = page.locator('#book-edit-title-input input');
    this.genreInput = page.locator('#book-edit-genre-input input');
    this.copiesInput = page.locator('#book-edit-copies-input input');

    this.authorSelect = page.locator('#book-edit-author-select');

    this.saveButton = page.locator('#book-edit-save-btn');
    this.cancelButton = page.locator('#book-edit-cancel-btn');

    this.errorText = page.locator('#book-edit-error');
    this.loadingSpinner = page.locator('#book-edit-loading');
  }

  async goto(id: number): Promise<void> {
    await this.page.goto(`/books/${id}/edit`);
  }

  async setTitle(title: string): Promise<void> {
    await this.titleInput.fill(title);
  }

  async setGenre(genre: string): Promise<void> {
    await this.genreInput.fill(genre);
  }

  async setCopies(copies: number): Promise<void> {
    await this.copiesInput.fill(String(copies));
  }

  async selectAuthor(name: string): Promise<void> {
    await this.authorSelect.click();

    const option = this.page
      .locator('ion-alert, ion-popover')
      .locator('button, ion-item')
      .filter({ hasText: name })
      .first();

    await option.waitFor({ state: 'visible' });
    await option.click();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}