import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/models';
import { Customer } from 'src/models/customer.model';
import { Machine } from 'src/models/machine.model';
import { ModalModel } from 'src/models/modal.model';
import { Question } from 'src/models/question.model';
import { Questiontest } from 'src/models/questiontest.model';
import { Testingreport } from 'src/models/testingreport.model';
import { AccountService, EmailService } from 'src/services';
import { CustomerService } from 'src/services/customer.service';
import { QuestionService } from 'src/services/question.service';
import { QuestiontestService } from 'src/services/questiontest.service';
import { TestingreportService } from 'src/services/testingreport.service';
import { UxService } from 'src/services/ux.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { IMAGES_HEADER } from 'src/shared/image-header';
import { Images } from 'src/models/images.model';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-add-view-get-testingreport',
  templateUrl: './add-view-get-testingreport.component.html',
  styleUrls: ['./add-view-get-testingreport.component.scss']
})
export class AddViewGetTestingreportComponent implements OnInit {
  user: User;
  serviceId: string;
  test: Testingreport;
  heading = 'Customer Signature';
  showSign: boolean;
  newRemark: Questiontest;
  useBase64 = true;
  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'View Service',
    routeTo: 'dashboard',
    img: undefined
  };
  changeCustomer: boolean;
  selectMachine: boolean;
  customer: Customer;
  questions: Question[];
  genaredList: any[];
  genaredList2: any[];
  genaredListMerged: any[];
  remarks: any[];
  constructor(
    private router: Router,
    private accountService: AccountService,
    private emailService: EmailService,
    private customerService: CustomerService,
    private uxService: UxService,
    private activatedRoute: ActivatedRoute,
    private testingreportService: TestingreportService,
    private questionService: QuestionService,
    private questiontestService: QuestiontestService,

  ) {
    this.activatedRoute.params.subscribe(r => {
      this.accountService.user.subscribe(data => {
        this.user = data;
      });
      this.serviceId = r.id;
      if (this.serviceId === 'add') {


        this.test = {
          Id: 0,
          TestingReportId: '',
          CustomerId: '',
          CustomerName: '',
          MachineId: '',
          MachineName: '',
          CertNo: '',
          Dol: '',
          DateOfTest: '',
          StartTime: '',
          EndTime: '',
          ReasonForTest: '',
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
        };
        this.getQuestions();
      } else {
        this.getTest();
      }

    });
  }

  ngOnInit() {

  }
  getTest() {
    this.testingreportService.getTestingReport(this.serviceId).subscribe(data => {
      this.test = data;
      this.getQuestions();
      this.newRemark = {
        QuestioTestId: '',
        QuestionId: 'Remark',
        TestingReportId: this.test && this.test.TestingReportId || '',
        Question: 'Remark',
        CertificateQuestion: 'Remark',
        Position: 10000,
        Answer: '',
        Remarks: '',
        Status: '',
        CreateUserId: '',
        ModifyUserId: '',
        StatusId: 1,
        Options: []

      }
    })
  }
  getQuestions() {
    this.questionService.getQuestions(1).subscribe(data => {
      if (data && data.length) {
        this.questions = data;
        if (!this.test.Questiontests || !this.test.Questiontests.length) {
          this.test.Questiontests = [];
        }
        this.questions.forEach(question => {
          let options = [];
          if (question.Option1 && question.Option2) {
            options = [
              {
                Id: 1,
                Classes: ['tertiary'],
                Name: question.Option1
              },
              {
                Id: 2,
                Classes: ['tertiary'],
                Name: question.Option2
              }

            ]
            if (question.Option3) {
              options.push({
                Id: 3,
                Classes: ['tertiary'],
                Name: question.Option3
              })
            }
          }
          const item = this.test.Questiontests && this.test.Questiontests.find(x => x.QuestionId === question.QuestionId);
          if (item) {
            item.Options = options;
            if (item.Answer && item.Options.find(x => x.Name === item.Answer)) {
              item.Options.find(x => x.Name === item.Answer).Classes = ['secondary'];
            }
          } else {
            this.test.Questiontests.push({
              QuestioTestId: '',
              QuestionId: question.QuestionId,
              TestingReportId: this.test && this.test.TestingReportId || '',
              Question: question.Question,
              CertificateQuestion: question.CertificateQuestion,
              Position: question.Position,
              Answer: '',
              Remarks: '',
              Status: '',
              CreateUserId: '',
              ModifyUserId: '',
              StatusId: 1,
              Options: options

            })
          }

        })
        this.genarateQuestionsList();
        // this.generatePdf();
      }
    });
  }
  back() {
    this.router.navigate(['admin/dashboard/testing-reports']);
  }

  onItemSelectedMachineEvent(selectMachine: Machine) {
    if (selectMachine) {
      this.test.Machine = selectMachine;
      this.test.MachineId = selectMachine.MachineId;
      this.test.MachineName = selectMachine.Model;
      this.test.SerialNo = selectMachine.Serial;
      this.selectMachine = false;
      this.save();
    }

  }

  genarateQuestionsList() {
    this.genaredList = [];
    this.genaredList2 = [];
    this.test.Questiontests.forEach((item, index) => {

      if (item.Answer && index < this.test.Questiontests.filter(x => x.Answer).length / 2) {
        this.genaredList.push(
          [index + 1, item.CertificateQuestion || item.Question, item.Answer]
        )
      }


      if (item.Answer && index >= this.test.Questiontests.filter(x => x.Answer).length / 2) {
        this.genaredList2.push(
          [index + 1, item.CertificateQuestion || item.Question, item.Answer]
        )
      }

    });

    console.log('L1', this.genaredList);
    console.log("L2", this.genaredList2);
    this.genaredListMerged = [];
    this.genaredList.forEach((item1, index) => {
      this.genaredListMerged.push(
        [
          {
            border: [true, true, true, false],
            text: `${item1[0]}`
          },
          {
            border: [true, true, true, false],
            text: `${item1[1]}`
          },
          {
            border: [true, true, true, false],
            text: `${item1[2]}`
          },
          {
            border: [true, true, true, false],
            text: this.genaredList2[index] && this.genaredList2[index][0] || ''
          },
          {
            border: [true, true, true, false],
            text: this.genaredList2[index] && this.genaredList2[index][1] || ''
          },
          {
            border: [true, true, true, false],
            text: this.genaredList2[index] && this.genaredList2[index][2] || ''
          },

        ]
      );
    });

    if (!this.genaredListMerged || !this.genaredListMerged.length) {
      this.genaredListMerged.push(
        [
          {
            border: [true, true, true, false],
            text: ``
          },
          {
            border: [true, true, true, false],
            text: ``
          },
          {
            border: [true, true, true, false],
            text: ``
          },
          {
            border: [true, true, true, false],
            text: ''
          },
          {
            border: [true, true, true, false],
            text: ''
          },
          {
            border: [true, true, true, false],
            text: ''
          },

        ]
      );
    }

    this.remarks = this.test.Remarks.map((x, index) => {
      return [{
        text: `${index + 1}. ${x.Answer}`,
        border: [true, true, true, false]
      }]
    });

    if (!this.remarks || !this.remarks.length) {
      this.remarks = [
        {
          text: ``,
          border: [true, true, true, false]
        }
      ]
    }

  }

  doneSelectingCustomer(customer: Customer) {

    if (customer && this.test) {
      this.customer = customer;
      this.test.Customer = customer;
      this.test.CustomerName = customer.Name;
      this.test.CustomerId = customer.CustomerId;
      this.changeCustomer = false;
      this.selectMachine = true;
    }


  }

  updateTest() {

  }

  saveCustomer() {
    if (this.test.Customer) {
      this.customerService.updateCustomerSync(this.test.Customer).subscribe(data => {
        if (data && data.CustomerId) {

        }
      })
    }

  }
  save() {
    if (this.test && this.test.CreateDate && this.test.TestingReportId.length > 1) {
      this.testingreportService.update(this.test).subscribe(data => {
        if (data && data.TestingReportId) {
          this.uxService.updateMessagePopState("Question saved.");
          this.test = data;
          this.router.navigate([`admin/dashboard/testingreport/${data.TestingReportId}`]);
        }
      })
    } else {
      this.testingreportService.add(this.test).subscribe(data => {
        if (data && data.TestingReportId) {
          this.uxService.updateMessagePopState("Question saved.");
          this.test = data;
          this.router.navigate([`admin/dashboard/testingreport/${data.TestingReportId}`]);

        }
      })
    }
  }
  selectOption(option, question: Questiontest) {
    question.Options.map(x => x.Classes = ['tertiary']);
    option.Classes = ['secondary'];
    question.Answer = option.Name;
    if (question.CreateDate && question.QuestioTestId.length > 0) {
      this.questiontestService.update(question).subscribe(data => {
        if (data && data.QuestioTestId) {
          console.log(data);
          // this.getTest();
        }
      })
    } else {
      this.questiontestService.add(question).subscribe(data => {
        if (data && data.QuestioTestId) {
          console.log(data);
          // this.getTest();
        }
      })
    }

  }
  saveRemark(question: Questiontest) {
    if (question.CreateDate && question.QuestioTestId.length > 0) {
      this.questiontestService.update(question).subscribe(data => {
        if (data && data.QuestioTestId) {
          question = data;
        }
      })
    } else {
      this.questiontestService.add(question).subscribe(data => {
        if (data && data.QuestioTestId) {
          this.test.Remarks.push(data);
          this.newRemark = {
            QuestioTestId: '',
            QuestionId: 'Remark',
            TestingReportId: this.test && this.test.TestingReportId || '',
            Question: 'Remark',
            CertificateQuestion: 'Remark',
            Position: 10000,
            Answer: '',
            Remarks: '',
            Status: '',
            CreateUserId: '',
            ModifyUserId: '',
            StatusId: 1,
            Options: []

          }
        }
      })
    }
  }


  onUploadFinished(image: Images) {
    console.log(image);
    if (this.heading === 'Sign here') {
      this.test.TestDoneBySig = image.Url;
      this.test.TestDoneBy = image.SigName;
      this.showSign = false;
    }
  }

  generatePdf() {
    this.testingreportService.getTestingReport(this.serviceId).subscribe(data => {
      this.test = data;
      this.genarateQuestionsList();
      var documentDefinition = {
        content: [

          {
            image: IMAGES_HEADER,
            opacity: 1,
            width: 536,
            margin: [0, 0]
          },
          {
            text: 'PRESSURE VESSEL INSPECTION AND TEST RECORD',
            style: 'header'
          }, {
            text: '',
            style: 'header'
          }
          ,

          {

            layout: {
              defaultBorder: false,
            },
            style: 'tables',
            border: [false, false, false, false],

            table: {
              widths: [250, 250],
              body: [
                [
                  {
                    border: [false, false, false, false],
                    text: ''
                  },
                  {
                    border: [true, true, true, false],
                    text: `CERTIFICATE NO: ${this.test.CertNo}`
                  }

                ],
              ]
            }
          },

          {

            style: 'tables',
            table: {
              widths: [250, 250],
              body: [
                [
                  `OWNER/USER NAME: ${this.test.CustomerName}`,
                  `INSPECTION DATE: ${this.test.DateOfTest}`
                ],
                [
                  {
                    border: [true, true, true, false],
                    text: `LOCATION OF VESSEL: ${this.test.Location}`
                  },
                  {
                    border: [true, true, true, false],
                    text: `NEXT INSPECTION DATE: ${this.test.NextInspectionDate}`
                  }


                ],
              ],

            }
          },
          {
            style: 'tables',
            table: {
              widths: [164, 163, 164],
              body: [
                [
                  {
                    border: [true, true, true, false],
                    text: `REASON FOR TEST: ${this.test.ReasonForTest}`
                  },
                  {
                    border: [true, true, true, false],
                    text: `INITIAL INSTALLATION: ${this.test.InitialInstallation}`
                  },
                  {
                    border: [true, true, true, false],
                    text: `VISUAL INSPECTION: ${this.test.VisualInspection}`
                  }
                ]
              ],

            }
          },
          {
            style: 'tablesBigger',
            table: {
              widths: [509],
              body: [
                [
                  {
                    bold: true,
                    text: 'NAMEPLATE DETAILS:',
                    border: [true, true, true, false],
                  }
                  // ,
                  // {
                  //   bold: false,
                  //   text: `NEW NAME PLATE FITTED BY CLIENT?: ${this.test.IsNamePlateFittedByClient}`,
                  //   border: [true, true, true, false],
                  // }

                ]
              ],

            }
          },
          {
            style: 'tables',
            table: {
              widths: [164, 163, 164],
              body: [
                [
                  {
                    border: [true, true, true, false],
                    text: `MANUFACTURER:  ${this.test.Manufacturer}`
                  },
                  {
                    border: [true, true, true, false],
                    text: `COUNTRY OF ORIGIN: ${this.test.CountryOfOrigin}`
                  },
                  {
                    border: [true, true, true, false],
                    text: `YEAR OF MANUFACTURE: ${this.test.YearOfManufacture}`
                  }


                ],
                [
                  {
                    border: [true, true, true, false],
                    text: `SERIAL NO:  ${this.test.SerialNo}`
                  },
                  {
                    border: [true, true, true, false],
                    text: `CAPACITY: ${this.test.Capacity}`
                  },
                  {
                    border: [true, true, true, false],
                    text: `MARK OF AIA: ${this.test.MarkOfApprovedInspectionAuth}`
                  }
                ]

              ],

            }
          },
          {
            style: 'tables',
            table: {
              widths: [164, 230, 97],
              body: [
                [
                  {
                    border: [true, true, true, false],
                    text: `STANDARD OF DESIGN::  ${this.test.StandardOfDesign}`
                  },
                  {
                    border: [true, true, true, false],
                    text: `OPERATING TEMPERATURE:   ${this.test.MinOperatingTemperature} MIN /  ${this.test.MaxOperatingTemperature}  MAX ºC`
                  },
                  {
                    border: [true, true, true, false],
                    text: `CATEGORY: ${this.test.ClassOrCategory}`
                  }
                ]
              ],

            }
          },
          {
            style: 'tables',
            table: {
              widths: [250, 250],
              body: [
                [
                  {
                    border: [true, true, true, false],
                    text: `DESIGN PRESSURE: ${this.test.DesignPressure} K.P.A.`
                  },
                  {
                    border: [true, true, true, false],
                    text: `MAXIMUM WORKING PRESSURE: ${this.test.MaximumWorkingPressure} K.P.A.`
                  }
                ]
              ],

            }
          },
          {
            style: 'tables',
            table: {
              widths: [300, 200],
              body: [
                [
                  {
                    border: [true, true, true, false],
                    text: `TEST PRESSURE GAUGE S/N: ${this.test.TestPressureGauge}`
                  },
                  {
                    border: [true, true, true, false],
                    text: `TEST PUMP S/N: ${this.test.TestPump}`
                  }
                ]
              ],

            }
          },
          {
            style: 'tables',
            table: {
              widths: [300, 200],
              body: [
                [
                  {
                    border: [true, true, true, false],
                    text: `TEST TEMPERATURE GAUGE S/N: ${this.test.TestTemperatureGauge}`
                  },
                  {
                    border: [true, true, true, false],
                    text: `THICKNESS TESTER S/N: ${this.test.ThicknessTester}`
                  }
                ]
              ],

            }
          },
          {
            style: 'tablesBigger',
            table: {
              widths: [509],
              body: [
                [
                  {
                    bold: true,
                    text: 'INSPECTION RESULTS: YES / NO / N/A',
                    border: [true, true, true, false],
                  }
                ]
              ],

            }
          },
          {
            style: 'tables',
            table: {
              widths: [11, 196, 25, 11, 196, 25],
              body: [
                ...this.genaredListMerged || []
              ],

            }
          },



          {
            style: 'tablesBigger',
            table: {
              widths: [509],
              body: [
                [
                  {
                    bold: true,
                    text: 'REMARKS:',
                    border: [true, true, true, false],
                  }
                ]
              ],

            }
          },

          {
            style: 'tables',
            table: {
              widths: [509],
              body: [
                ...this.remarks
              ],

            }
          },

          {
            style: 'tablesBigger',
            table: {
              widths: [509],
              body: [
                [
                  {
                    bold: true,
                    text: 'CERTIFICATION: ',
                    border: [true, true, true, false],
                  }
                ]
              ],

            }
          },

          {
            style: 'tables',
            table: {
              widths: [509],
              body: [
                [
                  {
                    text: `I CERTIFY THAT THIS PRESSURE VESSEL HAS BEEN INSPECTED AND
                 TESTED IN ACCORDANCE WITH THE LEGAL REQUIREMENTS OF THE PRESSURE EQUIPMENT REGULATIONS 
                11 (d) OF 2009 AND THAT  THE OWNER/USER HAS BEEN INFORMED OF ALL WEAKNESSES AND DEFECTS`,
                    border: [true, true, true, false],
                  }
                ],
                ...
                [0,].map(x => {
                  return [
                    {
                      text: ``,
                      border: [true, false, true, false],
                    }
                  ]
                })

              ],

            }
          },

          {
            style: 'tables',
            table: {
              widths: [10, 174, 40, 120, 40, 80],
              body: [
                [
                  {
                    border: [true, false, false, false],
                    text: ``
                  },
                  {
                    border: [false, false, false, false],
                    text: ``,
                  },
                  {
                    border: [false, false, false, false],
                    text: ``
                  },


                  {
                    image: this.test.TestDoneBySig,
                    opacity: 1,
                    width: 70,
                    border: [false, false, false, false],
                    margin: [0, 0,0, -20],
                  },

                  {
                    border: [false, false, false, false],
                    text: ``
                  },
                  {
                    border: [false, false, true, false],
                    text: ``
                  }
                ],
                [
                  {
                    border: [true, false, false, false],
                    text: ``
                  },
                  {
                    border: [false, false, false, false],
                    text: this.test.TestDoneBy,
                  },
                  {
                    border: [false, false, false, false],
                    text: ``
                  },


                  {
                    border: [false, false, false, false],
                    text: ``
                  },
                  {
                    border: [false, false, false, false],
                    text: ``
                  },
                  {
                    border: [false, false, true, false],
                    text: `${this.test.DateOfTest}`
                  }
                ],
                [
                  {
                    border: [true, false, false, false],
                    text: ``
                  },
                  {
                    border: [false, true, false, false],
                    text: `CP NAME AND REGISTRATION NO`
                  },
                  {
                    border: [false, false, false, false],
                    text: ``
                  },
                  {
                    border: [false, true, false, false],
                    text: `SIGNATURE`
                  },
                  {
                    border: [false, false, false, false],
                    text: ``
                  },
                  {
                    border: [false, true, true, false],
                    text: `Date`
                  }
                ]
              ],

            }
          },
          {
            style: 'tables',
            table: {
              widths: [509],
              body: [

                ...
                [0, 0, 0].map(x => {
                  return [
                    {
                      text: ``,
                      border: [true, false, true, false],
                    }
                  ]
                })

              ],

            }
          },

          {
            style: 'tables',
            table: {
              widths: [10, 174, 40, 120, 40, 80],
              body: [
                [
                  {
                    border: [true, false, false, false],
                    text: ``
                  },
                  {
                    border: [false, true, false, false],
                    text: `ACCEPTED: OWNER/USER`
                  },
                  {
                    border: [false, false, false, false],
                    text: ``
                  },
                  {
                    border: [false, true, false, false],
                    text: `SIGNATURE`
                  },
                  {
                    border: [false, false, false, false],
                    text: ``
                  },
                  {
                    border: [false, true, true, false],
                    text: `Date`
                  }
                ]
              ],

            }
          },


          {
            style: 'tablesBigger',
            table: {
              widths: [509],
              body: [
                [
                  {
                    bold: true,
                    text: 'Trustiness: G M Trent S Botha',
                    border: [true, true, true, true],
                  }
                ]
              ],

            }
          }

        ],
        margin: [0, 0, 0, 0],
        styles: {
          header: {
            fontSize: 10,
            bold: true,
            alignment: 'center',
            margin: [0, 5, 0, 5]
          },
          tables: {
            margin: [0, 0, 0, 0],
            fontSize: 8,
          },
          tablesBigger: {
            margin: [0, 0, 0, 0],
            fontSize: 10,
          },
          subheader: {
            fontSize: 15,
            bold: true
          },
          quote: {
            italics: true
          },
          small: {
            fontSize: 8
          }
        },


      }
      pdfMake.createPdf(documentDefinition).open();
    })
  }

}
