import { TestBed } from '@angular/core/testing';

import { ReceiptTrackService } from './receipt-track.service';

describe('ReceiptTrackService', () => {
  let service: ReceiptTrackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceiptTrackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
