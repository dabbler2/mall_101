const express = require('express')
const router = express.Router()
const [Products,IDCount] = require("../schemas/products.schema")

// 상품 ID 배정 카운트 가져오기
let getIDCount = async () => {
	const idCount = await IDCount.find({})
	if(idCount.length) return idCount[0].idCount
	await IDCount.create({idCount: 1})
	return 1
}

// 상품 조회
router.get('/prodList', async(req,res) => {
	const prodList = await Products.find({})
	const prodCards = prodList.map(prod => {
		const {prodID,prodName,writerID,availability,writtenTime,lastEditTime} = prod
		return {prodID,prodName,writerID,availability:(availability? "FOR_SALE":"SOLD_OUT"),writtenTime,lastEditTime}
	})
	prodCards.sort((a,b) => (a.writtenTime<b.writtenTime)-(b.writtenTime<a.writtenTime))
	res.json({products: prodCards})
})

// 상품 상세 조회
router.get('/prodList/:prodID', async(req,res) => {
	const prodID = req.params.prodID
	const existsProd = await Products.find({prodID})
	if(existsProd.length){
		const {prodID,prodName,writerID,availability,writtenTime,lastEditTime,comment} = existsProd[0]
		res.json({prodID,prodName,writerID,availability:(availability? "FOR_SALE":"SOLD_OUT"),writtenTime,lastEditTime,comment})
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
	const idCount = await getIDCount()
	const availability = true
	const writtenTime = new Date().toLocaleString('sv')
	const lastEditTime = writtenTime
	const createProd = await Products.create({prodID:idCount,prodName,writerID,password,comment,availability,writtenTime,lastEditTime})
	await IDCount.updateOne({},{$set: {idCount:idCount+1}})
	res.json({success: true, message: "상품 등록이 완료되었습니다."})
})

// 상품 정보 수정
router.put('/prodList/:prodID', async (req,res) => {
	const prodID = req.params.prodID
	if(!prodID)
		return res.status(400).json({success: false, errorMessage: "상품 ID를 입력해주세요."})
	let {availability,password,comment} = req.body
	if(!password)
		return res.status(400).json({success: false, errorMessage: "비밀번호를 입력해주세요."})
	const existsProd = await Products.find({prodID})
	if(!existsProd.length)
		return res.status(400).json({success: false, errorMessage: "해당 상품이 존재하지 않습니다."})
	if(existsProd[0].password!==password)
		return res.status(400).json({success: false, errorMessage: "비밀번호가 일치하지 않습니다."})
	comment ||= ''
	availability = availability===undefined? prodName.availability:Boolean(availability)
	await Products.updateOne({prodID},{$set: {availability,comment,lastEditTime:new Date().toLocaleString('sv')}})
	res.json({success: true, message: "상품 정보 수정이 완료되었습니다."})
})

// 상품 삭제
router.delete('/prodList/:prodID', async (req,res) => {
	const prodID = req.params.prodID
	if(!prodID)
		return res.status(400).json({success: false, errorMessage: "상품 ID를 입력해주세요."})
	const {password} = req.body
	if(!password)
		return res.status(400).json({success: false, errorMessage: "비밀번호를 입력해주세요."})
	const existsProd = await Products.find({prodName:prodID})
	if(!existsProd.length)
		return res.status(400).json({success: false, errorMessage: "해당 상품이 존재하지 않습니다."})
	if(existsProd[0].password!==password)
		return res.status(400).json({success: false, errorMessage: "비밀번호가 일치하지 않습니다."})
	await Products.deleteOne({prodName:prodID})
	res.json({success: true, message: "상품 삭제가 완료되었습니다."})
})

module.exports = router