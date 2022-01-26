import { TestBed } from '@angular/core/testing';

import { LoadboxService } from './loadbox.service';

describe('LoadboxService', () => {
  let service: LoadboxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadboxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
