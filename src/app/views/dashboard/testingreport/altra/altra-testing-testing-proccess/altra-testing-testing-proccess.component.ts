import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Testingreport } from 'src/models/testingreport.model';
import { BreadModel } from 'src/models/UxModel.model';
import { TestingreportService } from 'src/services/testingreport.service';
import { TEST_REPORT_PAGES } from 'src/shared/constants';

@Component({
  selector: 'app-altra-testing-testing-proccess',
  templateUrl: './altra-testing-testing-proccess.component.html',
  styleUrls: ['./altra-testing-testing-proccess.component.scss']
})
export class AltraTestingTestingProccessComponent implements OnInit {

  @Input() testingreport: Testingreport;
  items: BreadModel[];

  constructor(private router: Router, private testingreportService: TestingreportService) { }

  ngOnInit(): void {
    this.loadBread();
  }

  nextPage() {
    if (!this.testingreport.CreateDate || !this.testingreport.CreateDate.length) {
      this.testingreportService.add(this.testingreport).subscribe(data => {
        if (data && data.TestingReportId) {
          this.testingreportService.updateTestState(data);
          this.router.navigate([`admin/dashboard/test-report/${data.TestingReportId}/${TEST_REPORT_PAGES.VESSEL.Name}`]);
        }
      })
    } else {
      this.testingreportService.saveTest(this.testingreport);
      this.router.navigate([`admin/dashboard/test-report/${this.testingreport.TestingReportId || 'add'}/${TEST_REPORT_PAGES.VESSEL.Name}`]);
    }
  }
  previousPage() {
    this.router.navigate([`admin/dashboard/test-report/${this.testingreport.TestingReportId || 'add'}/${TEST_REPORT_PAGES.VESSEL.Name}`]);
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
        Class: ['']
      },
      {
        Name: 'Testing info',
        Link: `admin/dashboard/test-report/${this.testingreport.TestingReportId || 'add'}/${TEST_REPORT_PAGES.TEST_INFO.Name}`,
        Class: ['active']
      }
    ];
  }
}
