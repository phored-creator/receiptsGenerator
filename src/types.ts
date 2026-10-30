import type { UUID } from "node:crypto";
export interface Item {
	ItemId: bigint;
	Name: string;
	Price: number;
	Quantity: number;
	Sum: number;
	ProductType: string;
}

export interface Receipt {
	Id: UUID;
	User: UUID;
	OrganizationId: UUID;
	Organization: string;
	LegalForm: string;
	InvoiceId: UUID;
	InvoiceType: number;
	InvoiceSum: number;
	PaymentType: "CARD" | "CASH";
	CheckSum: number;
	CreatedAt: string;
	Items: Item[];
}
