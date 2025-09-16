import { TestBed } from '@angular/core/testing';

import { EemsDataSourceService } from './eems-data-source.service';

describe('EemsDataSourceService', () => {
  let service: EemsDataSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EemsDataSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
