import { Page, Locator } from '@playwright/test';

export class UserBorrowsPage {
  private page: Page;

  userInput: Locator;
  loadButton: Locator;

  spinner: Locator;
  errorText: Locator;

  borrowsList: Locator;
  emptyText: Locator;

  constructor(page: Page) {
    this.page = page;

    this.userInput = page.locator('ion-input[name="userName"] input');
    this.loadButton = page.locator('ion-button', { hasText: 'Load My Borrows' });

    this.spinner = page.locator('ion-spinner');
    this.errorText = page.locator('ion-text[color="danger"]');

    this.borrowsList = page.locator('ion-list');
    this.emptyText = page.getByText('No borrow records for this user.');
  }

  async goto() {
    await this.page.goto('/borrows');
  }

  async setUser(name: string) {
    await this.userInput.fill(name);
  }

  async load() {
    await this.loadButton.click();
  }

  async returnFirst() {
    const returnBtn = this.page
      .locator('ion-button', { hasText: 'Return' })
      .first();

    await returnBtn.click();
  }
}