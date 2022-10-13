import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HelperClass } from 'src/app/classes/HelperClass';
import { User } from 'src/models';
import { AccountService } from 'src/services';
import { ReportProService } from 'src/services/report.service.pro';
import { REPORT } from '../data/reports';
import { ColumnModel } from '../models/ColumnModel';
import { RowModel } from '../models/RowModel';
import { TestReportPro } from '../models/TestReportPro';

@Component({
  selector: 'app-test-report-template',
  templateUrl: './test-report-template.component.html',
  styleUrls: ['./test-report-template.component.scss']
})
export class TestReportTemplateComponent implements OnInit {

  report: TestReportPro;
  readOnly = false;
  loading = false;
  addingAction = false;
  testReportProId: any;
  column: ColumnModel;
  columnsToDelete: ColumnModel[];
  optionName: string;
  rowIndex: number;
  colIndex: number;
  row: RowModel;
  queryStrings: string[] = [];
  user: User;
  constructor(private accountService: AccountService, private messageService: MessageService, private router: Router,
    private reportProService: ReportProService, private activatedRoute: ActivatedRoute,
  ) {

    this.activatedRoute.params.subscribe(r => {
      this.testReportProId = r.id;
      if (this.testReportProId) {
        this.loadReport();
      } else {
        this.report = REPORT;
      }
    });
  }

  ngOnInit(): void {
    this.user = this.accountService.currentUserValue;
  }

  saveNewReport() {
    if (!this.report || !this.report.Rows || !this.report.Rows.length)
      return;
    // debugger
    this.saveCols();
    return;
    this.loading = true;
    if (this.report.Rows[6] && this.report.Rows[6].Columns && this.report.Rows[6].Columns[1]) {
      this.report.Name = this.report.Rows[4].Columns[0].Answer;
      this.report.Description = this.report.Rows[6].Columns[1].Answer;
    }

    if (this.report.TestReportProId) {
      if (this.columnsToDelete && this.columnsToDelete.length) {
        let deleteQuery = 'DELETE FROM testteport_columns WHERE ColumnId in (';
        this.columnsToDelete.forEach((col, i) => {
          deleteQuery += `'${col.ColumnId}'`
          if (i < this.columnsToDelete.length - 1) {
            deleteQuery += ',';
          } else {
            deleteQuery += ')';
          }
        });
        this.report.ColumnsToDelete = deleteQuery;
        // alert(deleteQuesry);
        // return;
      }


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
    }
  }

  back() {
    this.router.navigate(['admin/dashboard/testing-reports']);
  }
  options(row: RowModel, column: ColumnModel, rowIndex: number, colIndex: number) {
    this.column = column;
    this.rowIndex = rowIndex;
    this.colIndex = colIndex;
    this.row = row;
    console.log(column);
    console.log(row);
    
    if (row.Classes.length)
      this.row.SelectedClass = row.Classes[0]
  }

  addOption() {
    if (this.column && this.optionName) {
      this.column.Options?.push(this.optionName.trim());
    }
  }
  deleteOption(index: number) {
    if (this.column) {
      this.column.Options?.splice(index, 1);
    }
    this.addingAction = false;
  }

  moveRowUp() {
    const index = this.rowIndex;
    if (this.report && this.report.Rows) {
      this.row.OrderingNo--;
      console.log(this.row, this.row.OrderingNo);

      this.report.Rows.sort((a, b) => a.OrderingNo - b.OrderingNo)
    }
    // if (this.report && this.report.Rows && this.report.Rows.length && index > 0) {
    //   const temp = this.report.Rows[index - 1];
    //   this.report.Rows[index - 1] = this.report.Rows[index];
    //   this.report.Rows[index] = temp;
    //   this.rowIndex = index - 1;
    // }
  }

  orderChanged(){
    this.report.Rows.sort((a, b) => a.OrderingNo - b.OrderingNo)
  }
  moveRowDown() {
    const index = this.rowIndex;
    if (this.report && this.report.Rows) {
      this.row.OrderingNo++;
      console.log(this.row, this.row.OrderingNo);

      this.report.Rows.sort((a, b) => a.OrderingNo - b.OrderingNo)
    }
    // if (this.report && this.report.Rows && this.report.Rows.length && index < this.report.Rows.length - 2) {
    //   const temp = this.report.Rows[index + 1];
    //   this.report.Rows[index + 1] = this.report.Rows[index];
    //   this.report.Rows[index] = temp;
    //   this.rowId = index + 1;
    // }
  }

  deleteCol() {
    if (this.colIndex > -1 && this.row && this.column) {
      if (!this.columnsToDelete || !this.columnsToDelete.length) {
        this.columnsToDelete = [];
      }
      this.columnsToDelete.push(this.column)
      this.row.Columns.splice(this.colIndex, 1);
    }
  }
  addCol() {
    if (this.colIndex > -1 && this.row) {
      const newCol = new ColumnModel('', '', 'Text', []);
      newCol.OrderingNo = this.row.Columns.length + 1;
      this.row.Columns.push(newCol);
    }
  }

