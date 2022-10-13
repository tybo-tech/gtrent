import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Testingreport } from 'src/models/testingreport.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order } from 'src/models';
import { Question } from 'src/models/question.model';
import { Questiontest } from 'src/models/questiontest.model';


@Injectable({
  providedIn: 'root'
})
export class TestingreportService {



  url: string;
  private testBehaviorSubject: BehaviorSubject<Testingreport>;
  public testObservable: Observable<Testingreport>;

  constructor(
    private http: HttpClient
  ) {

    this.url = environment.API_URL;
    this.testBehaviorSubject = new BehaviorSubject<Testingreport>(null);
    this.testObservable = this.testBehaviorSubject.asObservable();
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

  saveTest(test: Testingreport) {
    if (!test)
      return false;

    if (test.CreateDate && test.CreateDate.length > 5) {
      this.update(test).subscribe(data => {
        if (data && data.TestingReportId) {
          this.updateTestState(data);
        }
      })
    } else {
      this.add(test).subscribe(data => {
        if (data && data.TestingReportId) {
          this.updateTestState(data);
        }
      })
    }
  }

  add(company: Testingreport) {
    return this.http.post<Testingreport>(
      `${this.url}/api/testingreport/add-testingreport.php`, company
    );
  }


  init(): Testingreport {
    return {
      Id: 0,
      TestingReportId: '',
      CustomerId: '',
      CustomerName: '',
      MachineId: '',
      MachineName: '',
      CertNo: '',
      Dol: 'D 702',
      DateOfTest: `${this.formatDate(new Date())}`,
      StartTime: '',
      EndTime: '',
      ReasonForTest: 'Statutory',
      InitialInstallation: '',
      CountryOfOrigin: '',
      StandardOfDesign: '',
      Location: '',
      NamePlate: '',
      IsNamePlateFittedByClient: '',
      Manufacturer: '',
      YearOfManufacture: '',
      SerialNo: '',
      Capacity: '',
      MarkOfApprovedInspectionAuth: '',
      NameNumberDateOfDesign: '',
      MinOperatingTemperature: '',
      MaxOperatingTemperature: '',
      ClassOrCategory: '',
      DesignPressure: '',
      MaximumWorkingPressure: '',
      ParticularsOfOpenings: '',
      TestPressureGauge: '',
      TestPump: '',
      TestTemperatureGauge: '',
      ThicknessTester: '',
      OtherComments: '',
      TestDoneBy: '',
      TestDoneBySig: '',
      AssistedBy: '',
      AssistedBySig: '',
      ReportCompiledBy: '',
      ReportCompiledBySig: '',
      NextInspectionDate: '',
      Certification: '',
      Notes: '',
      VisualInspection: '',
      CreateUserId: '',
      ModifyUserId: '',
      Status: '',
      StatusId: 1
    }
  }

  formatDate(d) {
    var month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  updateTestState(test: Testingreport) {
    this.testBehaviorSubject.next(test);
  }

  genarateQuestionsList(testingreport: Testingreport, questions: Question[]) {
    testingreport.Questiontests = [];
    questions.forEach(question => {
      let options = [];
      // let children: Questiontest[] = [];
      if (question.QuestionOptions) {
        options = question.QuestionOptions.split(',');
      }
      if (question.QuestionType === 'Sub Questions' && question.Children.length) {
        question.Children.forEach(child => {
          let childoptions = [];

          if (child.QuestionOptions) {
            childoptions = child.QuestionOptions.split(',');
          }
          testingreport.Questiontests.push({
            QuestioTestId: '',
            ParentId: child.ParentId,
            QuestionId: child.QuestionId,
            TestingReportId: testingreport.TestingReportId || '',
            Question: `${child.Question}`,
            CertificateQuestion: '',
            Position: 10000,
            Answer: '',
            OtherAnswer: '',
            Remarks: '',
            QuestionType: child.QuestionType,
            QuestionNumber: child.QuestionNumber,
            QuestionOptions: child.QuestionOptions,
            Status: '',
            CreateUserId: '',
            ModifyUserId: '',
            StatusId: 1,
            Options: childoptions
          })
        })
      }
      testingreport.Questiontests.push({
        QuestioTestId: '',
        QuestionId: question.QuestionId,
        ParentId: question.ParentId,
        TestingReportId: testingreport.TestingReportId || '',
        Question: `${question.QuestionNumber} ${question.Question}`,
        CertificateQuestion: '',
        Position: 10000,
        Answer: '',
        OtherAnswer: '',
        Remarks: '',
        QuestionType: question.QuestionType,
        QuestionNumber: question.QuestionNumber,
        QuestionOptions: question.QuestionOptions,
        Status: '',
        CreateUserId: '',
        ModifyUserId: '',
        StatusId: 1,
        Options: options
      })
    });
    return testingreport;
  }
}
