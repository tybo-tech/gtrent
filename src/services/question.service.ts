import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Question } from 'src/models/question.model';


@Injectable({
  providedIn: 'root'
})
export class QuestionService {



  url: string;

  constructor(
    private http: HttpClient
  ) {

    this.url = environment.API_URL;
  }

  getByOtherId(otherId: string) {
    return this.http.get<Question>(`${this.url}/api/question/get-by-otherid.php?OtherId=${otherId}`)
  }
  getQuestions(statusId) {
    return this.http.get<Question[]>(`${this.url}/api/question/get-questions.php?StatusId=${statusId}`)
  }

  update(question: Question) {
    return this.http.post<Question>(
      `${this.url}/api/question/update-question.php`, question
    );
  }

  add(company: Question) {
    return this.http.post<Question>(
      `${this.url}/api/question/add-question.php`, company
    );
  }



}
