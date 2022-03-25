import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableChallengesComponent } from './available-challenges.component';

describe('AvailableChallengesComponent', () => {
  let component: AvailableChallengesComponent;
  let fixture: ComponentFixture<AvailableChallengesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailableChallengesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableChallengesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
