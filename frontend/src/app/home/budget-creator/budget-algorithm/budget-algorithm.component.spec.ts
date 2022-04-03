import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetAlgorithmComponent } from './budget-algorithm.component';

describe('BudgetAlgorithmComponent', () => {
  let component: BudgetAlgorithmComponent;
  let fixture: ComponentFixture<BudgetAlgorithmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetAlgorithmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetAlgorithmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
