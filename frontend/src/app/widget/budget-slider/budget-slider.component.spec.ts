import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetSliderComponent } from './budget-slider.component';

describe('BudgetSliderComponent', () => {
  let component: BudgetSliderComponent;
  let fixture: ComponentFixture<BudgetSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetSliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
