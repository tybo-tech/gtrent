
export interface Question {
  QuestionId: string;
  Question: string;
  CertificateQuestion: string;
  Position: number;
  Option1: string;
  Option2: string;
  Option3: string;
  Option4: string;
  CreateDate?: string;
  ModifyDate?: string;
  CreateUserId: string;
  ModifyUserId: string;
  StatusId: number;
}