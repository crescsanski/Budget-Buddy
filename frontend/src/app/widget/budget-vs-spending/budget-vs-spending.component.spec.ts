import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetVsSpendingComponent } from './budget-vs-spending.component';

describe('BudgetVsSpendingComponent', () => {
  let component: BudgetVsSpendingComponent;
  let fixture: ComponentFixture<BudgetVsSpendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetVsSpendingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetVsSpendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
