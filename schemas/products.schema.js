const mongoose = require('mongoose')

const prodSchema = new mongoose.Schema({
    prodName: {
        type: String,
        required: true,
        unique: true,
    },
    writerID: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    availability: {
        type: Boolean,
        required: true,
    },
    comment: {
        type: String,
    },
    writtenTime: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Product', prodSchema)
