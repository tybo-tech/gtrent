import { Product } from "./product.model";

export interface HomeNavUx {
  LogoUrl: string;
  Name: string;
}


export interface LoaderUx {
  Loading: boolean;
  Message?: string;
}
export interface PopUx {
  Class: string;
  Message?: string;
}
export interface NavHistoryUX {
  BackTo: string;
  BackToAfterLogin: string;
  ScrollToProduct: Product;
  ScrollToYPositoin?: number;
}

export interface BreadModel {
  Name: string;
  Link: string;
  Class?: string[];
}

export interface SliderWidgetModel {
  Id?: string;
  Name?: string;
  Description?: string;
  Description2?: string;
  Link?: string;
  Icon?: string;
  Selected?: boolean;
  Qty?: number;
  RegularPrice?: number;
  CanDelete?: boolean;

}

export interface AdminStatModel {
  DraftOrders?: string;
  Customers?: string;
  Products?: string;
  Users?: string;
  ActiveOrders?: string;
  HistoryOrders?: string;
  Questions?: string;
  Testingreports?: string;
}

export interface TabsUxModel {
  Id: number;
  Name: string;
  Url: string;
  Class: string[];
}