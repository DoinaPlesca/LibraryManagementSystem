import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthorCreatePage } from './author-create.page';

describe('AuthorCreatePage', () => {
  let component: AuthorCreatePage;
  let fixture: ComponentFixture<AuthorCreatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
