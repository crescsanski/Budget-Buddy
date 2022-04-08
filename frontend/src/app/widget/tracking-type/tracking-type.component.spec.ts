import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingTypeComponent } from './tracking-type.component';

describe('TrackingTypeComponent', () => {
  let component: TrackingTypeComponent;
  let fixture: ComponentFixture<TrackingTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
