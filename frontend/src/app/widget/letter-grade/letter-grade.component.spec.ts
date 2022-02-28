import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterGradeComponent } from './letter-grade.component';

describe('LetterGradeComponent', () => {
  let component: LetterGradeComponent;
  let fixture: ComponentFixture<LetterGradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LetterGradeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
