import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserBorrowsPage } from './user-borrows.page';

describe('UserBorrowsPage', () => {
  let component: UserBorrowsPage;
  let fixture: ComponentFixture<UserBorrowsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBorrowsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
