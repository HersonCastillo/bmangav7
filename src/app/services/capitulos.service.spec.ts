import { TestBed } from '@angular/core/testing';

import { CapitulosService } from './capitulos.service';

describe('CapitulosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CapitulosService = TestBed.get(CapitulosService);
    expect(service).toBeTruthy();
  });
});
