import { MachineParts } from "./machineparts.model";

export interface Machine {
  MachineId: string;
  CompanyId: string;
  MachineType: string;
  Name: string;
  Make: string;
  Model: string;
  Size: string;
  Serial: string;
  Hours: string;
  Motor: string;
  Moreinfo1: string;  //dp
  Moreinfo2: string;
  Moreinfo3: string;
  Moreinfo4: string;
  MachineStatus: string;
  CreateUserId: string;
  ModifyUserId: string;
  StatusId: number;
  Parts?: MachineParts[];
  VeiwMore?: boolean;
}

