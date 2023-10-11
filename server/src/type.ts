import { Request } from 'express'

export interface IRequest extends Request {
	body: IBody[]
}

export interface IBody {
	ownerName: string
	organizationName: string
	orgRefId: string
	gstNumber: string
	strength: number
	orgDate: Date
	products: {
		srNo: string
		productName: string
		productionDescription: string
		amount: number
		quantityAvailable: number
		productImage: string
	}[]
}

export interface InvoiceData {
	logoPath: string
	organizationName: string
	ownerName: string
	orgRefId: string
	strength: number
	lastBillDate: string
	orgDate: string
	gstNumber: string
	productCount: number
	lastBillAmount: string
	billingStartDate: string
	billingEndDate: string
	products: Product[]
	lastDate: string
	totalBillAmount: number
	interestPerDay: number
}

interface Product {
	name: string
	description: string
	amount: number
	quantity: number
	total: number
}
