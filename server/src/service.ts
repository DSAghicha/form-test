import { Response } from 'express'
import Org from './models/org'
import { IBody, InvoiceData } from './type'
import IOrg from './interfaces/org'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'
import Product from './models/products'
import * as pdf from 'html-pdf'
import { PDFDocument, StandardFonts, degrees, rgb } from 'pdf-lib'
import { render } from 'ejs'

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
		res.status(200).send('Done')
	} catch (err: any) {
		console.log(err)
		res.status(500).send(err.message)
	}
}

export const generateProductsForm = async (data: { orgRefId: string }, res: Response) => {
	try {
		console.log(data)
		const org = await Org.findOne(data)
		if (!org) {
			res.sendStatus(404)
			return
		}
		const id = org._id
		const products = await Product.find({ orgId: id })

		const htmlData: InvoiceData = {
			logoPath: './logo-circle.png',
			organizationName: org.organizationName,
			ownerName: org.ownerName,
			orgRefId: org.orgRefId,
			strength: org.strength,
			lastBillDate: '10 September, 2023',
			orgDate: org.orgDate.toDateString(),
			gstNumber: org.gstNumber,
			productCount: org.productCount,
			lastBillAmount: '₹ 7000',
			billingStartDate: '01 September, 2023',
			billingEndDate: '30 September, 2023',
			products: [],
			lastDate: '20 October, 2023',
			totalBillAmount: 0,
			interestPerDay: 150
		}

		products.forEach((product) => {
			const total = product.amount * product.quantityAvailable
			htmlData.products.push({
				name: product.productName,
				description: product.productionDescription,
				amount: product.amount,
				quantity: product.quantityAvailable,
				total: total
			})
			htmlData.totalBillAmount += total
		})

		const template = readFileSync(resolve(__dirname, './pdf.ejs'), 'utf-8')
		const renderedHtml = render(template, htmlData)
		const pdfOptions: pdf.CreateOptions = {
			format: 'Letter'
		}

		const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
			pdf.create(renderedHtml, pdfOptions).toBuffer((err, buffer) => {
				if (err) {
					reject(err)
				} else {
					resolve(buffer)
				}
			})
		})

		// Load the PDF buffer into pdf-lib
		const pdfDoc = await PDFDocument.load(pdfBuffer)

		// Create a watermark
		const watermarkText = `${data.orgRefId}`
		const watermarkSize = 50

		const pages = pdfDoc.getPages()
		for (const page of pages) {
			const { width, height } = page.getSize()

			// Calculate the position for centering the watermark
			const x = width / 2 - (watermarkSize * watermarkText.length) / 4
			const y = height / 2

			page.drawText(watermarkText, {
				size: watermarkSize,
				color: rgb(0.5, 0.5, 0.5), // Adjust the color of the watermark
				x,
				y,
				rotate: degrees(45) // Adjust the rotation angle of the watermark
			})
		}

		// Save the watermarked PDF
		const watermarkedPdfBuffer = await pdfDoc.save()
		writeFileSync(resolve(__dirname, './output.pdf'), watermarkedPdfBuffer)
		res.status(200).send('Done')
	} catch (err: any) {
		console.log(err)
		res.status(500).send(err.message)
	}
}
