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
