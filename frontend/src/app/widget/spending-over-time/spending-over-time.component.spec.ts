import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingOverTimeComponent } from './spending-over-time.component';

describe('SpendingOverTimeComponent', () => {
  let component: SpendingOverTimeComponent;
  let fixture: ComponentFixture<SpendingOverTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpendingOverTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpendingOverTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
