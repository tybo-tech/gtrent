import { Product } from "../../../tybo-invoice/src/models/product.model";
import { Company } from "./company.model";

export interface MachineParts {
  MachinePartId: string;
  MachineId: string;
  ProductId: string;
  CustomerId: string;
  MachineName: string;
  ProductName: string;
  CustomerName: string;
  ProductType: string;
  CreateUserId: string;
  ModifyUserId: string;
  StatusId: number;
  Selected?: boolean
  Qty?: number
  RegularPrice?: number
}

