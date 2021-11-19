import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklySpendingComponent } from './weekly-spending.component';

describe('WeeklySpendingComponent', () => {
  let component: WeeklySpendingComponent;
  let fixture: ComponentFixture<WeeklySpendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklySpendingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklySpendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
