import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Images } from 'src/models/images.model';
import { Question } from 'src/models/question.model';
import { Testingreport } from 'src/models/testingreport.model';
import { User } from 'src/models/user.model';
import { AccountService } from 'src/services';
import { QuestionService } from 'src/services/question.service';
import { QuestiontestService } from 'src/services/questiontest.service';
import { TestingreportService } from 'src/services/testingreport.service';
import { TEST_REPORT_PAGES } from 'src/shared/constants';

@Component({
  selector: 'app-altra-test-report',
  templateUrl: './altra-test-report.component.html',
  styleUrls: ['./altra-test-report.component.scss']
})
export class AltraTestReportComponent implements OnInit {
  serviceId: any;
  pageId: any;
  testingreport: Testingreport
  user: User;
  questions: Question[];
  TEST_REPORT_PAGES = TEST_REPORT_PAGES;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private testingreportService: TestingreportService,
    private questionService: QuestionService,
    private questiontestService: QuestiontestService,
  ) {

    this.activatedRoute.params.subscribe(r => {

      this.serviceId = r.id;
      this.pageId = r.page;
      if (this.serviceId === 'add') {
        this.init();
      } else {
        this.getTest();
      }

    });
  }
  init() {

    this.testingreport = this.testingreportService.init();;
  }

  ngOnInit(): void {
    this.accountService.user.subscribe(data => {
      this.user = data;
    });
  }


  getTest() {
    this.testingreportService.getTestingReport(this.serviceId).subscribe(data => {
      this.testingreport = data;
      if (data && data.Questiontests && data.Questiontests.length)
        this.loadOptions();
        this.pushImage();

    })
  }
  loadOptions() {
    this.testingreport.Questiontests.forEach(question => {
      question.Options = question.QuestionOptions.split(',');
      if (question.QuestionType === 'Sub Questions' && question.Children.length) {
        question.Children.forEach(child => {
          child.Options = child.QuestionOptions.split(',');
        })
      }

      if (question.QuestionType === 'Fill in 1 blank' || question.QuestionType === 'Fill in 2 blanks') {
        question.Options = question.Question.split('_______');
      }

    })
  }

  pushImage(image: Images = null) {
    if (image)
      this.testingreport.Images.push(image);


    this.testingreport.Images.push({
      ImageId: '',
      OtherId: '',
      SigName: '',
      OptionId: 0,
      Url: ``,
      IsMain: 0,
      CreateUserId: '',
      ModifyUserId: '',
      StatusId: 1
    })
  }
  viewSummary(isback = false){
    if(isback){
      this.router.navigate([`admin/dashboard/test-report/${this.testingreport.TestingReportId}/${TEST_REPORT_PAGES.TEST_INFO.Name}`])
      return
    }
    this.router.navigate([`admin/dashboard/test-report/${this.testingreport.TestingReportId}/${TEST_REPORT_PAGES.TEST_SUMMARY.Name}`])
  }
}
