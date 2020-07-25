'use strict'
var express = require('express')
var commentCtrl = require('../controllers/comentario')

var router = express.Router()

var md_auth = require("../middlewares/authenticated")
const manual = require('../models/manual')

router.post('/comentario/manual/:id',md_auth.auth, commentCtrl.agregar)



module.exports = router