  getUpdateQueary(table: string, data: ColumnModel): string {
    let query = ``;
    query += `update ${table} set  `
    delete data.ShowOptions;
    for (const [key, value] of Object.entries(data)) {
      if (key === 'Classes' || key === 'Options') {
        // debugger
        console.log(data, value);

        // console.log(value);

        query += `${key} = '${JSON.stringify(value)}'`
      } else {
        query += `${key} = '${value}'`
      }
      if (key != 'StatusId')
        query += ','
    }
    query += `where ColumnId = '${data.ColumnId}';`;


    return query;
  }


  UpdateRowQuery(data: RowModel): string {
    let query = ``;
    query += `update testteport_rows set  `
    delete data.SelectedClass;
    delete data.Columns;
    for (const [key, value] of Object.entries(data)) {
      if (key === 'Classes' || key === 'Options') {
        // debugger
        console.log(data, value);

        // console.log(value);

        query += `${key} = '${JSON.stringify(value)}'`
      } else {
        query += `${key} = '${value}'`
      }
      if (key != 'StatusId')
        query += ','
    }
    query += `where RowId = '${data.RowId}';`;
    // debugger

    return query;
  }

  getInsertQueary(data: ColumnModel, index): string {
    let query = `INSERT INTO  testteport_columns(ColumnId,RowId,TestReportId,Question,Answer,SecondaryAnswer,OtherAnswer,Type,Classes,Options,RequireSecondary,Units,OrderingNo,MoreInfo1,MoreInfo2,MoreInfo3,MoreInfo4,CreateUserId,ModifyUserId,StatusId) 
VALUES ('${index + new Date().getTime()}','${data.RowId}','${this.report.TestReportProId}','${data.Question}','${data.Answer}','${data.SecondaryAnswer}','${data.OtherAnswer}','${data.Type}','${JSON.stringify(data.Classes)}','${JSON.stringify(data.Options)}','${data.RequireSecondary}','${data.Units}','${data.OrderingNo}','${data.MoreInfo1}','${data.MoreInfo2}','${data.MoreInfo3}','${data.MoreInfo4}','${this.user.UserId}','${this.user.UserId}','1'  
 );`;


    return query;
  }

  saveCols() {
    // debugger
    const rows = [];
    const cols = [];
    this.report.Rows.forEach(row => {
      rows.push(row);
      if (row && row.Columns)
        row.Columns.forEach(col => {
          col.RowId = row.RowId;
          cols.push(col);
        })
    });

    const columnsToUpdate = cols.filter(x => x.ColumnId && x.ColumnId.length > 0);
    const columnsToCreate = cols.filter(x => !x.ColumnId);

    console.log(columnsToUpdate);
    this.queryStrings = [];
    if (columnsToCreate) {
      columnsToCreate.forEach((item, index) => {
        this.queryStrings.push(this.getInsertQueary(item, index));
      })
    }
    if (columnsToUpdate.length) {
      columnsToUpdate.forEach((item, index) => {
        this.queryStrings.push(this.getUpdateQueary('testteport_columns', item));
      })
    }
    if (this.report && this.report.Rows) {
      const temp = this.report.Rows
      this.report.Rows.forEach((item, index) => {
        this.queryStrings.push(this.UpdateRowQuery(item));
      })
      this.report.Rows = temp;
    }

    if (this.columnsToDelete && this.columnsToDelete.length) {
      let deleteQuery = 'DELETE FROM testteport_columns WHERE ColumnId in (';
      this.columnsToDelete.forEach((col, i) => {
        deleteQuery += `'${col.ColumnId}'`
        if (i < this.columnsToDelete.length - 1) {
          deleteQuery += ',';
        } else {
          deleteQuery += ')';
        }
      });
      this.queryStrings.push(deleteQuery);
      // alert(deleteQuesry);
      // return;
    }
    console.log(this.queryStrings);

    if (this.queryStrings.length) {
      this.loading = true;
      this.reportProService.query({ QueryStrings: this.queryStrings, TestReportProId: this.report.TestReportProId }).subscribe(data => {
        console.log(data);
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Saved Successfuly', detail: `Tempate chages saved` });
        this.proccessData(data);
      })

    }

  }

  classSelcted() {
    if (this.row) {
      if (!this.row.Classes || !this.row.Classes.length)
        this.row.Classes = [];

      let selected = this.row.Classes.find(x => x === 'selected')
      if (!this.row.Classes.find(x => x === this.row.SelectedClass))
        this.row.Classes = [this.row.SelectedClass];
      if (selected)
        this.row.Classes.push(selected);

    }

    console.log(this.row);

  }

  duplicate() {
    if (!this.row)
      return

    const rowInsert = HelperClass.GetRowInsert(this.row);

    this.loading = true;
    this.reportProService.queryV2({ Query: rowInsert, Id: this.report.TestReportProId }).subscribe(data => {
      console.log(data);
      this.loading = false;
      this.messageService.add({ severity: 'success', summary: 'Saved Successfuly', detail: `Tempate chages saved` });

      this.proccessData(data);
    })
  }
  loadReport() {
    this.loading = true;
    this.reportProService.get(this.testReportProId).subscribe(data => {
      this.loading = false;

      this.proccessData(data)

    });
  }

  proccessData(data: any) {
    if (data) {

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

      data.Rows.sort((a, b) => a.OrderingNo - b.OrderingNo)
      this.report = data;
    }
  }
}


