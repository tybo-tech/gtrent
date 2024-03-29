import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models';
import { Question } from 'src/models/question.model';
import { SliderWidgetModel } from 'src/models/UxModel.model';
import { AccountService } from 'src/services/account.service';
import { QuestionService } from 'src/services/question.service';
import { UxService } from 'src/services/ux.service';
import { sectionTypes } from 'src/shared/constants';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  user: User;
  questions: Question[];
  question: Question;
  listItems: SliderWidgetModel[]
  heading: string;
  showFilter = true;
  sectionTypes = sectionTypes;

  constructor(
    private accountService: AccountService,
    private questionService: QuestionService,
    private router: Router,
    private uxService: UxService
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.getQuestions();
  }
  getQuestions() {
    this.questionService.getQuestions(1).subscribe(data => {
      this.questions = data || [];
      this.listItems = [];
      this.questions.forEach(item => {
        this.listItems.push({
          Id: item.QuestionId,
          Name: `${item.QuestionNumber} ${item.Question}`,
          Description: item.QuestionType,
          Link: `event`,
          Icon: `assets/images/qs.png`
        })


      })
    });
  }

  add() {
    this.heading = 'Adding  new  question.';

    this.question = {
      QuestionId: '',
      ParentId: '',
      Question: '',
      CertificateQuestion: '',
      QuestionType: 'Sub Questions',
      QuestionNumber: '',
      QuestionOptions: '',
      CreateUserId: '',
      ModifyUserId: '',
      StatusId: 1
    };
  }
  back() {
    this.router.navigate(['admin/dashboard']);
  }

  save() {
    if (this.question && this.question.CreateDate && this.question.QuestionId.length > 1) {
      this.questionService.update(this.question).subscribe(data => {
        if (data && data.QuestionId) {
          this.uxService.updateMessagePopState("Question saved.");
          this.question = null;
          this.getQuestions();

        }
      })
    } else {
      this.questionService.add(this.question).subscribe(data => {
        if (data && data.QuestionId) {
          this.uxService.updateMessagePopState("Question saved.");
          this.question = null;
          this.getQuestions();

        }
      })
    }

  }

  onitemSelected(item: SliderWidgetModel) {
    this.heading = 'Veiw/Upate question.';
    this.question = this.questions.find(x => x.QuestionId === item.Id);
  }
}
