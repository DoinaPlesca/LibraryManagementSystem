import { Page, Locator } from '@playwright/test';

export class AuthorCreatePage {
  private readonly page: Page;

  readonly nameInput: Locator;
  readonly nationalityInput: Locator;

  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  readonly errorText: Locator;

  constructor(page: Page) {
    this.page = page;

    this.nameInput = page.locator('ion-input#author-name-input input');
    this.nationalityInput = page.locator('ion-input#author-nationality-input input');
    this.saveButton = page.locator('#author-save-btn');
    this.cancelButton = page.locator('#author-cancel-btn');
    this.errorText = page.locator('#author-create-error');
  }

  async goto(): Promise<void> {
    await this.page.goto('/authors/new');
  }

  async setName(name: string): Promise<void> {
    await this.nameInput.fill(name);
  }

  async setNationality(nationality: string): Promise<void> {
    await this.nationalityInput.fill(nationality);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}