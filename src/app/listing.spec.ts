import { TestBed } from '@angular/core/testing';

import { ListingService } from './listing.service';
import { provideHttpClient } from '@angular/common/http';

describe('ListingService', () => {
  let service: ListingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListingService, provideHttpClient()]
    });
    service = TestBed.inject(ListingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
