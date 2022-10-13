import { Customer } from "./customer.model";
import { Images } from "./images.model";
import { Machine } from "./machine.model";
import { Questiontest } from "./questiontest.model";

export interface Testingreport {
  Id: number;
  TestingReportId: string;
  CustomerId: string;
  CustomerName: string;
  MachineId: string;
  MachineName: string;
  CertNo: string;
  Dol: string;
  DateOfTest: string;
  StartTime: string;
  EndTime: string;
  ReasonForTest: string;
  InitialInstallation: string;
  CountryOfOrigin: string;
  StandardOfDesign: string;
  Location: string;
  NamePlate: string;
  IsNamePlateFittedByClient: string;
  Manufacturer: string;
  YearOfManufacture: string;
  SerialNo: string;
  Capacity: string;
  MarkOfApprovedInspectionAuth: string;
  NameNumberDateOfDesign: string;
  MinOperatingTemperature: string;
  MaxOperatingTemperature: string;
  ClassOrCategory: string;
  DesignPressure: string;
  MaximumWorkingPressure: string;
  ParticularsOfOpenings: string;
  TestPressureGauge: string;
  TestPump: string;
  TestTemperatureGauge: string;
  ThicknessTester: string;
  OtherComments: string;
  TestDoneBy: string;
  TestDoneBySig: any;
  AssistedBy: string;
  AssistedBySig: string;
  ReportCompiledBy: string;
  ReportCompiledBySig: string;
  NextInspectionDate: string;
  Certification: string;
  Notes: string;
  VisualInspection: string;
  CreateDate?: string;
  ModifyDate?: string;
  CreateUserId: string;
  ModifyUserId: string;
  Status: string;
  StatusId: number;
  Customer?: Customer;
  Machine?: Machine;
  Questiontests?: Questiontest[];
  Remarks?: Questiontest[];
  Images?: Images[];
  
  // New 
  VesselDescription?: string;
  UserName?: string;


}