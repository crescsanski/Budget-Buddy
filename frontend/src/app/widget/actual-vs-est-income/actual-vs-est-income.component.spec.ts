import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualVsEstIncomeComponent } from './actual-vs-est-income.component';

describe('ActualVsEstIncomeComponent', () => {
  let component: ActualVsEstIncomeComponent;
  let fixture: ComponentFixture<ActualVsEstIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActualVsEstIncomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualVsEstIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
