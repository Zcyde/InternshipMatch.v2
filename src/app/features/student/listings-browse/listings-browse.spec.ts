import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingsBrowse } from './listings-browse';

describe('ListingsBrowse', () => {
  let component: ListingsBrowse;
  let fixture: ComponentFixture<ListingsBrowse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingsBrowse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListingsBrowse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
