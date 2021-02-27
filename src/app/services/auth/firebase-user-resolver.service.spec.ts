import { TestBed } from '@angular/core/testing';

import { FirebaseUserResolverService } from './firebase-user-resolver.service';

describe('FirebaseUserResolverService', () => {
  let service: FirebaseUserResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseUserResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
