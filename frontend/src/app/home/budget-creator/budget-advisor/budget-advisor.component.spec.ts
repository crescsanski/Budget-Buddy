import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetAdvisorComponent } from './budget-advisor.component';

describe('BudgetAdvisorComponent', () => {
  let component: BudgetAdvisorComponent;
  let fixture: ComponentFixture<BudgetAdvisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetAdvisorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetAdvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
