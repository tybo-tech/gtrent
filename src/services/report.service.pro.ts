import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CompanyCategory } from 'src/models/company.category.model';
import { Category } from 'src/models/category.model';
import { Company } from 'src/models/company.model';
import { Images } from 'src/models/images.model';
import { Product } from 'src/models';
import { TestReportPro } from 'src/app/views/dashboard/testingreport/_v2/models/TestReportPro';


@Injectable({
  providedIn: 'root'
})
export class ReportProService {



  url: string;

  constructor(
    private http: HttpClient
  ) {

    this.url = environment.API_URL;
  }

  getByOtherId(otherId: string) {
    return this.http.get<CompanyCategory>(`${this.url}/api/images/get-by-otherid.php?OtherId=${otherId}`)
  }


  updateRange(images: Images[]) {
    return this.http.post<Product>(
      `${this.url}/api/images/update-image-range.php`, images
    );
  }
  update(report: TestReportPro) {
    return this.http.post<TestReportPro>(
      `${this.url}/api/report-pro/update-report.php`, report
    );
  }
  query(queryStrings: any) {
    return this.http.post<TestReportPro>(
      `${this.url}/api/report-pro/query.php`, queryStrings
    );
  }
  queryV2(queryStrings: any) {
    return this.http.post<TestReportPro>(
      `${this.url}/api/report-pro/query-v2.php`, queryStrings
    );
  }
  add(report: TestReportPro) {
    return this.http.post<TestReportPro>(
      `${this.url}/api/report-pro/add-report.php`, report
    );
  }
  getAll() {
    return this.http.get<TestReportPro[]>(
      `${this.url}/api/report-pro/get-all.php`
    );
  }
  get(TestReportProId: string, DisplayMode = undefined) {
    if (DisplayMode) {
      return this.http.get<TestReportPro>(
        `${this.url}/api/report-pro/get.php?TestReportProId=${TestReportProId}&DisplayMode=${DisplayMode}`
      );
    }
    return this.http.get<TestReportPro>(
      `${this.url}/api/report-pro/get.php?TestReportProId=${TestReportProId}`
    );
  }

  getInvoiceURL(orderId: string) {
    let invoiceUrl = 'docs/48f1/report.php';
    return `${this.url}api/${invoiceUrl}?guid=${orderId}`;
  }


}
