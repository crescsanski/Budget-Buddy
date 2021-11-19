import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgesWidgetComponent } from './badges-widget.component';

describe('BadgesWidgetComponent', () => {
  let component: BadgesWidgetComponent;
  let fixture: ComponentFixture<BadgesWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BadgesWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgesWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
