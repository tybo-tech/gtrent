import { Component, OnInit } from '@angular/core';
import { REPORT } from '../data/reports';
import { TestReportPro } from '../models/TestReportPro';
import * as html2pdf from 'html2pdf.js';
import { ReportProService } from 'src/services/report.service.pro';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ADMIN, CUSTOMER, REPORT_MANAGER, REPORT_STATUSES, TECHNICIAN, TEMPLATE_ID } from 'src/shared/constants';
import { ColumnModel } from '../models/ColumnModel';
import { RowModel } from '../models/RowModel';
// import jsPDF from 'jspdf';
import jsPDFInvoiceTemplate, { OutputType, jsPDF } from "jspdf-invoice-template";
import { AccountService, UploadService, UserService } from 'src/services';
import { User } from 'src/models/user.model';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { environment } from 'src/environments/environment';
import { CustomerService } from 'src/services/customer.service';
import { Customer } from 'src/models/customer.model';
import { Images } from 'src/models/images.model';
import { HelperClass } from 'src/app/classes/HelperClass';

@Component({
  selector: 'app-report-v2',
  templateUrl: './report-v2.component.html',
  styleUrls: ['./report-v2.component.scss']
})
export class ReportV2Component implements OnInit {
  report: TestReportPro;
  readOnly = false;
  loading = false;
  chooseCustomer = false;
  testReportProId: any;
  isNew: boolean;
  showCanvas: boolean;
  certNoCol: ColumnModel;
  dateInThreeYears: string;
  inpectionDateId: string;
  nextInpectionDateId: string;
  items = [];
  heading = 'New test report';
  user: User;
  imageCol: ColumnModel;
  months: string[];
  searchString: string;
  selectedColumn: ColumnModel;
  REPORT_MANAGER = REPORT_MANAGER;
  REPORT_STATUSES = REPORT_STATUSES;
  ADMIN = ADMIN;
  TECHNICIAN = TECHNICIAN;
  customers: Customer[];
  customer: Customer;
  editing: boolean;
  signReport: boolean;
  constructor(private messageService: MessageService, private router: Router, private customerService: CustomerService, private uploadService: UploadService,
    private reportProService: ReportProService, private userService: UserService, private activatedRoute: ActivatedRoute, private accountService: AccountService,
  ) {

    this.activatedRoute.params.subscribe(r => {
      this.testReportProId = r.id;
      if (this.testReportProId) {
        this.loading = true;
        this.isNew = false;
        reportProService.get(this.testReportProId, 'Report').subscribe(data => {
          this.loading = false;
          if (data && data.Rows) {
            this.report = data;
            this.heading = this.report.Name;

            this.report.Rows.forEach(x => {
              if (x.Classes) {
                x.Classes = JSON.parse(x.Classes);
              }
              if (x.Columns) {


                x.Columns.forEach(c => {
                  if (c.Classes) {
                    c.Classes = JSON.parse(c.Classes);
                  }
                  if (c.Options) {
                    c.Options = JSON.parse(c.Options);
                  }
                })
              }
            })
          }

        });
      } else {
        this.loading = true;
        this.isNew = true;
        reportProService.get(TEMPLATE_ID, 'Report').subscribe(data => {
          this.loading = false;
          if (data && data.Rows) {
            this.report = data;
            this.report.TestReportProId = undefined;
            this.report.StatusId = 1;
            const InspDate = this.getColByName("InspDate");
            if (InspDate) {
              InspDate.Answer = HelperClass.GetTodayDate();
              const NextInspDate = this.getColByName("NextInspDate");
              if (NextInspDate) {
                this.nextInpectionDateId = 'NextInspDate';
                const date = this.getFutureDate(InspDate.Answer);
                this.dateInThreeYears = this.getFutureDate(InspDate.Answer, 3);
                NextInspDate.Answer = date;
              }
            }
            console.log('InspDate: ', InspDate);

            this.report.Rows.forEach((row, rowIndex) => {
              row.OrderingNo = rowIndex + 1;
              if (row.Classes) {
                row.Classes = JSON.parse(row.Classes);
              }
              if (row.Columns) {
                this.certNoCol = row.Columns.find(x => x.Answer === 'GTIR(GEN)');
                if (this.certNoCol) {
                  console.log('this.certNoCol', this.certNoCol);
                  this.certNoCol.Answer = this.generateCertNo();
                }
                row.Columns.forEach((col, colIndex) => {
                  col.OrderingNo = colIndex + 1;
                  col.OrderingNo = colIndex + 1;
                  col.RequireSecondary = `${col.RequireSecondary}` === "true";
                  if (col.Classes) {
                    col.Classes = JSON.parse(col.Classes);
                  }
                  if (col.Options) {
                    col.Options = JSON.parse(col.Options);
                  }
                })
              }
            })
          }

        });
      }
    });
  }
  generateCertNo(): any {
    let cNo = 1;
    let __reports = localStorage.getItem("__reports")
    if (__reports) {
      cNo += Number(__reports)
    }
    return 'GTIR' + cNo;
  }

