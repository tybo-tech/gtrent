import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Questiontest } from 'src/models/questiontest.model';


@Injectable({
  providedIn: 'root'
})
export class QuestiontestService {



  url: string;

  constructor(
    private http: HttpClient
  ) {

    this.url = environment.API_URL;
  }


  update(questiontest: Questiontest) {
    return this.http.post<Questiontest>(
      `${this.url}/api/questiontest/update-questiontest.php`, questiontest
    );
  }

  add(questiontest: Questiontest) {
    return this.http.post<Questiontest>(
      `${this.url}/api/questiontest/add-questiontest.php`, questiontest
    );
  }

  addRange(questiontests: Questiontest[]) {
    return this.http.post<Questiontest[]>(
      `${this.url}/api/questiontest/add-questiontest-range.php`, questiontests
    );
  }



}
