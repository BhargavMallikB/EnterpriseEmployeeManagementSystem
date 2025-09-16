import { TestBed } from '@angular/core/testing';

import { EemsUiLibraryService } from './eems-ui-library.service';

describe('EemsUiLibraryService', () => {
  let service: EemsUiLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EemsUiLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
