const express = require('express')
const app = express()
const prodRouter = require('./routes/products.router')
const connect = require('./schemas')
require('dotenv').config()

connect()
app.use(express.json())

app.use('/', [prodRouter])
app.get('/', (req, res) => {
    res.send('Hi')
})

app.listen(process.env.PORT || 3000, () => {
    console.log('서버 접속 성공.')
})