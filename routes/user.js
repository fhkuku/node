'use strict'
var express = require('express')
var userCtrl = require('../controllers/user')


var router = express.Router()


var md_auth = require("../middlewares/authenticated")

var multipart = require("connect-multiparty")
var md_upload = multipart({uploadDir:'./uploads/user'})


router.post("/register", md_upload,userCtrl.saveUser)
router.post("/login", userCtrl.login)
//router.put("/update",md_auth.auth, userCtrl.update);
router.post("/upload/:id", [md_auth.auth, md_upload], userCtrl.uploadAvatar);
router.get("/avatar/:fileName", userCtrl.getAvatar)

module.exports = router