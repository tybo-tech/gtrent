
export interface Question {
  QuestionId: string;
  ParentId: string;
  Question: string;
  CertificateQuestion: string;
  QuestionType: string;
  QuestionNumber: string;
  QuestionOptions: string;
  CreateDate?: string;
  ModifyDate?: string;
  CreateUserId: string;
  ModifyUserId: string;
  StatusId: number;
  Children?: Question[]
  Section?: string;
}