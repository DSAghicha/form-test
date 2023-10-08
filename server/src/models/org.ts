import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'
import IOrg from '../interfaces/org'

const orgSchema = new mongoose.Schema({
	ownerName: String,
	organizationName: String,
	orgRefId: {
		type: String,
		unique: true
	},
	gstNumber: {
		type: String,
		unique: true
	},
	strength: Number,
	orgDate: Date
})

orgSchema.plugin(mongooseUniqueValidator)
const Org = mongoose.model<IOrg>('org', orgSchema)
export default Org
