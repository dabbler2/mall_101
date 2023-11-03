const express = require('express')
const app = express()
const port = 8888
const prodRouter = require("./routes/products.router")
const connect = require("./schemas")

connect()
app.use(express.json())

app.use("/", [prodRouter])
app.get('/', (req,res) => {
	res.send('Hi')
})

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});