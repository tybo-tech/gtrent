import { MONTHS } from "src/shared/constants";
import { ColumnModel } from "../views/dashboard/testingreport/_v2/models/ColumnModel";
import { RowModel } from "../views/dashboard/testingreport/_v2/models/RowModel";
import { TestReportPro } from "../views/dashboard/testingreport/_v2/models/TestReportPro";

export class HelperClass {
    public static GetRowInsert(row: RowModel) {
        const id = this.GetId('row');
        let query = `
        INSERT INTO testteport_rows(
            RowId,
            TestReportId,
            Classes,
            OrderingNo,
            CreateUserId,
            ModifyUserId,
            StatusId
        )
        VALUES(
        '${id}',
        '${row.TestReportId}',
        '${JSON.stringify(row.Classes)}',
        '${row.OrderingNo + 1}',
        '${row.CreateUserId}',
        '${row.ModifyUserId}',
        '${row.StatusId}'
        );
        `;
        if (row.Columns) {
            row.Columns.forEach(col => {
                query += this.GetColInsert(col, id);
            })
        }

        return query;
    }


    public static GetColInsert(col: ColumnModel, rowId: string) {
        const id = this.GetId('col');
        const query = `
        INSERT INTO testteport_columns(
            ColumnId,
            RowId,
            TestReportId,
            Question,
            Answer,
            SecondaryAnswer,
            OtherAnswer,
            Type,
            Classes,
            Options,
            RequireSecondary,
            Units,
            OrderingNo,
            MoreInfo1,
            MoreInfo2,
            MoreInfo3,
            MoreInfo4,
            CreateUserId,
            ModifyUserId,
            StatusId
        )
        VALUES(
        '${id}',
        '${rowId}',
        '${col.TestReportId}',
        '${col.Question}',
        '${col.Answer}',
        '${col.SecondaryAnswer}',
        '${col.OtherAnswer}',
        '${col.Type}',
        '${JSON.stringify(col.Classes)}',
        '${JSON.stringify(col.Options)}',
        '${col.RequireSecondary}',
        '${col.Units}',
        '${col.OrderingNo}',
        '${col.MoreInfo1}',
        '${col.MoreInfo2}',
        '${col.MoreInfo3}',
        '${col.MoreInfo4}',
        '${col.CreateUserId}',
        '${col.ModifyUserId}',
        '${col.StatusId}'
        );
        `;

        return query;
    }

    public static GetId(prefix: string = 'id') {
        if (prefix && prefix.length)
            prefix += '-';
        return `${prefix}${Math.floor(Math.random() * 1000000000)}-${(new Date()).getTime()}`;
    }

    public static GetDeleteReportQuery(testReportId: string) {
        return `
        DELETE FROM testteportpro WHERE  TestReportProId = '${testReportId}';
        DELETE FROM testteport_rows WHERE  TestReportId = '${testReportId}';
        DELETE FROM testteport_columns WHERE  TestReportId = '${testReportId}';
        `;
    }

    public static GetTodayDate() {
        const date = new Date();
        return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
    }
}