import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HelperClass } from 'src/app/classes/HelperClass';
import { Testingreport } from 'src/models/testingreport.model';
import { User } from 'src/models/user.model';
import { BreadModel, SliderWidgetModel } from 'src/models/UxModel.model';
import { AccountService } from 'src/services/account.service';
import { ReportProService } from 'src/services/report.service.pro';
import { TestingreportService } from 'src/services/testingreport.service';
import { UxService } from 'src/services/ux.service';
import { ADMIN, REPORT_STATUS, TECHNICIAN, TEMPLATE_ID } from 'src/shared/constants';
import { TestReportPro } from '../_v2/models/TestReportPro';

@Component({
  selector: 'app-testingreports',
  templateUrl: './testingreports.component.html',
  styleUrls: ['./testingreports.component.scss']
})
export class TestingreportsComponent implements OnInit {

  user: User;
  tests: TestReportPro[];
  test: Testingreport;
  listItems: SliderWidgetModel[]
  heading: string;
  showFilter = true;
  items: BreadModel[];
  TECHNICIAN = TECHNICIAN;
  ADMIN = ADMIN;
  orderStatus: number = REPORT_STATUS.PENDING_VERIFY.Id;

  constructor(
    private accountService: AccountService,
    private testingreportService: TestingreportService,
    private router: Router,
    private uxService: UxService,
    private reportProService: ReportProService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.getAll();

  }

  getAll() {
    this.reportProService.getAll().subscribe(data => {
      if (data && data.length) {
        this.tests = data;
        this.listItems = [];
        this.loadBread();
        this.tests.forEach(item => {
          this.listItems.push({
            Id: item.TestReportProId,
            Name: `${item.Name}`,
            Description: `${item.Description}`,
            Description2: `${item.StatusName}`,
            Link: `admin/dashboard/test-report-pro/${item.TestReportProId}`,
            Icon: `assets/images/icon.svg`,
            CanDelete: true
          })


        })
      } else {
        this.tests = [];
      }

    })
  }
  itemDeleteEvent(item: SliderWidgetModel) {
    const report = this.tests.find(x => x.TestReportProId === item.Id);
    if (!report)
      return;

    const query = HelperClass.GetDeleteReportQuery(report.TestReportProId);
    this.reportProService.queryV2({ Query: query }).subscribe(data => {
      console.log(data);
      this.messageService.add({ severity: 'error', summary: 'Report deleted', detail: `` });
      this.getAll();
    })

    console.log(report);



  }
  template() {
    this.router.navigate([`admin/dashboard/test-report-template/${TEMPLATE_ID}`]);
  }


  add() {
    this.heading = 'Adding  new  question.';
    this.router.navigate(['admin/dashboard/test-report-pro']);

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
          // this.getQuestions();

        }
      })
    } else {
      this.testingreportService.add(this.test).subscribe(data => {
        if (data && data.TestingReportId) {
          this.uxService.updateMessagePopState("Testing Report saved..");
          this.test = null;
          // this.getQuestions();

        }
      })
    }

  }

  onitemSelected(item: SliderWidgetModel) {
    this.heading = 'Veiw/Upate question.';
    // this.test = this.tests.find(x => x.TestingReportId === item.Id);
  }
  loadBread() {

    this.items = [];
    return;
    this.items = [
      {
        Name: REPORT_STATUS.PENDING_VERIFY.Name,
        Link: `admin/dashboard/services/${REPORT_STATUS.PENDING_VERIFY.Id}`,
        Class: Number(this.orderStatus) === REPORT_STATUS.PENDING_VERIFY.Id ? ['active'] : []
      },
      {
        Name: REPORT_STATUS.DRAFT_SAVED.Name,
        Link: `admin/dashboard/services/${REPORT_STATUS.DRAFT_SAVED.Id}`,
        Class: Number(this.orderStatus) === REPORT_STATUS.DRAFT_SAVED.Id ? ['active'] : []
      },
      {
        Name: REPORT_STATUS.SENT.Name,
        Link: `admin/dashboard/services/${REPORT_STATUS.SENT.Id}`,
        Class: Number(this.orderStatus) === REPORT_STATUS.SENT.Id ? ['active'] : []
      }
    ];
  }
}
