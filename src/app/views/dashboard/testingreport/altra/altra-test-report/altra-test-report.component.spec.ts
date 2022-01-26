import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraTestReportComponent } from './altra-test-report.component';

describe('AltraTestReportComponent', () => {
  let component: AltraTestReportComponent;
  let fixture: ComponentFixture<AltraTestReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraTestReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraTestReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
