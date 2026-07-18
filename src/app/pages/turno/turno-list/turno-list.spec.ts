import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoList } from './turno-list';

describe('TurnoList', () => {
  let component: TurnoList;
  let fixture: ComponentFixture<TurnoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnoList],
    }).compileComponents();

    fixture = TestBed.createComponent(TurnoList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
