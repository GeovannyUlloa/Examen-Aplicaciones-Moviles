import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmTripPage } from './confirm-trip.page';

describe('ConfirmTripPage', () => {
  let component: ConfirmTripPage;
  let fixture: ComponentFixture<ConfirmTripPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmTripPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
