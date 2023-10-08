import React, { ChangeEvent, FC, useState } from 'react'
import './App.css'
import { IFormData } from './type'
import { convertFileToBase64 } from './helpers'
import axios from 'axios'

const App: FC = () => {
	const [formData, setFormData] = useState<IFormData>({
		ownerName: '',
		organizationName: '',
		orgRefId: '',
		gstNumber: '',
		strength: 0,
		orgDate: '',
		products: []
	})
	const [editIndex, setEditIndex] = useState(-1)

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData({ ...formData, [name]: value.trim() })
	}

	const handleProductChange = (index: number, field: string, value: string) => {
		const updatedProducts: any = [...formData.products]
		updatedProducts[index][field] = value.trim()
		setFormData({ ...formData, products: updatedProducts })
	}

	const handleImageChange = async (index: number, file: File | null) => {
		if (file && file.type === 'image/png') {
			const base64Image = await convertFileToBase64(file)
			const updatedProducts: any = [...formData.products]
			updatedProducts[index].productImage = `data:image/png;base64,${base64Image}`
			setFormData({ ...formData, products: updatedProducts })
		} else {
			alert('Please upload an image in PNG format.')
		}
	}

	const handleAddProduct = () => {
		if (editIndex !== -1) {
			alert(`Please save ${formData.products[editIndex].productName} before adding new product!`)
			return
		}
		const newProduct = {
			srNo: formData.products.length + 1,
			productName: '',
			productionDescription: '',
			amount: 0,
			quantityAvailable: 0,
			productImage: null
		}
		setFormData({
			...formData,
			products: [...formData.products, newProduct]
		})
		setEditIndex(formData.products.length)
	}

	const handleSave = (index: number) => {
		const productToSave = formData.products[index]
		if (
			productToSave.productName.trim() === '' ||
			productToSave.productionDescription.trim() === '' ||
			productToSave.amount === 0 ||
			productToSave.quantityAvailable === 0 ||
			!productToSave.productImage
		) {
			alert('Please fill in all fields before saving.')
			return
		}
		setEditIndex(-1)
	}
	const handleEdit = (index: number) => {
		setEditIndex(index)
	}

	const handleDelete = (index: number) => {
		const updatedProducts = [...formData.products]
		updatedProducts.splice(index, 1)
		setFormData({ ...formData, products: updatedProducts })
		setEditIndex(-1) // Set no row to input mode after deleting
	}

	const handleSubmit = async (e: any) => {
		e.preventDefault()
		if (
			formData.ownerName.trim() === '' ||
			formData.organizationName.trim() === '' ||
			formData.orgRefId.trim() === '' ||
			formData.gstNumber.trim() === '' ||
			formData.orgDate.trim() === '' ||
			formData.strength === 0 ||
			formData.products.length < 1
		) {
			alert('Invalid Data')
			return
		}
		if (editIndex !== -1) {
			alert(`Please save ${formData.products[editIndex].productName} before adding new product!`)
			return
		}

		try {
			const response = await axios.post('http://localhost:3001/api/submitForm', formData)
			alert(`Form data submitted successfully: ${response.data}`)
			setFormData({
				ownerName: '',
				organizationName: '',
				orgRefId: '',
				gstNumber: '',
				strength: 0,
				orgDate: '',
				products: []
			})
		} catch (err: any) {
			alert('Error submitting form data: ' + err.message)
		}
	}

	return (
		<section id='main'>
			<div className='container'>
				<form onSubmit={handleSubmit}>
					<h2>Form Test</h2>
					<div className='form__cr'>
						<label htmlFor='ownerName'>Owner Name:</label>
						<input
							type='text'
							id='ownerName'
							name='ownerName'
							value={formData.ownerName}
							onChange={handleInputChange}
						/>
					</div>
					<div className='form__cr'>
						<label htmlFor='organizationName'>Organization Name:</label>
						<input
							type='text'
							id='organizationName'
							name='organizationName'
							value={formData.organizationName}
							onChange={handleInputChange}
						/>
					</div>
					<div className='form__cr'>
						<label htmlFor='orgRefId'>Organization ID:</label>
						<input
							className='fw_input'
							type='text'
							id='orgRefId'
							name='orgRefId'
							value={formData.orgRefId}
							onChange={handleInputChange}
						/>
					</div>
					<div className='form__cr'>
						<label htmlFor='gstNumber'>GST Number:</label>
						<input
							type='text'
							id='gstNumber'
							name='gstNumber'
							value={formData.gstNumber}
							onChange={handleInputChange}
						/>
					</div>
					<div className='form__cr'>
						<label htmlFor='strength'>Organization Strength:</label>
						<input
							type='number'
							id='strength'
							name='strength'
							value={formData.strength}
							onChange={handleInputChange}
						/>
					</div>
					<div className='form__cr'>
						<label htmlFor='orgDate'>Organization Established On:</label>
						<input
							type='date'
							id='orgDate'
							name='orgDate'
							value={formData.orgDate}
							onChange={handleInputChange}
						/>
					</div>
					<hr />
					<h2>Product Details</h2>
					<button
						id='addButton'
						type='button'
						onClick={handleAddProduct}
					>
						Add Product
					</button>
					<table>
						<thead>
							<tr>
								<th>Sr No</th>
								<th>Product Name</th>
								<th>Product Description</th>
								<th>Amount</th>
								<th>Quantity</th>
								<th>Image</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{formData.products.length > 0 ? (
								formData.products.map((product, index) => (
									<tr key={index}>
										<td>{product.srNo}</td>
										<td>
											{editIndex === index ? (
												<input
													type='text'
													value={product.productName}
													onChange={(e) => handleProductChange(index, 'productName', e.target.value)}
												/>
											) : (
												product.productName
											)}
										</td>
										<td>
											{editIndex === index ? (
												<input
													type='text'
													value={product.productionDescription}
													onChange={(e) => handleProductChange(index, 'productionDescription', e.target.value)}
												/>
											) : (
												product.productionDescription
											)}
										</td>
										<td>
											{editIndex === index ? (
												<input
													type='number'
													value={product.amount}
													onChange={(e) => handleProductChange(index, 'amount', e.target.value)}
												/>
											) : (
												product.amount
											)}
										</td>
										<td>
											{editIndex === index ? (
												<input
													type='number'
													value={product.quantityAvailable}
													onChange={(e) => handleProductChange(index, 'quantityAvailable', e.target.value)}
												/>
											) : (
												product.quantityAvailable
											)}
										</td>
										<td>
											{editIndex === index ? (
												<input
													type='file'
													onChange={(e: any) => handleImageChange(index, e.target.files[0])}
													accept='image/png'
												/>
											) : product.productImage ? (
												<img
													src={`data:image/png;base64,${product.productImage}`}
													width='50px'
													alt='Broken'
												/>
											) : (
												'No Image'
											)}
										</td>
										<td>
											{editIndex === index ? (
												<button
													type='button'
													onClick={() => handleSave(index)}
												>
													Save
												</button>
											) : (
												<>
													<button
														type='button'
														onClick={() => handleEdit(index)}
													>
														Edit
													</button>
													<button
														type='button'
														onClick={() => handleDelete(index)}
													>
														Delete
													</button>
												</>
											)}
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={100}>No Products Added</td>
								</tr>
							)}
						</tbody>
					</table>
					<input
						type='submit'
						value='Submit'
					/>
				</form>
			</div>
		</section>
	)
}

export default App
