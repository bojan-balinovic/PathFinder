import { TestBed } from '@angular/core/testing';

import { ShortestPathService } from './shortest-path.service';

describe('ShortestPathService', () => {
  let service: ShortestPathService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShortestPathService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
