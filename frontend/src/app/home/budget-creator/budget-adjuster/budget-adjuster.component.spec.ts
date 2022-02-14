import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetAdjusterComponent } from './budget-adjuster.component';

describe('BudgetAdjusterComponent', () => {
  let component: BudgetAdjusterComponent;
  let fixture: ComponentFixture<BudgetAdjusterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetAdjusterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetAdjusterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
