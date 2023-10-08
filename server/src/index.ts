import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import { handleFormDataSubmit } from './service'
const app = express()
const PORT = 3001

app.use(express.json({ limit: '50mb' }))
app.post('/api/submitForm', async (req: Request, res: Response) => handleFormDataSubmit(req, res))

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