  ngOnInit(): void {
    this.accountService.user.subscribe(data => {
      if (data) {
        this.user = data;
      }
    })

    this.months = ["January", "February",
      "March", "April", "May", "June", "July",
      "August", "September", "October", "November",
      "December"];
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.customersListObservable.subscribe(data => {
      this.customers = data || [];
      this.customers.forEach(item => {
        const nameArray = item.Name.trim().split(' ');
        if (nameArray.length === 1 && item.Name.length > 1)
          item.Dp = `${item.Name[0]}${item.Name[1]}`.toLocaleUpperCase();

        if (nameArray.length > 1 && item.Name.length > 1)
          item.Dp = `${item.Name[0]}${nameArray[1][0]}`.toLocaleUpperCase();

      });

    });
    this.customerService.getCustomers(this.user.CompanyId, CUSTOMER);
  }
  back() {
    this.router.navigate(['admin/dashboard/testing-reports']);
  }

  saveNewReport() {
    if (!this.report || !this.report.Rows || !this.report.Rows.length)
      return;
    // debugger
    this.loading = true;
    if (this.report.Rows[6] && this.report.Rows[6].Columns && this.report.Rows[6].Columns[1]) {
      this.report.Name = this.report.Rows[4].Columns[0].Answer;
      this.report.Description = this.report.Rows[6].Columns[1].Answer;
    }

    if (this.report.TestReportProId) {
      this.reportProService.update(this.report).subscribe(data => {
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Saved Successfuly', detail: `Report chages saved` });

        if (data && data.TestReportProId) {
          this.report = data;
          this.report.Rows.forEach(x => {
            if (x.Classes) {
              x.Classes = JSON.parse(x.Classes);
            }
            if (x.Columns) {
              x.Columns.forEach(c => {
                if (c.Classes) {
                  c.Classes = JSON.parse(c.Classes);
                }
                if (c.Options) {
                  c.Options = JSON.parse(c.Options);
                }
              })
            }
          })
        }

      })
    } else {
      this.reportProService.add(this.report).subscribe(data => {
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Saved Successfuly', detail: `Report created Successfuly` });

        if (data && data.TestReportProId) {

          let __reports = localStorage.getItem("__reports")
          if (__reports) {
            let cNo = Number(__reports) + 1;
            localStorage.setItem("__reports", cNo + '');
          }
          data.Rows.forEach((row, rowIndex) => {
            row.OrderingNo = rowIndex + 1;
            if (row.Classes) {
              row.Classes = JSON.parse(row.Classes);
            }

            if (row.Columns) {
              row.Columns.forEach((col, colIndex) => {
                col.OrderingNo = colIndex + 1;
                col.OrderingNo = colIndex + 1;
                col.RequireSecondary = `${col.RequireSecondary}` === "true";
                if (col.Classes) {
                  col.Classes = JSON.parse(col.Classes);
                }
                if (col.Options) {
                  col.Options = JSON.parse(col.Options);
                }
              })
            }
          });
          this.report = data;
        }

      })
    }
  }
  sendForAproval() {
    console.log(this.report);
    if (this.vailidateValues()) {
      this.report.StatusName = 'Sent for review'
      this.saveNewReport();
    } else {
      this.messageService.add({ severity: 'error', summary: 'Form is complete', detail: `Please fill the form completly before ypu can publish the report.` });
    }

  }
  vailidateValues(): boolean {
    let isValid = true;
    this.report.Rows.forEach(row => {
      if (row.Columns && row.Columns.length)
        row.Columns.forEach(col => {
          let i = col.Classes.indexOf("error-answer");
          if (i >= 0)
            col.Classes.splice(i, 1);
          if (['Select', 'Text', 'Date'].find(x => x === col.Type) && !col.Answer) {
            isValid = false;
            col.Classes.push('error-answer')
          }
        })
    })
    return isValid;
  }
  print() {
    const url = this.reportProService.getInvoiceURL(this.report.TestReportProId);
    console.log('url', url);

    const win = window.open(url, '_blank');
    win.focus();
  }
  printSigned() {
    const url = this.report.SignedReport;
    console.log('url', url);

    const win = window.open(url, '_blank');
    win.focus();
  }


