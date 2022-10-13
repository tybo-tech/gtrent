import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestReportTemplateComponent } from './test-report-template.component';

describe('TestReportTemplateComponent', () => {
  let component: TestReportTemplateComponent;
  let fixture: ComponentFixture<TestReportTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestReportTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestReportTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
