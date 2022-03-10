import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetBreakdownChartComponent } from './budget-breakdown-chart.component';

describe('BudgetBreakdownChartComponent', () => {
  let component: BudgetBreakdownChartComponent;
  let fixture: ComponentFixture<BudgetBreakdownChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetBreakdownChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetBreakdownChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
