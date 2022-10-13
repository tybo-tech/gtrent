export class ColumnModel {
    Question: string;
    Answer: any;
    SecondaryAnswer: any;
    OtherAnswer: any;
    Type: string;
    Classes: any;
    Options: any;
    RequireSecondary: boolean;
    Units: string;
    MoreInfo1: string;  // Column Name to associate with logic
    MoreInfo2: string;  // List of required fileds for an option
    MoreInfo3: string;
    MoreInfo4: string;
    ShowOptions?: boolean;
    ColumnId: string;
    OrderingNo: number;
    RowId: any;
    Required?: boolean;
    TestReportId: any;
    CreateUserId: any;
    ModifyUserId: any;
    StatusId: any;
    constructor(
        Question: string,
        Answer: any,
        Type: string,
        Classes: string[],
        Options: string[] = [],
        OtherAnswer: string = '',
        SecondaryAnswer: string = '',
        RequireSecondary = false,
        Units: string = '',
        MoreInfo1: string = '',
        MoreInfo2: string = '',
        MoreInfo3: string = '',
        MoreInfo4: string = '',
    ) {
        this.Question = Question;
        this.Answer = Answer;
        this.Type = Type;
        this.Classes = Classes;
        this.Options = Options;
        this.OtherAnswer = OtherAnswer;
        this.SecondaryAnswer = SecondaryAnswer;
        this.RequireSecondary = RequireSecondary;
        this.Units = Units;
        this.MoreInfo1 = MoreInfo1;
        this.MoreInfo2 = MoreInfo2;
        this.MoreInfo3 = MoreInfo3;
        this.MoreInfo4 = MoreInfo4;
    }

    AddClass(aclass: string) {
        this.Classes.push(aclass)
    }
}