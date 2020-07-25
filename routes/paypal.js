'use strict'
var express = require('express')
var paypal = require('../controllers/paypal')


var router = express.Router()

var md_auth = require("../middlewares/authenticated")

router.get("/pagar", paypal.pagar)
router.get("/success", paypal.success)
router.get("/compras",paypal.getCompras)

module.exports = router