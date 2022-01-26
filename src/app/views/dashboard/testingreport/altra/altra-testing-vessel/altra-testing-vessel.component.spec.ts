import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraTestingVesselComponent } from './altra-testing-vessel.component';

describe('AltraTestingVesselComponent', () => {
  let component: AltraTestingVesselComponent;
  let fixture: ComponentFixture<AltraTestingVesselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraTestingVesselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraTestingVesselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
