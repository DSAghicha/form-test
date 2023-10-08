import { Request, Response } from 'express'
import Org from './models/org'

export const handleFormDataSubmit = async (req: Request, res: Response) => {
	const data = await Org.find({})
	console.log(data)
	res.status(200).send('Ok')
	// return
}
