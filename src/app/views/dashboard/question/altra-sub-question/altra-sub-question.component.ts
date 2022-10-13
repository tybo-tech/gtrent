import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Question } from 'src/models/question.model';
import { QuestionService } from 'src/services/question.service';

@Component({
  selector: 'app-altra-sub-question',
  templateUrl: './altra-sub-question.component.html',
  styleUrls: ['./altra-sub-question.component.scss']
})
export class AltraSubQuestionComponent implements OnInit {
  @Input() parent: Question;
  question: Question;
  heading: string;
  constructor(
    private questionService: QuestionService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
  }
  add() {
    this.heading = 'Adding  new  question.';

    this.question = {
      QuestionId: '',
      ParentId: this.parent.QuestionId,
      Question: '',
      CertificateQuestion: '',
      QuestionType: 'Dropdown Answer',
      QuestionNumber: '',
      QuestionOptions: '',
      CreateUserId: '',
      ModifyUserId: '',
      StatusId: 1
    };
  }



  save() {
    if (this.question && this.question.CreateDate && this.question.QuestionId.length > 1) {
      this.questionService.update(this.question).subscribe(data => {
        if (data && data.QuestionId) {
          // this.messageService.updateMessagePopState("Question saved.");
          this.question = null;

          // this.getQuestions();

        }
      })
    } else {
      this.questionService.add(this.question).subscribe(data => {
        if (data && data.QuestionId) {
          // this.messageService.updateMessagePopState("Question saved.");
          this.question = null;
          // this.getQuestions();
          this.parent.Children.push(data)

        }
      })
    }

  }


  
  view(item: Question) {
    this.heading = 'Veiw/Upate question.';
    this.question = item;
  }
}
