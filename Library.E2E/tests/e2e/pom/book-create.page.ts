import { Page, Locator } from '@playwright/test';

export class BookCreatePage {
  private readonly page: Page;

  readonly titleInput: Locator;
  readonly genreInput: Locator;
  readonly copiesInput: Locator;
  readonly authorSelect: Locator;

  readonly saveButton: Locator;
  readonly addAuthorButton: Locator;
  readonly errorText: Locator;

  constructor(page: Page) {
    this.page = page;

    this.titleInput = page.locator('#book-title-input input');
    this.genreInput = page.locator('#book-genre-input input');
    this.copiesInput = page.locator('#book-copies-input input');
    this.authorSelect = page.locator('#book-author-select');
    this.saveButton = page.locator('#book-save-btn');
    this.addAuthorButton = page.locator('#book-add-author-btn');
    this.errorText = page.locator('#book-create-error');
  }

  async goto(): Promise<void> {
    await this.page.goto('/books/new');
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

  async selectAuthorByName(name: string): Promise<void> {
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

  async clickAddNewAuthor(): Promise<void> {
    await this.addAuthorButton.click();
  }
}
