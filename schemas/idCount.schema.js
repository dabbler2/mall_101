const mongoose = require('mongoose')

const idCountSchema = new mongoose.Schema({
	idCount: {
		type: Number,
		required: true
	}
})

module.exports = mongoose.model('IDCount', idCountSchema)