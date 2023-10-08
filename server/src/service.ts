import { Response } from 'express'
import Org from './models/org'
import { IBody } from './type'
import IOrg from './interfaces/org'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import IProducts from './interfaces/products'
import Product from './models/products'

export const handleFormDataSubmit = async (data: IBody, res: Response) => {
	try {
		const orgData: IOrg = {
			ownerName: data.ownerName,
			organizationName: data.organizationName,
			orgRefId: data.orgRefId,
			gstNumber: data.gstNumber,
			strength: data.strength,
			orgDate: data.orgDate,
			productCount: data.products.length
		}
		const org = await Org.create(orgData)
		const orgId = org._id.toString()

		const orgFolderPath = join(__dirname, '../orgData/', orgData.orgRefId)
		if (!existsSync(orgFolderPath)) {
			mkdirSync(orgFolderPath)
		}

		for (let index = 0; index < data.products.length; index++) {
			const product = data.products[index]
			const createdProduct = await Product.create({
				orgId,
				productName: product.productName,
				productionDescription: product.productionDescription,
				amount: product.amount,
				quantityAvailable: product.quantityAvailable
			})
			if (product.productImage) {
				const dataWithoutPrefix = product.productImage.replace(/^data:image\/\w+;base64,/, '')
				const match = product.productImage.match(/^data:image\/([a-z]+);base64,/i)
				const buffer = Buffer.from(dataWithoutPrefix, 'base64')
				const fileExtension = match ? match[1] : 'png'
				writeFileSync(`${orgFolderPath}/${createdProduct._id.toString()}.${fileExtension}`, buffer)
			}
		}
		res.send('Done').status(200)
	} catch (err: any) {
		console.log(err)
		res.send(err.message).status(500)
	}
}