  dataChanged(column: ColumnModel, row: RowModel) {
    // debugger
    this.inpectionDateId = 'InspDate';
    this.nextInpectionDateId = 'NextInspDate';
    if (column.MoreInfo1 === this.inpectionDateId && row) {
      const date = this.getFutureDate(column.Answer);
      this.dateInThreeYears = this.getFutureDate(column.Answer, 3);
      const nextInpectionDate = row.Columns.find(x => x.MoreInfo1 === this.nextInpectionDateId);
      if (nextInpectionDate) {
        nextInpectionDate.Answer = date;
      }
      console.log(date);
    }
  }

  selectChanged(column: ColumnModel, row: RowModel) {
    if (!column || !row)
      return;

    const id = "PlateVerification";
    if (column.MoreInfo1 === id && column.Options && column.Options.length) {
      const index = column.Options.indexOf(column.Answer);
      this.makeRequired(index);
    }
  }

  useNext3Years(row: RowModel) {
    if (!row)
      return;
    const nextInpectionDate = row.Columns.find(x => x.MoreInfo1 === this.nextInpectionDateId);
    if (nextInpectionDate && this.dateInThreeYears) {
      nextInpectionDate.Answer = this.dateInThreeYears;
      this.dateInThreeYears = '';
    }
  }

  makeRequired(index: number) {
    if (index <= -1) {
      return;
    }
    this.resetColClasses();
    let required = [];
    if (index === 0) {
      required = ["YEAR", "SERIAL", "DP"];
    }
    if (index === 1) {
      required = [
        'MANUFACTURER',
        'COUNTRY ',
        'YEAR',
        'CAPACITY',
        'SERIAL',
        'AIA',
        'STANDARD',
        'TEMPERATURE',
        'DP',
        'MaxWORKING'
      ];
    }
    if (index === 2) {
      required = [
        'MANUFACTURER',
        'COUNTRY ',
        'YEAR',
        'CAPACITY',
        'SERIAL',
        'AIA',
        'STANDARD',
        'MINT',
        'MAXT',
        'CATEGORY',
        'DP'
      ];
    }
    if (required.length) {
      required.forEach(element => {
        const col = this.getColByName(element);
        if (col) {
          col.Required = true;
          col.Classes = ['required']
        }
      });
    }
  }

  getColByName(id: string): ColumnModel {
    let cols = [];
    this.report.Rows.forEach(r => {
      if (r.Columns) {
        r.Columns.forEach(c => {
          cols.push(c)
        })
      }
    })
    return cols.find(x => x.MoreInfo1 === id);
  }

  resetColClasses() {
    this.report.Rows.forEach(r => {
      if (r.Columns) {
        r.Columns.forEach(c => {
          const cc = c.Classes.indexOf('required');
          if (cc >= 0) {
            c.Classes.splice(cc, 1);
          }
        })
      }
    })
  }
  getFutureDate(date: string, years = 2) {

    var d = new Date(date);
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    let newDate = new Date(year + years, month, day);
    // return `${newDate.getFullYear()}-${newDate.getMonth() > 9 ? '' : '0'}${newDate.getMonth() + 1}-${newDate.getDate() > 9 ? '' : '0'}${newDate.getDate()}`;
    return `${newDate.getDate()} ${this.months[newDate.getMonth()]} ${newDate.getFullYear()}`;
  }

