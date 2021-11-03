import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptTrackingComponent } from './receipt-tracking.component';

describe('ReceiptTrackingComponent', () => {
  let component: ReceiptTrackingComponent;
  let fixture: ComponentFixture<ReceiptTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptTrackingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
