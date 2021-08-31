let mongoose = require('mongoose')1
let Schema = mongoose.Schema

//student schema definition
let StudentSchema = new Schema(
	{
		// id: { type: Number, required: true, index: true, unique: true },
		_id: { type: Number, required: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		class: { type: String, required: true },
		nationality: { type: String, required: true },
		// createdAt: { type: Date, default: Date.now },
	},
	{
		versionKey: false,
	}
)

// Sets the createdAt parameter equal to the current time
// StudentSchema.pre('save', (next) => {
// 	now = new Date()
// 	if (!this.createdAt) {
// 		this.createdAt = now
// 	}
// 	next()
// })

//Exports the StudentSchema for use elsewhere.
module.exports = mongoose.model('student', StudentSchema)
