const express = require('express')
const router = express.Router()
const Products = require("../schemas/products.schema")
//const {MongoServerError} = require('mongodb')

// 상품 조회
router.get('/prodList', async(req,res) => {
	const prodList = await Products.find({})
	const prodCards = prodList.map(prod => {
		const {prodName,writerID,availability,writtenTime,lastEditTime} = prod
		return {prodName,writerID,availability:(availability? "FOR_SALE":"SOLD_OUT"),writtenTime,lastEditTime}
	})
	prodCards.sort((a,b) => (a.writtenTime<b.writtenTime)-(b.writtenTime<a.writtenTime))
	res.json({products: prodCards})
})

// 상품 상세 조회
router.get('/prodList/:prodName', async(req,res) => {
	const prodName = req.params.prodName
	const existsProd = await Products.find({prodName})
	if(existsProd.length){
		const {prodName,writerID,availability,writtenTime,lastEditTime,comment} = existsProd[0]
		res.json({prodName,writerID,availability:(availability? "FOR_SALE":"SOLD_OUT"),writtenTime,lastEditTime,comment})
	}
	else res.status(400).json({success: false, errorMessage: "해당 상품이 없습니다."})
})

// 상품 작성
router.post('/uploadProd', async(req,res) => {
	let {prodName,writerID,password,comment} = req.body
	if(!prodName)
		return res.status(400).json({success: false, errorMessage: "상품명을 입력해주세요."})
	if(!writerID)
		return res.status(400).json({success: false, errorMessage: "ID를 입력해주세요."})
	if(!password)
		return res.status(400).json({success: false, errorMessage: "비밀번호를 입력해주세요."})
	comment ||= ''
	const availability = true
	try{
		const writtenTime = new Date().toISOString().replace('T',' ').slice(0,19)
		const lastEditTime = writtenTime
		const createProd = await Products.create({prodName,writerID,password,comment,availability,writtenTime,lastEditTime})
		res.json({success: true, message: "상품 등록이 완료되었습니다."})
	}catch(e){
		//console.log(e instanceof MongoServerError)
		res.json({success: false, errorMessage: "이미 같은 이름의 상품이 있습니다."})
	}
})

// 상품 정보 수정
router.put('/prodList/:prodName', async (req,res) => {
	const prodName = req.params.prodName
	if(!prodName)
		return res.status(400).json({success: false, errorMessage: "상품명을 입력해주세요."})
	let {availability,password,comment} = req.body
	if(!password)
		return res.status(400).json({success: false, errorMessage: "비밀번호를 입력해주세요."})
	const existsProd = await Products.find({prodName})
	if(existsProd.length){
		if(existsProd[0].password!==password)
			return res.status(400).json({success: false, errorMessage: "비밀번호가 일치하지 않습니다."})
		comment ||= ''
		availability = availability===undefined? prodName.availability:Boolean(availability)
		await Products.updateOne({prodName},{$set: {availability,comment,lastEditTime:new Date().toISOString().replace('T',' ').slice(0,19)}})
	}
	else return res.status(400).json({success: false, errorMessage: "해당 상품이 존재하지 않습니다."})
	res.json({success: true, message: "상품 정보 수정이 완료되었습니다."})
})

// 상품 삭제
router.delete('/prodList/:prodName', async (req,res) => {
	const prodName = req.params.prodName
	if(!prodName)
		return res.status(400).json({success: false, errorMessage: "상품명을 입력해주세요."})
	const {password} = req.body
	if(!password)
		return res.status(400).json({success: false, errorMessage: "비밀번호를 입력해주세요."})
	const existsProd = await Products.find({prodName})
	if(existsProd.length){
		if(existsProd[0].password!==password)
			return res.status(400).json({success: false, errorMessage: "비밀번호가 일치하지 않습니다."})
		await Products.deleteOne({prodName})
	}
	else return res.status(400).json({success: false, errorMessage: "해당 상품이 존재하지 않습니다."})
	res.json({success: true, message: "상품 삭제가 완료되었습니다."})
})

module.exports = router