  onImageChangedEvent(url: string, column: ColumnModel) {
    if (url) {
      column.Answer = url;
    }
    else {
      column.Answer = ''
    }
  }
  textChanged(row: RowModel, column: ColumnModel) {
    if (column.MoreInfo1 === "DP") {
      const testPressure = this.getColByName("TEST_PREASURE");
      if (testPressure)
        testPressure.Answer = Number(column.Answer) * 1.25;
    }
  }
  dateEvent(event: string, column: ColumnModel, row: RowModel) {
    column.Answer = event;
    this.dataChanged(column, row)
  }


  public uploadFile = (files: FileList) => {
    if (files.length === 0) {
      return;
    }
    this.loading = true;
    Array.from(files).forEach(file => {
      this.uploadOriginal(file)
    });
  }

  uploadOriginal(file) {
    const formData = new FormData();
    formData.append('file', file);
    this.loading = true;
    formData.append('name', `tybo.${file.name.split('.')[file.name.split('.').length - 1]}`); // file extention
    this.uploadService.uploadFile(formData).subscribe(response => {
      this.loading = false;
      if (response && response.length > 15) {
        this.report.SignedReport = `${environment.API_URL}/api/upload/${response}`;
        this.report.StatusName = 'Signed';
        this.saveNewReport();
      }
    });

  }

  selectCustomer(item: Customer) {
    this.loading = true;
    this.customerService.getCustomerSync(item.CustomerId).subscribe(data => {
      this.loading = false;
      if (data && data.CustomerId && this.selectedColumn) {
        this.selectedColumn.Answer = data.Name;
        this.report.CustomerId = data.CustomerId;
        this.report.CustomerName = data.Name;
        this.chooseCustomer = false;
      }
    });
  }

  addNewCustomer() {
    this.customer = {
      CustomerId: '',
      CompanyId: this.user.CompanyId,
      CustomerType: 'Customer',
      Name: '',
      Surname: '',
      Email: '',
      PhoneNumber: '',
      Password: 'notset',
      Dp: '',
      AddressLineHome: '',
      AddressUrlHome: '',
      AddressLineWork: '',
      AddressUrlWork: '',
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: '1',
      UserToken: ''
    };
    this.heading = 'Add new customer';
    this.editing = true;
    this.chooseCustomer = false;
  }

  saveCustomer() {
    if (this.customer.CustomerId && this.customer.CustomerId.length > 5) {
      this.customerService.updateCustomerSync(this.customer).subscribe(data => {
        if (data && data.CustomerId) {
          this.editing = false;
          this.selectedColumn.Answer = data.Name;
          this.report.CustomerId = data.CustomerId;
          this.report.CustomerName = data.Name;
        }
      })
    }
    else {
      this.customerService.add(this.customer).subscribe(data => {
        if (data && data.CustomerId) {
          this.customers.push(data)
          this.editing = false;
          this.selectedColumn.Answer = data.Name;
          this.report.CustomerId = data.CustomerId;
          this.report.CustomerName = data.Name;
        }
      });
    }
  }

  editCustomer(col) {
    if (this.report && this.report.CustomerId) {
      this.customerService.getCustomerSync(this.report.CustomerId).subscribe(data => {
        this.loading = false;
        if (data && data.CustomerId && this.selectedColumn) {
          this.customer = data;
          this.editing = true;
          this.selectedColumn = col;
        }
      });
    }
  }

  onUploadFinished(image: Images) {
    this.selectedColumn.Answer = image.Url;
    this.signReport = false;
    this.user.AddressLineWork = image.Url;
    const techName = this.getColByName("TECH_NAME");
    if (techName)
      techName.Answer = this.user.Name;
    this.userService.updateUserSync(this.user).subscribe(data => {
      if (data && data.UserId) {
        this.user.AddressLineWork = data.AddressLineWork;
        this.accountService.updateUserState(this.user);
      }
    });
  }
}
