import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Roadmap } from './roadmap';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('Roadmap', () => {
  let component: Roadmap;
  let fixture: ComponentFixture<Roadmap>;

  beforeEach(async () => {
    // Mock session storage
    const mockResult = {
      score: 50,
      threshold: 70,
      listingTitle: 'Test Role',
      matchedSkills: [],
      missingSkills: []
    };
    sessionStorage.setItem('matchResult', JSON.stringify(mockResult));

    await TestBed.configureTestingModule({
      imports: [Roadmap],
      providers: [
        provideRouter([
          { path: 'student/role-selection', component: class {} as any }
        ]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Roadmap);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    sessionStorage.clear();
  });
});
