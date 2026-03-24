import { TestBed } from '@angular/core/testing';
import { ResumeParser } from './resume-parser.service';

describe('ResumeParser', () => {
  let service: ResumeParser;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResumeParser);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
