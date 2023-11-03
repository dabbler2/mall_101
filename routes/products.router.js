const express = require('express')
const router = express.Router()
const Products = require("../schemas/products.schema")
//const {MongoServerError} = require('mongodb')

// 상품 조회
router.get('/prodList', async(req,res) => {
	const prodList = await Products.find({})
	const prodCards = prodList.map(prod => {
		const {prodName,writerID,availability,writtenTime} = prod
		return {prodName,writerID,availability,writtenTime}
	})
	res.json({products: prodCards})
})

// 상품 상세 조회
router.get('/prodList/:prodName', async(req,res) => {
	const prodName = decodeURIComponent(req.params.prodName) // decodeURIComponent로 한글 등 처리
	const existsProd = await Products.find({prodName})
	if(existsProd.length){
		const {prodName,writerID,availability,writtenTime,comment} = existsProd[0]
		res.json({prodName,writerID,availability,writtenTime,comment})
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
		const createProd = await Products.create({prodName,writerID,password,comment,availability,writtenTime:new Date().toISOString().replace('T',' ').slice(0,19)})
		res.json({product: createProd})
	}catch(e){
		//console.log(e instanceof MongoServerError)
		res.json({success: false, errorMessage: "이미 같은 이름의 상품이 있습니다."})
	}
})

// 상품 정보 수정
router.put('/prodList', async (req,res) => {
	let {prodName,availability,password,comment} = req.body
	if(!prodName)
		return res.status(400).json({success: false, errorMessage: "상품명을 입력해주세요."})
	if(!password)
		return res.status(400).json({success: false, errorMessage: "비밀번호를 입력해주세요."})
	const existsProd = await Products.find({prodName})
	if(existsProd.length){
		if(existsProd[0].password!==password)
			return res.status(400).json({success: false, errorMessage: "비밀번호가 일치하지 않습니다."})
		comment ||= ''
		availability = availability===undefined? prodName.availability:Boolean(availability)
		await Products.updateOne({prodName},{$set: {availability,comment}})
	}
	else return res.status(400).json({success: false, errorMessage: "해당 상품이 없습니다."})
	res.json({success: true, message: "상품 정보 수정이 완료되었습니다."})
})

// 상품 삭제
router.delete('/prodList', async (req,res) => {
	const {prodName,password} = req.body
	if(!prodName)
		return res.status(400).json({success: false, errorMessage: "상품명을 입력해주세요."})
	if(!password)
		return res.status(400).json({success: false, errorMessage: "비밀번호를 입력해주세요."})
	const existsProd = await Products.find({prodName})
	if(existsProd.length){
		if(existsProd[0].password!==password)
			return res.status(400).json({success: false, errorMessage: "비밀번호가 일치하지 않습니다."})
		await Products.deleteOne({prodName})
	}
	else return res.status(400).json({success: false, errorMessage: "해당 상품이 없습니다."})
	res.json({success: true, message: "상품 삭제가 완료되었습니다."})
})

module.exports = router