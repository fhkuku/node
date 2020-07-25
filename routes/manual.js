'use strict'
var express = require('express')
var manualCtrl = require('../controllers/manual')

var router = express.Router()

var md_auth = require("../middlewares/authenticated")

var multipart = require("connect-multiparty")
var md_upload = multipart({uploadDir:'./uploads/user'})

router.get('/getManuales',md_auth.auth, manualCtrl.getManuales)
router.get('/getManual/:manualId',md_auth.auth, manualCtrl.getManual)
router.post('/saveManual',[md_upload,md_auth.auth], manualCtrl.saveManual)
router.post('/updateStock',md_auth.auth, manualCtrl.updateExist)
router.get("/buscar/:item",md_auth.auth, manualCtrl.buscar)
router.get("/vendido",manualCtrl.getMasVendido)

module.exports = router