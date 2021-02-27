import { TestBed } from '@angular/core/testing';

import { PubpikService } from './pubpik.service';

describe('PubpikService', () => {
  let service: PubpikService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PubpikService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
