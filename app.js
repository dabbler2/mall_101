const express = require('express')
const app = express()
const prodRouter = require('./routes/products.router')
const connect = require('./schemas')
require('dotenv').config()

connect()
app.use(express.json())

app.use('/', [prodRouter])
app.get('/', (req, res) => {
    res.send('Welcome to mall_101')
})

app.listen(process.env.PORT, () => {
    console.log('서버 접속 성공.')
})