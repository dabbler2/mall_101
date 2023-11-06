const mongoose = require('mongoose')

const prodSchema = new mongoose.Schema({
    prodID: {
        type: Number,
        required: true,
        unique: true
    },
    prodName: {
        type: String,
        required: true
    },
    writerID: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    availability: {
        type: Boolean,
        required: true
    },
    comment: {
        type: String
    },
    writtenTime: {
        type: String,
        required: true
    },
    lastEditTime: {
        type: String,
        required: true
    }
})

// 상품 ID 배정용 카운터
const idCountSchema = new mongoose.Schema({
    idCount: {
        type: Number,
        required: true
    }
})

module.exports = [
    mongoose.model('Product', prodSchema),
    mongoose.model('IDCount', idCountSchema)
]
