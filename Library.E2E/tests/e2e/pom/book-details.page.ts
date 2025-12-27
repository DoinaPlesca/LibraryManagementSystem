import { Page, Locator } from '@playwright/test';

export class BookDetailsPage {
  private page: Page;

  title: Locator;
  author: Locator;
  genre: Locator;
  copies: Locator;

  userInput: Locator;
  borrowButton: Locator;
  returnButton: Locator;
  deleteButton: Locator;
  editButton: Locator;
  backButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.title = page.locator('ion-card-title');
    this.author = page.locator('ion-card-subtitle');
    this.genre = page.getByText('Genre:');
    this.copies = page.getByText('Available copies:');

    this.userInput = page.locator('ion-input[name="borrowUserName"] input');
    this.borrowButton = page.getByRole('button', { name: 'borrow book' });
    this.returnButton = page.getByRole('button', { name: 'return this book' });
    this.deleteButton = page.getByRole('button', { name: 'delete book' });
    this.editButton = page.getByRole('button', { name: 'edit book' });
    this.backButton = page.getByRole('button', { name: 'back to list' });
  }

  async goto(id: number) {
    await this.page.goto(`/books/${id}`);
  }

  async borrowAs(user: string) {
    await this.userInput.fill(user);
    await this.borrowButton.click();
  }

  async returnBook() {
    await this.returnButton.click();
  }

  async deleteBook() {
    this.page.once('dialog', d => d.accept());
    await this.deleteButton.click();
  }

  async goBack() {
    await this.backButton.click();
  }

  async goToEdit() {
    await this.editButton.click();
  }
}