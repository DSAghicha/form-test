export const convertFileToBase64 = (file: Blob): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => resolve((reader.result as any).split(',')[1])
		reader.onerror = (error) => reject(error)
		reader.readAsDataURL(file)
	})
}
