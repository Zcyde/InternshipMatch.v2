import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillInput } from './skill-input';

describe('SkillInput', () => {
  let component: SkillInput;
  let fixture: ComponentFixture<SkillInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
