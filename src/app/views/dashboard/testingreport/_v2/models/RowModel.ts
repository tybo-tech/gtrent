import { ColumnModel } from "./ColumnModel";

export class RowModel {

    Columns: ColumnModel[];
    Classes: any;
    SelectedClass: string;
    OrderingNo: number;
    RowId: any;
    TestReportId: any;
    DisplayMode: any;
    CreateUserId: any;
    ModifyUserId: any;
    StatusId: any;

    constructor(
        Columns: ColumnModel[],
        Classes: string[]

    ) {
        this.Columns = Columns;
        this.Classes = Classes;
    }

    AddColumn(col: ColumnModel) {
        this.Columns.push(col);
    }

    AddClass(aclass: string) {
        this.Classes.push(aclass)
    }
}