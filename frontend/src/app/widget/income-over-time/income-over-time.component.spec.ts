import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeOverTimeComponent } from './income-over-time.component';

describe('IncomeOverTimeComponent', () => {
  let component: IncomeOverTimeComponent;
  let fixture: ComponentFixture<IncomeOverTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomeOverTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeOverTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
