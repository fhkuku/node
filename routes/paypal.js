'use strict'
var express = require('express')
var paypal = require('../controllers/paypal')


var router = express.Router()

var md_auth = require("../middlewares/authenticated")

router.post("/pagar",md_auth.auth, paypal.pagar)
router.get("/success", paypal.success)
router.get("/ventas",paypal.getTotalVenta)
router.get("/venta/:id",paypal.getVentaDetalle)
router.get("/top", paypal.getMasVendido)
router.get("/download/:fichero", paypal.getFile)
module.exports = router