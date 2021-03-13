import { TestBed } from '@angular/core/testing';

import { FavoritePubpikService } from './favorite-pubpik.service';

describe('FavoritePubpikService', () => {
  let service: FavoritePubpikService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritePubpikService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
