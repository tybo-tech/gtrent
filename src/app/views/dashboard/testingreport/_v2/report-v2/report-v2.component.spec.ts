import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportV2Component } from './report-v2.component';

describe('ReportV2Component', () => {
  let component: ReportV2Component;
  let fixture: ComponentFixture<ReportV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
