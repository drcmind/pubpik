import { TestBed } from '@angular/core/testing';

import { PasswordValidationService } from './password-validation.service';

describe('PasswordValidationService', () => {
  let service: PasswordValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
