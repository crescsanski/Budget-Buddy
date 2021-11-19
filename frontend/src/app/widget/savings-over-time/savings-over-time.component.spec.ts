import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsOverTimeComponent } from './savings-over-time.component';

describe('SavingsOverTimeComponent', () => {
  let component: SavingsOverTimeComponent;
  let fixture: ComponentFixture<SavingsOverTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavingsOverTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingsOverTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
