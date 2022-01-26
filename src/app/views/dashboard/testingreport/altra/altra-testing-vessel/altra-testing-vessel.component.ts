import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Testingreport } from 'src/models/testingreport.model';
import { BreadModel } from 'src/models/UxModel.model';
import { TestingreportService } from 'src/services/testingreport.service';
import { TEST_REPORT_PAGES } from 'src/shared/constants';

@Component({
  selector: 'app-altra-testing-vessel',
  templateUrl: './altra-testing-vessel.component.html',
  styleUrls: ['./altra-testing-vessel.component.scss']
})
export class AltraTestingVesselComponent implements OnInit {

  @Input() testingreport: Testingreport;
  items: BreadModel[];

  constructor(private router: Router, private testingreportService: TestingreportService) { }

  ngOnInit(): void {
    this.loadBread();
  }

  nextPage() {
    this.testingreportService.saveTest(this.testingreport);
    this.router.navigate([`admin/dashboard/test-report/${this.testingreport.TestingReportId || 'add'}/${TEST_REPORT_PAGES.TEST_INFO.Name}`]);
  }
  previousPage() {
    this.router.navigate([`admin/dashboard/test-report/${this.testingreport.TestingReportId || 'add'}/${TEST_REPORT_PAGES.CUSTOMER.Name}`]);

  }

  loadBread() {


    this.items = [
      {
        Name: 'Basic Info',
        Link: `admin/dashboard/test-report/${this.testingreport.TestingReportId || 'add'}/${TEST_REPORT_PAGES.CUSTOMER.Name}`,
        Class: ['']
      },
      {
        Name: 'Nameplate',
        Link: `admin/dashboard/test-report/${this.testingreport.TestingReportId || 'add'}/${TEST_REPORT_PAGES.VESSEL.Name}`,
        Class: ['active']
      },
      {
        Name: 'Testing info',
        Link: `admin/dashboard/test-report/${this.testingreport.TestingReportId || 'add'}/${TEST_REPORT_PAGES.TEST_INFO.Name}`,
        Class: ['']
      }
    ];
  }
}
