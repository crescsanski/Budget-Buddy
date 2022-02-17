import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingByCategoryComponent } from './spending-by-category.component';

describe('SpendingByCategoryComponent', () => {
  let component: SpendingByCategoryComponent;
  let fixture: ComponentFixture<SpendingByCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpendingByCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpendingByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
