import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Testingreport } from 'src/models/testingreport.model';
import { User } from 'src/models/user.model';
import { SliderWidgetModel } from 'src/models/UxModel.model';
import { AccountService } from 'src/services/account.service';
import { TestingreportService } from 'src/services/testingreport.service';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-testingreports',
  templateUrl: './testingreports.component.html',
  styleUrls: ['./testingreports.component.scss']
})
export class TestingreportsComponent implements OnInit {

  user: User;
  tests: Testingreport[];
  test: Testingreport;
  listItems: SliderWidgetModel[]
  heading: string;
  showFilter = true;

  constructor(
    private accountService: AccountService,
    private testingreportService: TestingreportService,
    private router: Router,
    private uxService: UxService
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.getQuestions();
  }
  getQuestions() {
    this.testingreportService.getTestingReports(1).subscribe(data => {
      this.tests = data;
      this.listItems = [];
      this.tests.forEach(item => {
        this.listItems.push({
          Id: item.TestingReportId,
          Name: `${item.CertNo} - ${item.CustomerName}`,
          Description: `${item.MachineName}`,
          Link: `admin/dashboard/testingreport/${item.TestingReportId}`,
          Icon: `assets/images/icon-customer.svg`
        })


      })
    });
  }

  add() {
    this.heading = 'Adding  new  question.';
    this.router.navigate(['admin/dashboard/test-report/add/customer']);

  }
  back() {
    this.router.navigate(['admin/dashboard']);
  }

  save() {
    if (this.test && this.test.CreateDate && this.test.TestingReportId.length > 1) {
      this.testingreportService.update(this.test).subscribe(data => {
        if (data && data.TestingReportId) {
          this.uxService.updateMessagePopState("Testing Report saved.");
          this.test = null;
          this.getQuestions();

        }
      })
    } else {
      this.testingreportService.add(this.test).subscribe(data => {
        if (data && data.TestingReportId) {
          this.uxService.updateMessagePopState("Testing Report saved..");
          this.test = null;
          this.getQuestions();

        }
      })
    }

  }

  onitemSelected(item: SliderWidgetModel) {
    this.heading = 'Veiw/Upate question.';
    this.test = this.tests.find(x => x.TestingReportId === item.Id);
  }
}
