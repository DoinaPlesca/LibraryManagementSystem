import { Page, Locator } from '@playwright/test';

export class AuthorCreatePage {
  private page: Page;

  nameInput: Locator;
  nationalityInput: Locator;

  saveButton: Locator;
  cancelButton: Locator;

  errorText: Locator;

  constructor(page: Page) {
    this.page = page;

    this.nameInput = page.locator('ion-input[name="name"] input');
    this.nationalityInput = page.locator('ion-input[name="nationality"] input');

    this.saveButton = page.locator('ion-button', { hasText: 'Save Author' });
    this.cancelButton = page.locator('ion-button', { hasText: 'Cancel' });

    this.errorText = page.locator('ion-text[color="danger"]');
    // this is really bad practice but there's no id or any kind of an identifier on the frontend
  }

  async goto() {
    await this.page.goto('/authors/new');
  }

  async setName(name: string) {
    await this.nameInput.fill(name);
  }

  async setNationality(nationality: string) {
    await this.nationalityInput.fill(nationality);
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }
}