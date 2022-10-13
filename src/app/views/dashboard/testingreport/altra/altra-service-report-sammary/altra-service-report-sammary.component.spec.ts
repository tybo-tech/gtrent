import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraServiceReportSammaryComponent } from './altra-service-report-sammary.component';

describe('AltraServiceReportSammaryComponent', () => {
  let component: AltraServiceReportSammaryComponent;
  let fixture: ComponentFixture<AltraServiceReportSammaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraServiceReportSammaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraServiceReportSammaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
