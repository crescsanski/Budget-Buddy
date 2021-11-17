import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicWidgetComponent } from './basic-widget.component';

describe('BasicWidgetComponent', () => {
  let component: BasicWidgetComponent;
  let fixture: ComponentFixture<BasicWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
