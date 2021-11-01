import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterNavComponent } from './register-nav.component';

describe('RegisterNavComponent', () => {
  let component: RegisterNavComponent;
  let fixture: ComponentFixture<RegisterNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
