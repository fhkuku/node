'use strict'
var validator = require("validator")
var fs = require("fs")
var path = require('path');
var mensajes = {
    success: (res, mensaje,status) => {
        return res.status(200).send({
            success: true,
            mensaje: mensaje,
            status:status
        })
    },
    successToken: (res, mensaje,status) => {
        res.status(200).send({
            success: true,
            token: mensaje,
            status:status
        })
    },
    error: (res, mensaje,status) => {
        return res.status(500).send({
            success: false,
            mensaje: mensaje,
            status:status
        })
    },
    notFound: (res, mensaje,status) => {
        res.status(400).send({
            success: false,
            mensaje: mensaje,
            status: status
        })
    },
    validate: (listValidations, params) => {
        
        for (var key in listValidations) {
            var itemValid = params[key]
            if(key=="price" || key=="stock"){
                var result = true
            }else{
                var result = !validator.isEmpty(params[key])
            }
            if (key == "email") {
                result = !validator.isEmpty(itemValid) && validator.isEmail(itemValid)
            }
            if (result != true) {
                return {
                    isValidate: false,
                    isNotValide: listValidations[key]
                }
            }
        }
        return {
            isValidate: true
        }
    },
    validarImagen: (req) => {
        
        var allowedExt = ["png", "jpg", "jpeg"]
        if (!req.files.file) {
            return {
                fileName :"avatar.png",
                isValidate:true
            }
        }
        var filePath = req.files.file.path;
        //TODO windows -- var fileSplit = filePath.split('\\');
        var fileSplit = filePath.split('/');
        var fileName = fileSplit[2]
        var extSplit = fileName.split("\.")
        var fileExt = extSplit[1].toLocaleLowerCase()
        if (allowedExt.includes(fileExt)) {
            return {
                fileName:fileName,
                isValidate:true,
                delete:fileSplit
            }
        } else {
          return {
              fileName:filePath,
              isValidate:false
          }
        }
    },
    validarPdfZip: (req) => {
        var allowedExt = ["pdf", "zip"]
        if (!req.files.fichero) {
            return {
                fileName :"avatar.png",
                isValidate:true
            }
        }
        var filePath = req.files.fichero.path;
        //TODO windows -- var fileSplit = filePath.split('\\');
        var fileSplit = filePath.split('/');
        
        var fileName = fileSplit[2]
        var extSplit = fileName.split("\.")
        var fileExt = extSplit[1].toLocaleLowerCase()
        if (allowedExt.includes(fileExt)) {
            return {
                fileName:fileName,
                isValidate:true,
                delete:fileSplit
            }
        } else {
          return {
              fileName:filePath,
              isValidate:false
          }
        }
    }

}
module.exports = mensajes