import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Testingreport } from 'src/models/testingreport.model';


@Injectable({
  providedIn: 'root'
})
export class TestingreportService {


  
  url: string;

  constructor(
    private http: HttpClient
  ) {
  
    this.url = environment.API_URL;
  }

  getByOtherId(otherId: string) {
    return this.http.get<Testingreport>(`${this.url}/api/testingreport/get-by-otherid.php?OtherId=${otherId}`)
  }
  getTestingReports(statusId) {
    return this.http.get<Testingreport[]>(`${this.url}/api/testingreport/get-testingreports.php?StatusId=${statusId}`)
  }
  getTestingReport(TestingReportId) {
    return this.http.get<Testingreport>(`${this.url}/api/testingreport/get-testingreport-by-id.php?TestingReportId=${TestingReportId}`)
  }

  update(testingreport: Testingreport) {
    return this.http.post<Testingreport>(
      `${this.url}/api/testingreport/update-testingreport.php`, testingreport
    );
  }

  add(company: Testingreport) {
    return this.http.post<Testingreport>(
      `${this.url}/api/testingreport/add-testingreport.php`, company
    );
  }



}
