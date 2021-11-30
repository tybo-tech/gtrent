
export interface Questiontest {
  QuestioTestId: string;
  QuestionId: string;
  TestingReportId: string;
  Question: string;
  CertificateQuestion: string;
  Position: number;
  Answer: string;
  Remarks: string;
  Status: string;
  CreateDate?: string;
  ModifyDate?: string;
  CreateUserId: string;
  ModifyUserId: string;
  StatusId: number;
  Options?: any[]
}