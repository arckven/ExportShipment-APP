import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SapModalComponent } from './sap-modal.component';

describe('SapModalComponent', () => {
  let component: SapModalComponent;
  let fixture: ComponentFixture<SapModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SapModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SapModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
