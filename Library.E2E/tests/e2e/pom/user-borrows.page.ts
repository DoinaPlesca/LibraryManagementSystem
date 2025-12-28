import { Page, Locator } from '@playwright/test';

export class UserBorrowsPage {
  private readonly page: Page;

  readonly userInput: Locator;
  readonly loadButton: Locator;

  readonly spinner: Locator;
  readonly errorText: Locator;

  readonly borrowsList: Locator;
  readonly emptyText: Locator;

  constructor(page: Page) {
    this.page = page;

    this.userInput = page.locator('#borrows-username-input input');
    this.loadButton = page.locator('#borrows-load-btn');

    this.spinner = page.locator('#borrows-loading');
    this.errorText = page.locator('#borrows-error');

    this.borrowsList = page.locator('#borrows-list');
    this.emptyText = page.locator('#borrows-empty');
  }

  async goto(): Promise<void> {
    await this.page.goto('/borrows');
  }

  async setUser(name: string): Promise<void> {
    await this.userInput.fill(name);
  }

  async load(): Promise<void> {
    await this.loadButton.click();
  }

  async returnFirst(): Promise<void> {
    const returnBtn = this.page.locator('[id^="return-btn-"]').first();
    await returnBtn.click();
  }
}