import { TestBed, inject } from '@angular/core/testing';

import { DdsapService } from './ddsap.service';

describe('DdsapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DdsapService]
    });
  });

  it('should be created', inject([DdsapService], (service: DdsapService) => {
    expect(service).toBeTruthy();
  }));
});
