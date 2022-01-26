import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
        this.getQuestions();
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
      this.getQuestions();
    })
  }

  getQuestions() {
    this.questionService.getQuestions(1).subscribe(data => {
      if (data && data.length) {
        this.questions = data;
        if (!this.testingreport.Questiontests || !this.testingreport.Questiontests.length) {
          this.testingreport.Questiontests = [];
        }
      }
    });
  }
}
