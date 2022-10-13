import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Question } from 'src/models/question.model';
import { Questiontest } from 'src/models/questiontest.model';
import { Testingreport } from 'src/models/testingreport.model';
import { BreadModel } from 'src/models/UxModel.model';
import { QuestionService } from 'src/services/question.service';
import { QuestiontestService } from 'src/services/questiontest.service';
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
  questions: Question[];

  constructor(
    private router: Router,
    private testingreportService: TestingreportService,
    private questionService: QuestionService,
    private questiontestService: QuestiontestService,

  ) { }

  ngOnInit(): void {
    this.loadBread();
    if (this.testingreport.Questiontests && this.testingreport.Questiontests.length) {
      this.loadOptions();
    }
    else
      this.getQuestions();
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
      // if (question.QuestionType === 'Fill in 2 blanks') {
  
      // }
    })
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

  getQuestions() {
    this.questionService.getQuestions(1).subscribe(data => {
      this.questions = data;
      if (!this.testingreport.Questiontests || !this.testingreport.Questiontests.length) {
        this.testingreport = this.testingreportService.genarateQuestionsList(this.testingreport, this.questions);
        this.questiontestService.addRange(this.testingreport.Questiontests).subscribe(data => {
          if (data && data.length) {
            this.testingreport.Questiontests = data;
            this.loadOptions();
          }
        })
      }


    });
  }
  itemChanged(question: Questiontest) {
    this.questiontestService.update(question).subscribe(data => { });
  }

}
