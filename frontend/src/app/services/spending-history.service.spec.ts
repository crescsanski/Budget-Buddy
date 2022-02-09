import { TestBed } from '@angular/core/testing';

import { SpendingHistoryService } from './spending-history.service';

describe('SpendingHistoryService', () => {
  let service: SpendingHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpendingHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
