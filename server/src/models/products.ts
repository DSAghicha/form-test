import mongoose from 'mongoose'
import IProducts from '../interfaces/products'

const productSchema = new mongoose.Schema({
	orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Org' },
	productName: String,
	productionDescription: String,
	amount: Number,
	quantityAvailable: Number
})
const Product = mongoose.model<IProducts>('Product', productSchema)
export default Product
