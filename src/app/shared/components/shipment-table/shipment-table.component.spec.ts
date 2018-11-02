import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentTableComponent } from './shipment-table.component';

describe('ShipmentTableComponent', () => {
  let component: ShipmentTableComponent;
  let fixture: ComponentFixture<ShipmentTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
