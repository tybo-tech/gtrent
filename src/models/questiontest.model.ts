export interface Questiontest {
  QuestioTestId: string;
  QuestionId: string;
  ParentId: string;
  TestingReportId: string;
  Question: string;
  CertificateQuestion: string;
  Position: number;
  Answer: string;
  OtherAnswer: string;
  Remarks: string;
  QuestionType: string;
  QuestionNumber: string;
  QuestionOptions: string;
  Status: string;
  CreateDate?: string;
  ModifyDate?: string;
  CreateUserId: string;
  ModifyUserId: string;
  StatusId: number;
  Options?: any[]
  Children?: Questiontest[]
}