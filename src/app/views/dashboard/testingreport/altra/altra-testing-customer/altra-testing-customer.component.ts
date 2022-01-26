import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Testingreport } from 'src/models/testingreport.model';
import { BreadModel } from 'src/models/UxModel.model';
import { TestingreportService } from 'src/services/testingreport.service';
import { TEST_REPORT_PAGES } from 'src/shared/constants';

@Component({
  selector: 'app-altra-testing-customer',
  templateUrl: './altra-testing-customer.component.html',
  styleUrls: ['./altra-testing-customer.component.scss']
})
export class AltraTestingCustomerComponent implements OnInit {

  @Input() testingreport: Testingreport;
  items: BreadModel[];
  years: number[] = []; year: string;
  days: number[] = []; day: string;
  months: string[] = []; month: string;

  constructor(private router: Router, private testingreportService: TestingreportService) { }

  ngOnInit(): void {
    this.loadBread();
    this.loadMetadata();
    if (this.testingreport && this.testingreport.NextInspectionDate) {
      const items = this.testingreport.NextInspectionDate.split(' ');
      if (items && items.length === 3) {
        this.day = items[0];
        this.month = items[1];
        this.year = items[2];
      }
    }

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
      this.testingreport.NextInspectionDate = `${this.day} ${this.month} ${this.year}`
      this.testingreportService.saveTest(this.testingreport);
      this.router.navigate([`admin/dashboard/test-report/${this.testingreport.TestingReportId || 'add'}/${TEST_REPORT_PAGES.VESSEL.Name}`]);
    }
  }
  previousPage() {
    this.router.navigate([`admin/dashboard/testing-reports`]);
  }

  loadBread() {


    this.items = [
      {
        Name: 'Basic Info',
        Link: `admin/dashboard/test-report/${this.testingreport.TestingReportId || 'add'}/${TEST_REPORT_PAGES.CUSTOMER.Name}`,
        Class: ['active']
      },
      {
        Name: 'Nameplate',
        Link: `admin/dashboard/test-report/${this.testingreport.TestingReportId || 'add'}/${TEST_REPORT_PAGES.VESSEL.Name}`,
        Class: ['']
      },
      {
        Name: 'Testing info',
        Link: `admin/dashboard/test-report/${this.testingreport.TestingReportId || 'add'}/${TEST_REPORT_PAGES.TEST_INFO.Name}`,
        Class: ['']
      }
    ];
  }
  loadMetadata() {
    const year = new Date().getFullYear();
    this.years = [];
    for (let i = 0; i < 7; i++) {
      this.years.push(year + i);
    }

    for (let i = 1; i < 32; i++) {
      this.days.push(i);
    }



    this.months = ["January", "February",
      "March", "April", "May", "June", "July",
      "August", "September", "October", "November",
      "December"];
  }
}
