import { RowModel } from "./RowModel";

export class TestReportPro {
    TestReportProId: string;
    Name: string;
    Description: string;
    Rows: RowModel[];
    StatusName: string;
    SignedReport: string;
    StatusId: number;
    ColumnsToDelete: string;
    CustomerId: string;
    CustomerName: string;
    constructor(
        Rows: RowModel[]
        , Name = '', Description = ''
    ) {
        this.Rows = Rows;
        this.Name = Name;
        this.Description = Description;
    }

    AddRow(row: RowModel) {
        this.Rows.push(row);
    }
}