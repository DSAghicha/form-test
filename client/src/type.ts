export interface IFormData {
	ownerName: string
	organizationName: string
	orgRefId: string
	gstNumber: string
	strength: number
	orgDate: string
	products: {
		srNo: number
		productName: string
		productionDescription: string
		amount: number
		quantityAvailable: number
		productImage: any
	}[]
}
