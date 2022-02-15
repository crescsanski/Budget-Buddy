import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingVsIncomeComponent } from './spending-vs-income.component';

describe('SpendingVsIncomeComponent', () => {
  let component: SpendingVsIncomeComponent;
  let fixture: ComponentFixture<SpendingVsIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpendingVsIncomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpendingVsIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
