import { Page, Locator } from '@playwright/test';

export class BookDetailsPage {
  private readonly page: Page;

  readonly title: Locator;
  readonly author: Locator;
  readonly genre: Locator;
  readonly copies: Locator;

  readonly userInput: Locator;
  readonly borrowButton: Locator;
  readonly returnButton: Locator;
  readonly deleteButton: Locator;
  readonly editButton: Locator;
  readonly backButton: Locator;

  readonly errorText: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.page = page;

    this.title = page.locator('#book-details-title');
    this.author = page.locator('#book-details-author');
    this.genre = page.locator('#book-details-genre');
    this.copies = page.locator('#book-details-copies');

    this.userInput = page.locator('#borrow-username-input input');

    this.borrowButton = page.locator('#borrow-book-btn');
    this.returnButton = page.locator('#return-book-btn');
    this.deleteButton = page.locator('#delete-book-btn');
    this.editButton = page.locator('#edit-book-btn');
    this.backButton = page.locator('#back-to-list-btn');

    this.errorText = page.locator('#book-details-error');
    this.loadingSpinner = page.locator('#book-details-loading');
  }

  async goto(id: number): Promise<void> {
    await this.page.goto(`/books/${id}`);
  }

  async borrowAs(user: string): Promise<void> {
    await this.userInput.fill(user);
    await this.borrowButton.click();
  }

  async returnBook(): Promise<void> {
    await this.returnButton.click();
  }

  async deleteBook(): Promise<void> {
    this.page.once('dialog', d => d.accept());
    await this.deleteButton.click();
  }

  async goBack(): Promise<void> {
    await this.backButton.click();
  }

  async goToEdit(): Promise<void> {
    await this.editButton.click();
  }
}