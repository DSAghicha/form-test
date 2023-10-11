import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import { generateProductsForm, handleFormDataSubmit } from './service'
import cors from 'cors'
const app = express()
const PORT = 3001

app.use(express.json({ limit: '50mb' }))
app.use(cors({ origin: 'http://localhost:3000', methods: 'POST', credentials: true, optionsSuccessStatus: 204 }))
app.post('/api/submitForm', async (req: Request, res: Response) => handleFormDataSubmit(req.body, res))
app.post('/api/getProductsForm', async (req: Request, res: Response) => generateProductsForm(req.body, res))

mongoose
	.connect('mongodb://localhost:27017/form-test')
	.then(() => {
		console.log('Connected successfully!')
	})
	.catch((err: any) => {
		console.error('Connection failed', err)
	})

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})
