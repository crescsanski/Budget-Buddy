import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklySpendingSmallComponent } from './weekly-spending-small.component';

describe('WeeklySpendingSmallComponent', () => {
  let component: WeeklySpendingSmallComponent;
  let fixture: ComponentFixture<WeeklySpendingSmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklySpendingSmallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklySpendingSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
