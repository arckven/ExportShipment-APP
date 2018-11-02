import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomsModalComponent } from './customs-modal.component';

describe('CustomsModalComponent', () => {
  let component: CustomsModalComponent;
  let fixture: ComponentFixture<CustomsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
