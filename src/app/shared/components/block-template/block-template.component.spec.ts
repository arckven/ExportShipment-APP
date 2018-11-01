import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockTemplateComponent } from './block-template.component';

describe('BlockTemplateComponent', () => {
  let component: BlockTemplateComponent;
  let fixture: ComponentFixture<BlockTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
