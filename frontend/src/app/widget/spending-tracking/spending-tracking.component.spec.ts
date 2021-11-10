import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingTracking as SpendingTrackingComponent } from './spending-tracking.component';

describe('SpendingTrackingComponent', () => {
  let component: SpendingTrackingComponent;
  let fixture: ComponentFixture<SpendingTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpendingTrackingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpendingTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
