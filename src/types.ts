export interface Item {
  ItemId: number;
  Name: string;
  Price: number;
  Quantity: number;
  Sum: number;
  ProductType: string;
}

export interface Receipt {
  Id: number;
  User: number;
  OrganizationId: number;
  Organization: string;
  LegalForm: string;
  InvoiceId: number;
  InvoiceType: number;
  InvoiceSum: number;
  PaymentType: 'CARD' | 'CASH';
  CheckSum: number;
  CreatedAt: string;
  Items: Item[];
}